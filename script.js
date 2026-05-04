const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const year = document.querySelector("[data-year]");
const heroVideo = document.querySelector(".hero-video");
const serviceCarousel = document.querySelector("[data-service-carousel]");
const carouselPrev = document.querySelector("[data-carousel-prev]");
const carouselNext = document.querySelector("[data-carousel-next]");
const heroSlides = [...document.querySelectorAll("[data-hero-slide]")];
const heroDots = [...document.querySelectorAll("[data-hero-dot]")];
const industryImage = document.querySelector("[data-industry-image]");
const industryBadges = [...document.querySelectorAll("[data-industry-badge]")];
const industryList = document.querySelector(".industry-list");
const backToTop = document.querySelector("[data-back-to-top]");
let activeHeroSlide = 0;
let heroSlideTimer;
let activeIndustryIndex = 0;
let industryTimer;
let industryHovering = false;

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
  backToTop?.classList.toggle("is-visible", window.scrollY > 620);
};

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  header?.classList.toggle("is-open", Boolean(isOpen));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
    header?.classList.remove("is-open");
  });
});

const playHeroVideo = () => {
  if (!heroVideo) return;
  heroVideo.muted = true;
  heroVideo.loop = true;
  heroVideo.play().catch(() => {});
};

const showHeroSlide = (index) => {
  if (!heroSlides.length) return;
  playHeroVideo();
  activeHeroSlide = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === activeHeroSlide);
  });
  heroDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === activeHeroSlide);
  });
  if (activeHeroSlide === 0) playHeroVideo();
};

const startHeroSlideTimer = () => {
  if (heroSlideTimer || heroSlides.length < 2) return;
  heroSlideTimer = setInterval(() => {
    showHeroSlide(activeHeroSlide + 1);
  }, 10000);
};

const restartHeroSlideTimer = () => {
  clearInterval(heroSlideTimer);
  heroSlideTimer = undefined;
  startHeroSlideTimer();
};

heroVideo?.addEventListener("ended", () => {
  heroVideo.currentTime = 0;
  playHeroVideo();
});

heroVideo?.addEventListener("timeupdate", () => {
  if (!heroVideo.duration) return;
  if (heroVideo.duration - heroVideo.currentTime < 0.18) {
    heroVideo.currentTime = 0.01;
    playHeroVideo();
  }
});

heroVideo?.addEventListener("pause", () => {
  if (!document.hidden) setTimeout(playHeroVideo, 80);
});

heroVideo?.addEventListener("loadedmetadata", playHeroVideo);
heroVideo?.addEventListener("canplay", playHeroVideo);

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) playHeroVideo();
});

const scrollServices = (direction) => {
  if (!serviceCarousel) return;
  const card = serviceCarousel.querySelector(".service-card");
  const distance = card ? card.getBoundingClientRect().width + 18 : 360;
  serviceCarousel.scrollBy({ left: direction * distance, behavior: "smooth" });
};

const setupServicesMarquee = () => {
  if (!serviceCarousel || serviceCarousel.dataset.marqueeReady) return;
  const cards = [...serviceCarousel.children];
  cards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    serviceCarousel.appendChild(clone);
  });
  serviceCarousel.dataset.marqueeReady = "true";
};

const pauseServicesMarquee = () => {
  serviceCarousel?.classList.add("is-paused");
};

const resumeServicesMarquee = () => {
  serviceCarousel?.classList.remove("is-paused");
};

const setIndustryImage = (index) => {
  if (!industryImage || !industryBadges.length) return;
  activeIndustryIndex = (index + industryBadges.length) % industryBadges.length;
  const activeBadge = industryBadges[activeIndustryIndex];
  const nextImage = activeBadge.dataset.image;
  const nextAlt = activeBadge.dataset.alt || activeBadge.textContent.trim();
  if (!nextImage || industryImage.src === nextImage) return;

  industryBadges.forEach((badge, badgeIndex) => {
    badge.classList.toggle("is-active", badgeIndex === activeIndustryIndex);
  });
  industryImage.classList.add("is-changing");
  window.setTimeout(() => {
    industryImage.src = nextImage;
    industryImage.alt = nextAlt;
    industryImage.classList.remove("is-changing");
  }, 140);
};

const startIndustryRotation = () => {
  if (industryTimer || industryBadges.length < 2) return;
  industryTimer = setInterval(() => {
    if (!industryHovering) setIndustryImage(activeIndustryIndex + 1);
  }, 5000);
};

const restartIndustryRotation = () => {
  clearInterval(industryTimer);
  industryTimer = undefined;
  startIndustryRotation();
};

carouselPrev?.addEventListener("click", () => scrollServices(-1));
carouselNext?.addEventListener("click", () => scrollServices(1));
serviceCarousel?.addEventListener("pointerover", (event) => {
  if (event.target.closest(".service-card")) pauseServicesMarquee();
});
serviceCarousel?.addEventListener("pointerout", (event) => {
  const nextTarget = event.relatedTarget;
  if (!nextTarget || !nextTarget.closest?.(".service-card")) resumeServicesMarquee();
});
heroDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showHeroSlide(index);
    restartHeroSlideTimer();
  });
});
industryBadges.forEach((badge, index) => {
  const image = new Image();
  image.src = badge.dataset.image;
  badge.addEventListener("pointerenter", () => {
    industryHovering = true;
    setIndustryImage(index);
  });
  badge.addEventListener("focus", () => {
    industryHovering = true;
    setIndustryImage(index);
  });
  badge.addEventListener("click", () => {
    setIndustryImage(index);
    industryHovering = false;
    restartIndustryRotation();
  });
});
industryList?.addEventListener("pointerleave", () => {
  industryHovering = false;
  restartIndustryRotation();
});
industryList?.addEventListener("focusout", () => {
  industryHovering = false;
  restartIndustryRotation();
});

year.textContent = String(new Date().getFullYear());
updateHeader();
showHeroSlide(0);
startHeroSlideTimer();
setupServicesMarquee();
setIndustryImage(0);
startIndustryRotation();
playHeroVideo();
window.addEventListener("scroll", updateHeader, { passive: true });

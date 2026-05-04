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
let activeHeroSlide = 0;

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
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
  activeHeroSlide = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === activeHeroSlide);
  });
  heroDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === activeHeroSlide);
  });
  if (activeHeroSlide === 0) playHeroVideo();
};

heroVideo?.addEventListener("ended", () => {
  heroVideo.currentTime = 0;
  playHeroVideo();
});

heroVideo?.addEventListener("pause", () => {
  if (!document.hidden) setTimeout(playHeroVideo, 80);
});

heroVideo?.addEventListener("loadedmetadata", playHeroVideo);

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) playHeroVideo();
});

const scrollServices = (direction) => {
  if (!serviceCarousel) return;
  const card = serviceCarousel.querySelector(".service-card");
  const distance = card ? card.getBoundingClientRect().width + 18 : 360;
  serviceCarousel.scrollBy({ left: direction * distance, behavior: "smooth" });
};

carouselPrev?.addEventListener("click", () => scrollServices(-1));
carouselNext?.addEventListener("click", () => scrollServices(1));
heroDots.forEach((dot, index) => {
  dot.addEventListener("click", () => showHeroSlide(index));
});

year.textContent = String(new Date().getFullYear());
updateHeader();
showHeroSlide(0);
playHeroVideo();
window.addEventListener("scroll", updateHeader, { passive: true });

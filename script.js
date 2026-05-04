const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const year = document.querySelector("[data-year]");
const heroVideo = document.querySelector(".hero-video");

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

year.textContent = String(new Date().getFullYear());
updateHeader();
playHeroVideo();
window.addEventListener("scroll", updateHeader, { passive: true });

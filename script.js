// Small interactions for the portfolio website.
const root = document.documentElement;
const themeButton = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const backToTop = document.getElementById('back-to-top');

function updateThemeIcon() {
  const dark = root.dataset.theme === 'dark';
  themeIcon.textContent = dark ? '☀' : '☾';
  themeButton.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
}
updateThemeIcon();

themeButton.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  if (nextTheme === 'dark') root.dataset.theme = 'dark';
  else delete root.dataset.theme;
  try { localStorage.setItem('portfolio-theme', nextTheme); } catch (error) { /* Theme still works for this visit. */ }
  updateThemeIcon();
});

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

// If no profile image has been added, show the initials instead.
const profileImage = document.getElementById('profile-image');
const avatarFallback = document.getElementById('avatar-fallback');
profileImage.addEventListener('load', () => {
  profileImage.style.display = 'block';
  avatarFallback.style.display = 'none';
});
profileImage.addEventListener('error', () => {
  profileImage.style.display = 'none';
  avatarFallback.style.display = 'block';
});

// Reveal sections as they enter the viewport. Keep everything visible if unsupported.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

// Keep the current section highlighted in the navigation.
const sections = document.querySelectorAll('main section[id]');
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.querySelectorAll('a').forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  sections.forEach(section => sectionObserver.observe(section));
}

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 450);
}, { passive: true });
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

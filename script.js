
const floatingNav = document.getElementById('floatingNav');

function handleScroll() {
  if (window.scrollY > 260) {
    floatingNav.classList.add('is-visible');
  } else {
    floatingNav.classList.remove('is-visible');
  }
}

handleScroll();
window.addEventListener('scroll', handleScroll);

const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
  heroVideo.addEventListener('error', () => {
    heroVideo.setAttribute('poster', 'assets/images/logo.png');
  });
}

// Respect reduced-motion preference: pause autoplaying videos
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('video[autoplay]').forEach(v => {
    v.pause();
    v.removeAttribute('autoplay');
  });
}


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

// Interview video player — sound enabled, manual play
const interviewPlayer = document.querySelector('.interview-player');
if (interviewPlayer) {
  const interviewVideo = interviewPlayer.querySelector('video');
  const playBtn = interviewPlayer.querySelector('.interview-play-btn');
  const overlayTitle = interviewPlayer.querySelector('.interview-overlay-title');

  if (playBtn && interviewVideo) {
    playBtn.addEventListener('click', () => {
      interviewVideo.play();
    });

    interviewVideo.addEventListener('play', () => {
      playBtn.classList.add('hidden');
      if (overlayTitle) overlayTitle.classList.add('hidden');
    });

    interviewVideo.addEventListener('pause', () => {
      playBtn.classList.remove('hidden');
      if (overlayTitle) overlayTitle.classList.remove('hidden');
    });

    interviewVideo.addEventListener('ended', () => {
      playBtn.classList.remove('hidden');
      if (overlayTitle) overlayTitle.classList.remove('hidden');
    });
  }
}

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('video[autoplay]').forEach(v => {
    v.pause();
    v.removeAttribute('autoplay');
  });
}

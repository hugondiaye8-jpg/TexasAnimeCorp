
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

// ── Single global vertical gradient ──────────────────────────────────────────
// Computes gradient stop percentages based on real section heights so that:
//   Association section  → TAC blue dominant (black → blue)
//   Lalo section         → TAC yellow dominant (blue → yellow)
//   Portfolio section    → TAC pink dominant  (yellow → pink)
//   End of Portfolio     → fades to white     (pink → white)
function computePageGradient() {
  var totalH = document.body.scrollHeight;
  if (!totalH) return;

  var assoc     = document.getElementById('association');
  var lalo      = document.getElementById('lalo');
  var portfolio = document.getElementById('portfolio');
  if (!assoc || !lalo || !portfolio) return;

  var aTop = assoc.offsetTop;
  var aH   = assoc.offsetHeight;
  var lTop = lalo.offsetTop;
  var lH   = lalo.offsetHeight;
  var pTop = portfolio.offsetTop;
  var pH   = portfolio.offsetHeight;

  // Key milestone pixels along the page
  var bluePeak        = aTop + aH * 0.50;          // TAC blue dominant at mid-association
  var blueYellowBridge = aTop + aH * 0.80;          // blue still present, yellow emerging
  var yellowPeak      = lTop + lH * 0.15;           // TAC yellow dominant in early lalo
  var yellowPinkBridge = lTop + lH * 0.75;          // yellow fading, pink emerging
  var pinkPeak        = pTop + pH * 0.15;           // TAC pink dominant in early portfolio
  var pinkFadeStart   = pTop + pH * 0.72;           // pink starting to fade toward white
  var whiteAt         = pTop + pH;                  // pure white at portfolio end

  function toPercent(px) {
    return (Math.min(100, Math.max(0, (px / totalH) * 100)).toFixed(2)) + '%';
  }

  var stops = [
    ['#000000', 0],                              // page top — pure black
    ['#030510', aTop * 0.30],                    // deep dark through hero
    ['#000000', aTop],                           // association start — pure black
    ['#1B2B65', aTop + aH * 0.18],               // deep blue early in association
    ['#3457C8', aTop + aH * 0.35],               // blue building up
    ['#4D73FF', bluePeak],                       // TAC blue peak — mid association
    ['#6F92FF', aTop + aH * 0.65],               // TAC blue still dominant
    ['#9AB3FF', blueYellowBridge],               // blue fading, bridge to yellow
    ['#C8D6FF', (blueYellowBridge + yellowPeak) / 2],  // blue-yellow mid-bridge
    ['#F5C242', yellowPeak],                     // TAC yellow dominant — in lalo
    ['#F3C040', lTop + lH * 0.40],               // yellow stable
    ['#EDB87A', yellowPinkBridge],               // yellow-to-pink transition
    ['#E893C0', (yellowPinkBridge + pinkPeak) / 2],    // yellow-pink mid-bridge
    ['#E56FD8', pinkPeak],                       // TAC pink dominant — in portfolio
    ['#EFA3E8', pinkFadeStart],                  // pink fading toward white
    ['#F9E0F6', (pinkFadeStart + whiteAt) / 2],  // very light pink
    ['#FFFFFF', whiteAt]                         // white at portfolio end
  ];

  var gradient = 'linear-gradient(to bottom, ' +
    stops.map(function(s) { return s[0] + ' ' + toPercent(s[1]); }).join(', ') +
    ')';

  document.body.style.background = gradient;
}

// Recompute once all resources (images/videos) are loaded for accurate heights
window.addEventListener('load', computePageGradient);

// Recompute on resize (debounced) in case layout reflows
var _gradientResizeTimer;
window.addEventListener('resize', function () {
  clearTimeout(_gradientResizeTimer);
  _gradientResizeTimer = setTimeout(computePageGradient, 150);
});
// ─────────────────────────────────────────────────────────────────────────────

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

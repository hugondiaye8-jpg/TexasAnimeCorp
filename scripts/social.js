/* Exact original Association interview player behavior, migrated for Social.
   The old global script is intentionally not included because it assumes
   a homepage floating logo and colour gradient. */
(function () {
// Interview video player — sound enabled, manual play
const interviewPlayer = document.querySelector('.interview-player');
if (interviewPlayer) {
  const interviewVideo = interviewPlayer.querySelector('video');
  const playBtn = interviewPlayer.querySelector('.interview-play-btn');
  const overlayTitle = interviewPlayer.querySelector('.interview-overlay-title');

  if (playBtn && interviewVideo) {
    playBtn.addEventListener('click', () => {
      // Native controls appear only after the visitor opts to play.
      interviewVideo.controls = true;
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


})();

setInterval(blockYoutubeVideoAds, 200);

function blockYoutubeVideoAds() {
  const $ = (q) => document.querySelector(q);

  // NOTE: use the existence of the skip button to determine if an ad is playing
  const skipButton = $(".ytp-ad-skip-button-modern");
  if (skipButton) {
    const player = $(".video-stream");
    player.muted = true;
    player.currentTime = player.duration - 0.1;
    player.paused && player.play();

    $(".ytp-ad-skip-button")?.click();
    $(".ytp-ad-skip-button-modern")?.click();
  }
}

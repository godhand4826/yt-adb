// helper functions
const $ = (q) => document.querySelector(q);
const $$ = (q) => document.querySelectorAll(q);

// fast forward video ads
const observer = new MutationObserver(() => {
  if (document.querySelector(".video-ads")?.innerHTML) {
    const player = $(".video-stream");
    player.muted = true;
    player.currentTime = player.duration - 0.1;
    player.paused && player.play();

    $(".ytp-ad-skip-button")?.click();
    $(".ytp-ad-skip-button-modern")?.click();
  }
});
const config = { attributes: true, childList: true, characterData: true };
observer.observe($(".video-ads"), config);

// hide static ads
const staticAds = [
  ".ytd-companion-slot-renderer",
  ".ytd-action-companion-ad-renderer",
  ".ytd-watch-next-secondary-results-renderer.sparkles-light-cta",
  ".ytd-unlimited-offer-module-renderer",
  ".ytp-ad-overlay-image",
  ".ytp-ad-text-overlay",
  "div#root.style-scope.ytd-display-ad-renderer.yt-simple-endpoint",
  "div#sparkles-container.style-scope.ytd-promoted-sparkles-web-renderer",
  ".ytd-display-ad-renderer",
  ".ytd-statement-banner-renderer",
  ".ytd-in-feed-ad-layout-renderer",
  "div#player-ads.style-scope.ytd-watch-flexy",
  "div#panels.style-scope.ytd-watch-flexy",
  ".ytd-banner-promo-renderer",
  ".ytd-video-masthead-ad-v3-renderer",
  ".ytd-primetime-promo-renderer",
].map((q) => q.concat(':not([style*="display: none"])'));

$$(staticAds.join(", ")).forEach((ad) => {
  console.log(ad);
  ad.style.display = "none";
});

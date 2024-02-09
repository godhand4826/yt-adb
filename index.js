const $ = (q) => document.querySelector(q);
const $$ = (q) => document.querySelectorAll(q);
const log = (...msg) => console.log('[yt-adb]', ...msg);

handleAds();
autoSetupVideoAdObserver();

function autoSetupVideoAdObserver() {
  const stop = observe(
    $('body'),
    debounce(() => {
      if ($('.video-ads')) {
        registerVideoAdObserver();
        stop();
      } else {
        log('.video-ads not found');
      }
    }),
  );
}

function registerVideoAdObserver() {
  log('register video ads observer');

  handleAds();
  observe($('.video-ads'), () => handleAds());

  log('register video ads observer successful');
}

function handleAds() {
  hideStaticAds();
  fastForwardVideoAds();
}

function hideStaticAds() {
  log('hide static ads');

  const adsSelectors = [
    '.ytd-companion-slot-renderer',
    '.ytd-action-companion-ad-renderer',
    '.ytd-watch-next-secondary-results-renderer.sparkles-light-cta',
    '.ytd-unlimited-offer-module-renderer',
    '.ytp-ad-overlay-image',
    '.ytp-ad-text-overlay',
    '#masthead-ad.style-scope.ytd-rich-grid-renderer',
    'div#root.style-scope.ytd-display-ad-renderer.yt-simple-endpoint',
    'div#sparkles-container.style-scope.ytd-promoted-sparkles-web-renderer',
    '.ytd-display-ad-renderer',
    '.ytd-statement-banner-renderer',
    '.ytd-in-feed-ad-layout-renderer',
    'div#player-ads.style-scope.ytd-watch-flexy',
    'div#panels.style-scope.ytd-watch-flexy',
    '.ytd-banner-promo-renderer',
    '.ytd-video-masthead-ad-v3-renderer',
    '.ytd-primetime-promo-renderer',
  ];

  let count = 0;
  $$(
    adsSelectors.map((q) => `${q}:not([style*="display: none"])`).join(','),
  ).forEach((ad) => {
    ad.style.display = 'none';
    count += 1;
  });
  log(`${count} static ads hidden`);
}

function fastForwardVideoAds() {
  const videoContainer = document.getElementById('movie_player');
  const isAd =
    videoContainer?.classList.contains('ad-interrupting') ||
    videoContainer?.classList.contains('ad-showing');
  if (!isAd) {
    return;
  }

  log('fast forward video ads');

  const player = $('.video-stream');
  if (player) {
    player.muted = true;
    player.currentTime = player.duration - 0.1;
    player.paused && player.play();
  }

  $('.ytp-ad-skip-button')?.click();
  $('.ytp-ad-skip-button-modern')?.click();
}

function observe(target, callback) {
  const observer = new MutationObserver(callback);
  const config = { attributes: true, childList: true, characterData: true };
  observer.observe(target, config);

  return () => observer.disconnect();
}

function debounce(callback, time = 800) {
  let debounceTimer;
  return () => {
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(callback, time);
  };
}

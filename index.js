const $ = (q) => document.querySelector(q);
const $$ = (q) => document.querySelectorAll(q);
const log = (...msg) => console.log('[YT Ad Blocker]', ...msg);

handleAds();
autoSetupVideoAdObserver();

function autoSetupVideoAdObserver() {
  function setup() {
    log('setup video ads observer');
    if (registerVideoAdObserver()) {
      log('setup successful');
      return true;
    } else {
      log('setup failed');
      return false;
    }
  }

  if (setup()) return;

  log('retry every 5 seconds');
  const id = setInterval(() => {
    if (setup()) {
      clearInterval(id);
    }
  }, 5000);
}

function registerVideoAdObserver() {
  log('register video ads observer');
  const videoAds = $('.video-ads');

  if (!videoAds) {
    log('register video ads observer failed: video ads element not found');
    return false;
  }

  handleAds();
  observe(videoAds, () => {
    log('video ads changed');
    handleAds();
  });

  log('register video ads observer successful');
  return true;
}

function handleAds() {
  hideStaticAds();
  fastForwardVideoAds();
}

function hideStaticAds() {
  log('hide static ads');

  const staticAds = [
    '.ytd-companion-slot-renderer',
    '.ytd-action-companion-ad-renderer',
    '.ytd-watch-next-secondary-results-renderer.sparkles-light-cta',
    '.ytd-unlimited-offer-module-renderer',
    '.ytp-ad-overlay-image',
    '.ytp-ad-text-overlay',
    'div#masthead-ad.style-scope.ytd-rich-grid-renderer',
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
  ].map((q) => q.concat(':not([style*="display: none"])'));

  const ads = $$(staticAds.join(', '));
  ads.forEach((ad) => {
    log('hide ad', ad);
    ad.style.display = 'none';
  });
  log(`${ads.length} static ads hidden`);
}

function fastForwardVideoAds() {
  if ($('.video-ads')?.innerHTML) {
    log('fast forward video ads');
    const player = $('.video-stream');
    player.muted = true;
    player.currentTime = player.duration - 0.1;
    player.paused && player.play();

    $('.ytp-ad-skip-button')?.click();
    $('.ytp-ad-skip-button-modern')?.click();
  }
}

function observe(target, callback) {
  const observer = new MutationObserver(callback);
  const config = { attributes: true, childList: true, characterData: true };
  observer.observe(target, config);
  // observer.disconnect();
}

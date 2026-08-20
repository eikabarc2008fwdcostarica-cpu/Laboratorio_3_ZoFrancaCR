(function () {
  function setPreview(active) {
    document.body.classList.toggle('mobile-preview-active', active);
    document.querySelector('#mobilePreviewButton')?.setAttribute('aria-pressed', String(active));
    document.querySelector('#mobileExitBar')?.setAttribute('aria-hidden', String(!active));
  }

  document.addEventListener('zofranca:ui-ready', function () {
    document.querySelector('#mobilePreviewButton')?.addEventListener('click', function () {
      setPreview(true);
    });

    document.querySelector('#exitMobilePreview')?.addEventListener('click', function () {
      setPreview(false);
      document.querySelector('#mobilePreviewButton')?.focus();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && document.body.classList.contains('mobile-preview-active')) {
        setPreview(false);
      }
    });
  });
})();

(function () {
  document.addEventListener('zofranca:ui-ready', function () {
    const shell = document.querySelector('#appShell');
    const openButton = document.querySelector('#mobilePreviewButton');
    const exitBar = document.querySelector('#mobileExitBar');
    const closeButton = document.querySelector('#exitMobilePreview');
    if (!shell || !openButton || !exitBar || !closeButton) return;

    const overlay = document.createElement('div');
    overlay.className = 'mobile-preview-overlay';
    overlay.id = 'mobilePreviewOverlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'mobilePreviewTitle');
    overlay.hidden = true;
    overlay.innerHTML = `
      <div class="mobile-preview-toolbar">
        <div>
          <strong id="mobilePreviewTitle">Vista móvil</strong>
          <span>390 × 844 px</span>
        </div>
      </div>
      <div class="mobile-preview-stage">
        <div class="mobile-device-frame" id="mobileDeviceFrame"></div>
      </div>`;

    const toolbar = overlay.querySelector('.mobile-preview-toolbar');
    const deviceFrame = overlay.querySelector('#mobileDeviceFrame');
    toolbar.append(exitBar);
    document.body.append(overlay);

    let shellAnchor = null;
    let pageScrollPosition = 0;

    function openPreview() {
      if (document.body.classList.contains('mobile-preview-active')) return;

      pageScrollPosition = window.scrollY;
      shellAnchor = document.createComment('mobile-preview-shell-position');
      shell.parentNode.insertBefore(shellAnchor, shell);
      deviceFrame.append(shell);

      overlay.hidden = false;
      document.body.classList.add('mobile-preview-active');
      openButton.setAttribute('aria-pressed', 'true');
      exitBar.setAttribute('aria-hidden', 'false');
      closeButton.focus();
    }

    function closePreview() {
      if (!document.body.classList.contains('mobile-preview-active')) return;

      if (shellAnchor?.parentNode) {
        shellAnchor.parentNode.insertBefore(shell, shellAnchor);
        shellAnchor.remove();
      }

      document.body.classList.remove('mobile-preview-active');
      overlay.hidden = true;
      openButton.setAttribute('aria-pressed', 'false');
      exitBar.setAttribute('aria-hidden', 'true');
      window.scrollTo(0, pageScrollPosition);
      openButton.focus();
      shellAnchor = null;
    }

    openButton.addEventListener('click', openPreview);
    closeButton.addEventListener('click', closePreview);
    overlay.addEventListener('click', function (event) {
      if (event.target === overlay || event.target.classList.contains('mobile-preview-stage')) closePreview();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && document.body.classList.contains('mobile-preview-active')) {
        closePreview();
      }
    });
  });
})();

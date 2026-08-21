(function () {
  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', href: '/pages/index.html' },
    { id: 'solicitudes', label: 'Solicitudes', icon: 'clipboard-list', href: '/pages/nueva-solicitud.html' },
    { id: 'empresas', label: 'Empresas', icon: 'building-2', href: '/pages/detalle.html' },
    { id: 'cumplimiento', label: 'Cumplimiento', icon: 'badge-check', href: '/pages/cumplimiento.html' },
    { id: 'alertas', label: 'Alertas', icon: 'triangle-alert', href: '/pages/alertas.html' },
    { id: 'historial', label: 'Historial', icon: 'history', href: '/pages/historial.html' },
    { id: 'configuracion', label: 'Configuración', icon: 'settings', href: '/pages/index.html#configuracion' }
  ];

  function buildSidebar(activePage) {
    const links = navigation.map(function (item) {
      const current = item.id === activePage ? ' aria-current="page"' : '';
      return `<a class="nav-link" href="${item.href}"${current}><i class="nav-icon" data-lucide="${item.icon}" aria-hidden="true"></i><span>${item.label}</span></a>`;
    }).join('');

    return `<aside class="sidebar" aria-label="Navegación principal">
      <a class="brand" href="/pages/index.html" aria-label="ZoFranca CR, ir al Dashboard">
        <span class="brand-mark" aria-hidden="true">ZF</span>
        <span class="brand-name">ZoFranca CR</span>
      </a>
      <nav class="sidebar-nav">${links}</nav>
      <div class="sidebar-footer">Sistema académico de gestión</div>
    </aside>`;
  }

  function buildHeader() {
    return `<header class="topbar">
      <div class="topbar-search">
        <i class="search-icon" data-lucide="search" aria-hidden="true"></i>
        <label class="visually-hidden" for="globalSearch">Buscar en ZoFranca CR</label>
        <input class="input" id="globalSearch" type="search" placeholder="Buscar..." autocomplete="off">
      </div>
      <div class="topbar-actions">
        <button class="btn btn-secondary" id="mobilePreviewButton" type="button" aria-pressed="false">
          <i data-lucide="smartphone" aria-hidden="true"></i><span class="action-label">Vista móvil</span>
        </button>
        <button class="btn btn-secondary" id="themeToggle" type="button" aria-pressed="false">
          <i data-theme-icon data-lucide="moon" aria-hidden="true"></i><span class="action-label" data-theme-label>Modo oscuro</span>
        </button>
        <button class="icon-btn" type="button" aria-label="Notificaciones">
          <i data-lucide="bell" aria-hidden="true"></i><span class="notification-dot" aria-hidden="true"></span>
        </button>
        <a class="icon-btn" href="/pages/index.html#configuracion" aria-label="Configuración"><i data-lucide="settings" aria-hidden="true"></i></a>
        <div class="analyst-profile" aria-label="Usuario actual: Analista">
          <span class="avatar" aria-hidden="true">AN</span>
          <span class="profile-copy"><strong>Analista</strong><small>Administrador</small></span>
        </div>
      </div>
    </header>`;
  }

  document.addEventListener('DOMContentLoaded', function () {
    const main = document.querySelector('main');
    if (!main) return;

    const activePage = document.body.dataset.page || 'dashboard';
    const shell = document.createElement('div');
    shell.className = 'app-shell';
    shell.id = 'appShell';
    shell.innerHTML = `${buildSidebar(activePage)}<div class="app-area">${buildHeader()}</div>`;
    shell.querySelector('.app-area').append(main);
    document.body.prepend(shell);

    const exitBar = document.createElement('div');
    exitBar.className = 'mobile-exit-bar';
    exitBar.id = 'mobileExitBar';
    exitBar.setAttribute('aria-hidden', 'true');
    exitBar.innerHTML = '<button class="btn btn-primary" id="exitMobilePreview" type="button">Salir de vista móvil</button>';
    document.body.append(exitBar);

    window.lucide?.createIcons();
    document.dispatchEvent(new CustomEvent('zofranca:ui-ready'));
  });
})();

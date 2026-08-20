(function () {
  const STORAGE_KEY = 'zofranca-theme';
  const root = document.documentElement;

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    const button = document.querySelector('#themeToggle');
    if (!button) return;

    const isDark = theme === 'dark';
    button.setAttribute('aria-pressed', String(isDark));
    button.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    button.querySelector('[data-theme-icon]').textContent = isDark ? '☀' : '☾';
    button.querySelector('[data-theme-label]').textContent = isDark ? 'Modo claro' : 'Modo oscuro';
  }

  applyTheme(getPreferredTheme());

  document.addEventListener('zofranca:ui-ready', function () {
    applyTheme(root.dataset.theme || getPreferredTheme());
    document.querySelector('#themeToggle')?.addEventListener('click', function () {
      const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEY, nextTheme);
      applyTheme(nextTheme);
    });
  });
})();

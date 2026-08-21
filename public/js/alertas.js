(function () {
  const tableBody = document.querySelector('#monitoringTableBody');
  if (!tableBody) return;

  const PAGE_SIZE = 5;
  const state = {
    companies: [],
    reports: [],
    alerts: [],
    rows: [],
    filteredRows: [],
    currentPage: 1
  };

  const elements = {
    monitored: document.querySelector('#metricMonitored'),
    compliant: document.querySelector('#metricCompliant'),
    alerts: document.querySelector('#metricAlerts'),
    pending: document.querySelector('#metricPending'),
    criticalAlert: document.querySelector('#criticalAlert'),
    criticalMessage: document.querySelector('#criticalAlertMessage'),
    summaryButton: document.querySelector('#generateAiSummary'),
    summary: document.querySelector('#aiSummary'),
    summaryText: document.querySelector('#aiSummaryText'),
    search: document.querySelector('#alertsSearch'),
    statusFilter: document.querySelector('#alertsStatusFilter'),
    interfaceState: document.querySelector('#monitoringState'),
    interfaceStateTitle: document.querySelector('#monitoringStateTitle'),
    interfaceStateMessage: document.querySelector('#monitoringStateMessage'),
    tableContainer: document.querySelector('#monitoringTableContainer'),
    pagination: document.querySelector('#alertsPagination'),
    previousPage: document.querySelector('#alertsPreviousPage'),
    nextPage: document.querySelector('#alertsNextPage'),
    pageInfo: document.querySelector('#alertsPageInfo')
  };

  const currencyFormatter = new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  function normalize(value) {
    return String(value ?? '').trim().toLocaleLowerCase('es');
  }

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);
  }

  function isActiveAlert(alert) {
    return !['cerrada', 'resuelta'].includes(normalize(alert.estado));
  }

  function deriveStatus(report, activeAlerts) {
    if (activeAlerts.length > 0) return 'Alerta';
    if (!report || ['pendiente', 'en-revision', 'revisar'].includes(normalize(report.estado))) return 'Pendiente';
    return 'En regla';
  }

  function getBadgeClass(status) {
    return ({ 'En regla': 'badge-success', Alerta: 'badge-danger', Pendiente: 'badge-warning' })[status] || 'badge-info';
  }

  function setInterfaceState(type, title, message) {
    const icons = { loading: 'loader-circle', error: 'circle-alert', empty: 'inbox', available: 'circle-check' };
    const icon = elements.interfaceState.querySelector('svg, [data-lucide]');

    elements.interfaceState.hidden = false;
    elements.interfaceState.className = `alert monitoring-state${type === 'error' ? ' alert-danger' : type === 'available' ? ' alert-success' : ''}`;
    elements.interfaceStateTitle.textContent = title;
    elements.interfaceStateMessage.textContent = message;
    icon.setAttribute('data-lucide', icons[type]);
    icon.classList.toggle('spinner-icon', type === 'loading');
    window.lucide?.createIcons();
  }

  function buildRows() {
    const companyMap = new Map(state.companies.map(company => [company.id, company]));
    const reportsByCompany = new Map();

    state.reports.forEach(report => {
      const companyReports = reportsByCompany.get(report.empresaId) || [];
      companyReports.push(report);
      reportsByCompany.set(report.empresaId, companyReports);
    });

    const reportRows = state.reports.map(report => {
      const company = companyMap.get(report.empresaId);
      const activeAlerts = state.alerts.filter(alert => alert.reporteId === report.id && isActiveAlert(alert));
      return {
        company,
        report,
        activeAlerts,
        status: deriveStatus(report, activeAlerts)
      };
    });

    const companiesWithoutReports = state.companies
      .filter(company => !reportsByCompany.has(company.id))
      .map(company => ({ company, report: null, activeAlerts: [], status: 'Pendiente' }));

    state.rows = [...reportRows, ...companiesWithoutReports].sort((a, b) => {
      const dateA = a.report?.fecha ? new Date(a.report.fecha).getTime() : 0;
      const dateB = b.report?.fecha ? new Date(b.report.fecha).getTime() : 0;
      return dateB - dateA;
    });
    state.filteredRows = [...state.rows];
  }

  function getLatestRowByCompany() {
    const latestRows = new Map();
    state.rows.forEach(row => {
      if (row.company && !latestRows.has(row.company.id)) latestRows.set(row.company.id, row);
    });
    return latestRows;
  }

  function updateMetrics() {
    const latestRows = getLatestRowByCompany();
    const companiesWithActiveAlerts = new Set(state.alerts.filter(isActiveAlert).map(alert => alert.empresaId));
    const compliantCompanies = [...latestRows.values()].filter(row => row.status === 'En regla' && !companiesWithActiveAlerts.has(row.company.id)).length;
    const pendingReports = state.rows.filter(row => row.status === 'Pendiente').length;

    elements.monitored.textContent = state.companies.length;
    elements.compliant.textContent = compliantCompanies;
    elements.alerts.textContent = companiesWithActiveAlerts.size;
    elements.pending.textContent = pendingReports;
  }

  function renderCriticalAlert() {
    const criticalAlerts = state.alerts.filter(alert => isActiveAlert(alert) && normalize(alert.prioridad) === 'alta');
    elements.criticalAlert.hidden = criticalAlerts.length === 0;
    if (criticalAlerts.length === 0) return;

    const companyMap = new Map(state.companies.map(company => [company.id, company.nombre]));
    const firstAlert = criticalAlerts[0];
    const companyName = companyMap.get(firstAlert.empresaId) || 'una empresa monitoreada';
    elements.criticalMessage.textContent = `${criticalAlerts.length} alerta${criticalAlerts.length === 1 ? '' : 's'} de prioridad alta. ${companyName}: ${firstAlert.mensaje}`;
  }

  function renderTable() {
    const totalPages = Math.max(1, Math.ceil(state.filteredRows.length / PAGE_SIZE));
    state.currentPage = Math.min(state.currentPage, totalPages);
    const start = (state.currentPage - 1) * PAGE_SIZE;
    const pageRows = state.filteredRows.slice(start, start + PAGE_SIZE);

    tableBody.innerHTML = pageRows.map(row => {
      const company = row.company || {};
      const report = row.report || {};
      const jobs = `${report.empleosReales ?? '—'} / ${company.empleosComprometidos ?? '—'}`;
      const investment = `${currencyFormatter.format(Number(report.inversionEjecutada) || 0)} / ${currencyFormatter.format(Number(company.inversionComprometida) || 0)}`;
      const exports = `${currencyFormatter.format(Number(report.exportaciones) || 0)} / ${currencyFormatter.format(Number(company.exportacionesComprometidas) || 0)}`;
      return `<tr>
        <td data-label="Empresa"><strong>${escapeHTML(company.nombre || 'Empresa no disponible')}</strong></td>
        <td data-label="Periodo">${escapeHTML(report.periodo || 'Sin reporte')}</td>
        <td data-label="Empleos actual/meta">${escapeHTML(jobs)}</td>
        <td data-label="Inversión actual/meta">${escapeHTML(investment)}</td>
        <td data-label="Exportaciones actual/meta">${escapeHTML(exports)}</td>
        <td data-label="Estado"><span class="badge ${getBadgeClass(row.status)}">${row.status}</span></td>
        <td data-label="Acción"><a class="table-action" href="/pages/detalle.html?id=${encodeURIComponent(company.id || '')}">Ver detalle</a></td>
      </tr>`;
    }).join('');

    elements.tableContainer.hidden = pageRows.length === 0;
    elements.pagination.hidden = state.filteredRows.length === 0;
    elements.pageInfo.textContent = `Página ${state.currentPage} de ${totalPages}`;
    elements.previousPage.disabled = state.currentPage === 1;
    elements.nextPage.disabled = state.currentPage === totalPages;

    if (state.filteredRows.length === 0) {
      setInterfaceState('empty', 'Sin resultados', 'No hay empresas o reportes que coincidan con los filtros.');
    } else {
      setInterfaceState('available', 'Datos disponibles', `${state.filteredRows.length} registros de monitoreo encontrados.`);
    }
  }

  function applyFilters() {
    const searchTerm = normalize(elements.search.value);
    const selectedStatus = elements.statusFilter.value;
    state.filteredRows = state.rows.filter(row => {
      const matchesCompany = normalize(row.company?.nombre).includes(searchTerm);
      const matchesStatus = !selectedStatus || row.status === selectedStatus;
      return matchesCompany && matchesStatus;
    });
    state.currentPage = 1;
    renderTable();
  }

  async function generateLocalSummary() {
    elements.summaryButton.disabled = true;
    const originalText = elements.summaryButton.querySelector('span').textContent;
    elements.summaryButton.querySelector('span').textContent = 'Analizando datos';

    await new Promise(resolve => setTimeout(resolve, 300));

    const monitored = state.companies.length;
    const activeAlerts = new Set(state.alerts.filter(isActiveAlert).map(alert => alert.empresaId)).size;
    const pending = state.rows.filter(row => row.status === 'Pendiente').length;
    elements.summaryText.textContent = `Apoyo analítico: se monitorean ${monitored} empresas; ${activeAlerts} presentan alertas activas y ${pending} reportes están pendientes. Este resumen orienta la revisión del analista y no constituye una decisión automática.`;
    elements.summary.hidden = false;
    elements.summaryButton.querySelector('span').textContent = originalText;
    elements.summaryButton.disabled = false;
  }

  async function loadMonitoring() {
    setInterfaceState('loading', 'Cargando monitoreo', 'Consultando empresas, reportes y alertas.');
    elements.tableContainer.hidden = true;
    elements.pagination.hidden = true;

    try {
      const [companies, reports, alerts] = await Promise.all([
        window.ZoFrancaAPI.get('/empresas'),
        window.ZoFrancaAPI.get('/reportes'),
        window.ZoFrancaAPI.get('/alertas')
      ]);

      if (![companies, reports, alerts].every(Array.isArray)) throw new Error('La API devolvió una estructura inesperada.');
      state.companies = companies;
      state.reports = reports;
      state.alerts = alerts;
      buildRows();
      updateMetrics();
      renderCriticalAlert();
      renderTable();
      elements.summaryButton.disabled = false;
    } catch (error) {
      console.error('No fue posible cargar el monitoreo:', error);
      setInterfaceState('error', 'No fue posible cargar el monitoreo', 'Compruebe que la API esté activa en el puerto 3005 e intente nuevamente.');
      [elements.monitored, elements.compliant, elements.alerts, elements.pending].forEach(metric => { metric.textContent = '—'; });
    }
  }

  elements.search.addEventListener('input', applyFilters);
  elements.statusFilter.addEventListener('change', applyFilters);
  elements.previousPage.addEventListener('click', () => {
    if (state.currentPage > 1) {
      state.currentPage -= 1;
      renderTable();
    }
  });
  elements.nextPage.addEventListener('click', () => {
    const totalPages = Math.ceil(state.filteredRows.length / PAGE_SIZE);
    if (state.currentPage < totalPages) {
      state.currentPage += 1;
      renderTable();
    }
  });
  elements.summaryButton.addEventListener('click', generateLocalSummary);

  loadMonitoring();
})();

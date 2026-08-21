(function () {
  const tableBody = document.querySelector('#requestsTableBody');
  if (!tableBody) return;

  const PAGE_SIZE = 5;
  const state = {
    requests: [],
    filteredRequests: [],
    currentPage: 1
  };

  const elements = {
    total: document.querySelector('#metricTotal'),
    recommended: document.querySelector('#metricRecommended'),
    review: document.querySelector('#metricReview'),
    rejected: document.querySelector('#metricRejected'),
    search: document.querySelector('#dashboardSearch'),
    statusFilter: document.querySelector('#dashboardStatusFilter'),
    sectorFilter: document.querySelector('#dashboardSectorFilter'),
    status: document.querySelector('#dashboardState'),
    statusTitle: document.querySelector('#dashboardStateTitle'),
    statusMessage: document.querySelector('#dashboardStateMessage'),
    tableContainer: document.querySelector('#requestsTableContainer'),
    pagination: document.querySelector('#dashboardPagination'),
    previousPage: document.querySelector('#previousPage'),
    nextPage: document.querySelector('#nextPage'),
    pageInfo: document.querySelector('#pageInfo')
  };

  const currencyFormatter = new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  const dateFormatter = new Intl.DateTimeFormat('es-CR', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
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

  function formatSector(sector) {
    return String(sector ?? 'Sin sector')
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  function formatDate(date) {
    const parsedDate = new Date(date);
    return Number.isNaN(parsedDate.getTime()) ? 'Sin fecha' : dateFormatter.format(parsedDate);
  }

  function getBadgeClass(status) {
    const badgeClasses = {
      Recomendada: 'badge-success',
      Revisar: 'badge-warning',
      Rechazada: 'badge-danger',
      pendiente: 'badge-info'
    };
    return badgeClasses[status] || 'badge-info';
  }

  function getStatusLabel(status) {
    return status === 'Revisar' ? 'En revisión' : status || 'Sin estado';
  }

  function setInterfaceState(type, title, message) {
    const icons = {
      loading: 'loader-circle',
      error: 'circle-alert',
      empty: 'inbox',
      available: 'circle-check'
    };
    const icon = elements.status.querySelector('svg, [data-lucide]');

    elements.status.hidden = false;
    elements.status.className = `alert dashboard-state${type === 'error' ? ' alert-danger' : type === 'available' ? ' alert-success' : ''}`;
    elements.statusTitle.textContent = title;
    elements.statusMessage.textContent = message;
    icon.setAttribute('data-lucide', icons[type]);
    icon.classList.toggle('spinner-icon', type === 'loading');
    window.lucide?.createIcons();
  }

  function updateMetrics() {
    elements.total.textContent = state.requests.length;
    elements.recommended.textContent = state.requests.filter(item => item.estado === 'Recomendada').length;
    elements.review.textContent = state.requests.filter(item => item.estado === 'Revisar').length;
    elements.rejected.textContent = state.requests.filter(item => item.estado === 'Rechazada').length;
  }

  function populateSectorFilter() {
    const sectors = [...new Set(state.requests.map(item => item.sector).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, 'es'));

    sectors.forEach(sector => {
      const option = document.createElement('option');
      option.value = sector;
      option.textContent = formatSector(sector);
      elements.sectorFilter.append(option);
    });
  }

  function renderTable() {
    const totalPages = Math.max(1, Math.ceil(state.filteredRequests.length / PAGE_SIZE));
    state.currentPage = Math.min(state.currentPage, totalPages);
    const start = (state.currentPage - 1) * PAGE_SIZE;
    const pageRequests = state.filteredRequests.slice(start, start + PAGE_SIZE);

    tableBody.innerHTML = pageRequests.map(request => {
      const score = Number.isFinite(Number(request.puntajeIA)) && request.puntajeIA !== null
        ? Number(request.puntajeIA)
        : 'Pendiente';
      return `<tr>
        <td data-label="Empresa"><strong>${escapeHTML(request.empresa)}</strong></td>
        <td data-label="Sector">${escapeHTML(formatSector(request.sector))}</td>
        <td data-label="Inversión">${escapeHTML(currencyFormatter.format(Number(request.inversionProyectada) || 0))}</td>
        <td data-label="Empleos">${escapeHTML(request.empleosProyectados ?? 0)}</td>
        <td data-label="Puntaje IA">${escapeHTML(score)}</td>
        <td data-label="Estado"><span class="badge ${getBadgeClass(request.estado)}">${escapeHTML(getStatusLabel(request.estado))}</span></td>
        <td data-label="Fecha">${escapeHTML(formatDate(request.fecha))}</td>
        <td data-label="Acción"><a class="table-action" href="detalle.html?id=${encodeURIComponent(request.id)}">Ver detalle</a></td>
      </tr>`;
    }).join('');

    elements.tableContainer.hidden = pageRequests.length === 0;
    elements.pagination.hidden = state.filteredRequests.length === 0;
    elements.pageInfo.textContent = `Página ${state.currentPage} de ${totalPages}`;
    elements.previousPage.disabled = state.currentPage === 1;
    elements.nextPage.disabled = state.currentPage === totalPages;

    if (state.filteredRequests.length === 0) {
      setInterfaceState('empty', 'Sin resultados', 'No hay solicitudes que coincidan con los filtros seleccionados.');
    } else {
      setInterfaceState('available', 'Datos disponibles', `${state.filteredRequests.length} solicitudes encontradas.`);
    }
  }

  function applyFilters() {
    const searchTerm = normalize(elements.search.value);
    const selectedStatus = elements.statusFilter.value;
    const selectedSector = elements.sectorFilter.value;

    state.filteredRequests = state.requests.filter(request => {
      const matchesCompany = normalize(request.empresa).includes(searchTerm);
      const matchesStatus = !selectedStatus || request.estado === selectedStatus;
      const matchesSector = !selectedSector || request.sector === selectedSector;
      return matchesCompany && matchesStatus && matchesSector;
    });
    state.currentPage = 1;
    renderTable();
  }

  async function loadDashboard() {
    setInterfaceState('loading', 'Cargando solicitudes', 'Consultando la información de la API local.');
    elements.tableContainer.hidden = true;
    elements.pagination.hidden = true;

    try {
      const requests = await window.ZoFrancaAPI.get('/solicitudes');
      if (!Array.isArray(requests)) throw new Error('La respuesta de solicitudes no es una lista.');

      state.requests = requests.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      state.filteredRequests = [...state.requests];
      updateMetrics();
      populateSectorFilter();
      renderTable();
    } catch (error) {
      console.error('No fue posible cargar el Dashboard:', error);
      setInterfaceState('error', 'No fue posible cargar las solicitudes', 'Compruebe que la API esté activa en el puerto 3005 e intente nuevamente.');
      [elements.total, elements.recommended, elements.review, elements.rejected].forEach(metric => { metric.textContent = '—'; });
    }
  }

  elements.search.addEventListener('input', applyFilters);
  elements.statusFilter.addEventListener('change', applyFilters);
  elements.sectorFilter.addEventListener('change', applyFilters);
  elements.previousPage.addEventListener('click', () => {
    if (state.currentPage > 1) {
      state.currentPage -= 1;
      renderTable();
    }
  });
  elements.nextPage.addEventListener('click', () => {
    const totalPages = Math.ceil(state.filteredRequests.length / PAGE_SIZE);
    if (state.currentPage < totalPages) {
      state.currentPage += 1;
      renderTable();
    }
  });

  loadDashboard();
})();

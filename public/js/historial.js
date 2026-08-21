/**
 * Lógica de negocio y presentación para la pantalla Historial (Trazabilidad de Expediente) - ZoFranca CR
 * Responsable: Eiker / feature-eiker
 * Carga de datos de trazabilidad desde API local, filtrado de eventos, panel lateral y manejo de API no disponible.
 */

document.addEventListener('DOMContentLoaded', initHistorial);
document.addEventListener('zofranca:ui-ready', initHistorial);

let initialized = false;
let currentExpediente = null;
let currentFilter = 'todos';

function initHistorial() {
  if (initialized) return;
  const container = document.getElementById('historialSection');
  if (!container) return;
  initialized = true;

  // DOM Elements
  const expedienteSelector = document.getElementById('expedienteSelector');
  const eventSearchInput = document.getElementById('eventSearchInput');
  const filterChipsGroup = document.getElementById('filterChipsGroup');
  const statusBanner = document.getElementById('statusBanner');
  const statusMessage = document.getElementById('statusMessage');
  const btnRetryApi = document.getElementById('btnRetryApi');
  const timelineList = document.getElementById('timelineList');
  const totalEventsCounter = document.getElementById('totalEventsCounter');

  // Lateral Card Elements
  const latEmpresa = document.getElementById('latEmpresa');
  const latCedula = document.getElementById('latCedula');
  const latRegimen = document.getElementById('latRegimen');
  const latParque = document.getElementById('latParque');
  const latAcuerdo = document.getElementById('latAcuerdo');
  const latAnalista = document.getElementById('latAnalista');
  const latDias = document.getElementById('latDias');
  const latDocumentos = document.getElementById('latDocumentos');

  // 1. Cargar expedientes iniciales
  cargarExpedientes();

  async function cargarExpedientes() {
    setStatus('info', 'Cargando expedientes y trazabilidad desde la API...');
    try {
      const response = await window.ZoFrancaAPI.getHistorialExpedientes();
      const isOnline = response.isOnline;
      const expedientes = response.data;

      if (!isOnline) {
        setStatus('warning', 'API local no disponible (Servidor fuera de línea). Mostrando trazabilidad en modo de contingencia local.');
      } else {
        setStatus('hidden', '');
      }

      if (expedienteSelector && Array.isArray(expedientes) && expedientes.length > 0) {
        expedienteSelector.innerHTML = expedientes.map(exp => 
          `<option value="${escapeHTML(exp.id)}">${escapeHTML(exp.empresa)} (${escapeHTML(exp.cedula)})</option>`
        ).join('');

        // Cargar el primer expediente por defecto
        await cargarExpedienteTrazabilidad(expedientes[0].id);
      }
    } catch (err) {
      console.error('Error al consultar expedientes:', err);
      setStatus('warning', 'API local no disponible. Mostrando datos de trazabilidad respaldados localmente.');
      const fallbackList = await window.ZoFrancaAPI.getHistorialExpedientes();
      if (fallbackList && fallbackList.data && fallbackList.data.length > 0) {
        await cargarExpedienteTrazabilidad(fallbackList.data[0].id);
      }
    }
  }

  // Listener del selector de expedientes
  if (expedienteSelector) {
    expedienteSelector.addEventListener('change', async (e) => {
      await cargarExpedienteTrazabilidad(e.target.value);
    });
  }

  // Listener para reintentar conexión con la API
  if (btnRetryApi) {
    btnRetryApi.addEventListener('click', async () => {
      await cargarExpedientes();
    });
  }

  // 2. Cargar datos de trazabilidad para un expediente específico
  async function cargarExpedienteTrazabilidad(expedienteId) {
    try {
      const response = await window.ZoFrancaAPI.getHistorialExpediente(expedienteId);
      if (!response.isOnline) {
        setStatus('warning', 'API local no disponible. Conectado a base de trazabilidad en memoria/localStorage.');
      } else {
        setStatus('hidden', '');
      }

      currentExpediente = response.data;
      if (!currentExpediente) return;

      // Actualizar información lateral (Lateral Card)
      renderPanelLateral(currentExpediente);

      // Renderizar eventos cronológicos
      renderTimelineEvents();
    } catch (err) {
      console.error('Error al cargar expediente:', err);
      setStatus('error', 'Error al consultar la API de historial.');
    }
  }

  // 3. Renderizar Panel Lateral con Información del Expediente
  function renderPanelLateral(exp) {
    if (latEmpresa) latEmpresa.textContent = exp.empresa || '—';
    if (latCedula) latCedula.textContent = exp.cedula || '—';
    if (latRegimen) latRegimen.textContent = exp.regimen || '—';
    if (latParque) latParque.textContent = exp.parque || '—';
    if (latAcuerdo) latAcuerdo.textContent = exp.acuerdoEjecutivo || '—';
    if (latAnalista) latAnalista.textContent = exp.analistaAsignado || '—';
    if (latDias) latDias.textContent = exp.diasEnProceso || '—';
    if (latDocumentos) latDocumentos.textContent = exp.cantidadDocumentos || '—';
  }

  // 4. Renderizar Lista de Eventos Cronológicos
  function renderTimelineEvents() {
    if (!timelineList || !currentExpediente || !Array.isArray(currentExpediente.eventos)) return;

    const searchTerm = (eventSearchInput?.value || '').toLowerCase().trim();

    // Filtrar eventos por categoría y término de búsqueda
    const eventosFiltrados = currentExpediente.eventos.filter(evt => {
      const tipoNormalized = evt.tipo.toLowerCase();
      
      // Filtro por categoría chip
      let matchesFilter = true;
      if (currentFilter !== 'todos') {
        if (currentFilter === 'solicitud') matchesFilter = tipoNormalized.includes('solicitud');
        else if (currentFilter === 'ia') matchesFilter = tipoNormalized.includes('ia') || tipoNormalized.includes('evaluación');
        else if (currentFilter === 'decision') matchesFilter = tipoNormalized.includes('decisión') || tipoNormalized.includes('analista');
        else if (currentFilter === 'reporte') matchesFilter = tipoNormalized.includes('reporte');
        else if (currentFilter === 'alerta') matchesFilter = tipoNormalized.includes('alerta');
        else if (currentFilter === 'estado') matchesFilter = tipoNormalized.includes('estado');
      }

      // Filtro por término de búsqueda
      let matchesSearch = true;
      if (searchTerm.length > 0) {
        const textContent = `${evt.tipo} ${evt.descripcion} ${evt.estado} ${evt.responsable} ${evt.documento}`.toLowerCase();
        matchesSearch = textContent.includes(searchTerm);
      }

      return matchesFilter && matchesSearch;
    });

    // Actualizar contador
    if (totalEventsCounter) {
      totalEventsCounter.textContent = `${eventosFiltrados.length} evento(s)`;
    }

    if (eventosFiltrados.length === 0) {
      timelineList.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: var(--color-text-muted);">
          No se encontraron eventos cronológicos para los criterios seleccionados.
        </div>
      `;
      return;
    }

    // Renderizar tarjetas de eventos en orden cronológico
    timelineList.innerHTML = eventosFiltrados.map(evt => {
      const isIA = evt.tipo.toLowerCase().includes('ia');
      const isAlerta = evt.tipo.toLowerCase().includes('alerta');
      const isDecision = evt.tipo.toLowerCase().includes('decisión');

      let markerClass = '';
      let markerIcon = '';

      if (isIA) {
        markerClass = 'type-ia';
        markerIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>`;
      } else if (isAlerta) {
        markerClass = 'type-alerta';
        markerIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`;
      } else if (isDecision) {
        markerClass = 'type-decision';
        markerIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
      } else {
        markerIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
      }

      const itemCardClass = isIA ? 'timeline-item is-ia-event' : 'timeline-item';

      return `
        <div class="${itemCardClass}">
          <div class="timeline-marker ${markerClass}" title="${escapeHTML(evt.tipo)}">
            ${markerIcon}
          </div>

          <div class="timeline-item-header">
            <div class="timeline-type-title">
              <span>${escapeHTML(evt.tipo)}</span>
              <span class="badge ${evt.badgeClass || 'badge-info'}">${escapeHTML(evt.estado)}</span>
            </div>
            <div class="timeline-date">${escapeHTML(evt.fecha)}</div>
          </div>

          <p class="timeline-description">${escapeHTML(evt.descripcion)}</p>

          <div class="timeline-meta-row">
            ${evt.documento ? `
              <div class="timeline-meta-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                <span>Documento: <strong>${escapeHTML(evt.documento)}</strong></span>
              </div>
            ` : ''}

            ${evt.responsable ? `
              <div class="timeline-meta-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <span>Responsable: <strong>${escapeHTML(evt.responsable)}</strong></span>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  // 5. Filtros e interacción por Chips de Eventos
  if (filterChipsGroup) {
    filterChipsGroup.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        filterChipsGroup.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter || 'todos';
        renderTimelineEvents();
      });
    });
  }

  // Listener del buscador
  if (eventSearchInput) {
    eventSearchInput.addEventListener('input', () => {
      renderTimelineEvents();
    });
  }

  // Manejo de Estados Visuales de Banner
  function setStatus(state, text) {
    if (!statusBanner) return;
    if (state === 'hidden') {
      statusBanner.style.display = 'none';
      return;
    }

    statusBanner.style.display = 'flex';
    statusBanner.className = `status-banner ${state}`;
    if (statusMessage) statusMessage.textContent = text;
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, tag => 
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
}

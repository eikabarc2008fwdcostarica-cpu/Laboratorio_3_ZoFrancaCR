(function () {
  const form = document.querySelector('#decisionForm');
  if (!form) return;

  const elements = {
    state: document.querySelector('#decisionState'),
    stateTitle: document.querySelector('#decisionStateTitle'),
    stateMessage: document.querySelector('#decisionStateMessage'),
    content: document.querySelector('#decisionContent'),
    requestId: document.querySelector('#requestId'),
    company: document.querySelector('#requestCompany'),
    score: document.querySelector('#requestScore'),
    recommendation: document.querySelector('#requestRecommendation'),
    justification: document.querySelector('#requestJustification'),
    requestStatus: document.querySelector('#requestStatus'),
    existingDecision: document.querySelector('#existingDecision'),
    observations: document.querySelector('#analystObservations'),
    observationsRequirement: document.querySelector('#observationsRequirement'),
    resolutionError: document.querySelector('#resolutionError'),
    observationsError: document.querySelector('#observationsError'),
    submitButton: document.querySelector('#registerDecision')
  };

  let request = null;
  let isSubmitting = false;

  function getBadgeClass(status) {
    return ({
      Recomendada: 'badge-success',
      Revisar: 'badge-warning',
      Rechazada: 'badge-danger',
      pendiente: 'badge-info'
    })[status] || 'badge-info';
  }

  function getStatusLabel(status) {
    return status === 'Revisar' ? 'En revisión' : status || 'Pendiente';
  }

  function updateBadge(element, status) {
    element.className = `badge ${getBadgeClass(status)}`;
    element.textContent = getStatusLabel(status);
  }

  function setPageState(type, title, message) {
    const icons = {
      loading: 'loader-circle',
      error: 'circle-alert',
      success: 'circle-check',
      warning: 'info'
    };
    const icon = elements.state.querySelector('svg, [data-lucide]');

    elements.state.hidden = false;
    elements.state.className = `alert decision-state${type === 'error' ? ' alert-danger' : type === 'success' ? ' alert-success' : type === 'warning' ? ' alert-warning' : ''}`;
    elements.stateTitle.textContent = title;
    elements.stateMessage.textContent = message;
    icon.setAttribute('data-lucide', icons[type]);
    icon.classList.toggle('spinner-icon', type === 'loading');
    window.lucide?.createIcons();
  }

  function getSelectedResolution() {
    return form.elements.resolution.value;
  }

  function observationsAreRequired(resolution) {
    return resolution === 'review' || resolution === 'reject';
  }

  function updateObservationRequirement() {
    const required = observationsAreRequired(getSelectedResolution());
    elements.observations.required = required;
    elements.observationsRequirement.textContent = required ? '(obligatorias)' : '(opcionales al confirmar)';
    if (!required) {
      elements.observations.removeAttribute('aria-invalid');
      elements.observationsError.textContent = '';
    }
  }

  function validateForm() {
    const resolution = getSelectedResolution();
    const observations = elements.observations.value.trim();
    let valid = true;

    elements.resolutionError.textContent = '';
    elements.observationsError.textContent = '';
    elements.observations.removeAttribute('aria-invalid');

    if (!resolution) {
      elements.resolutionError.textContent = 'Seleccione una opción de resolución.';
      valid = false;
    }

    if (observationsAreRequired(resolution) && !observations) {
      elements.observationsError.textContent = 'Las observaciones son obligatorias para esta resolución.';
      elements.observations.setAttribute('aria-invalid', 'true');
      valid = false;
    }

    return valid;
  }

  function resolveDecision(resolution) {
    if (resolution === 'confirm') {
      if (!request.clasificacionIA) throw new Error('La solicitud no tiene una recomendación de IA para confirmar.');
      return {
        status: request.clasificacionIA,
        analystDecision: `Confirmada: ${request.clasificacionIA}`
      };
    }

    if (resolution === 'review') return { status: 'Revisar', analystDecision: 'Revisar' };
    return { status: 'Rechazada', analystDecision: 'Rechazada' };
  }

  function renderRequest() {
    elements.requestId.textContent = request.id;
    elements.company.textContent = request.empresa || 'Empresa sin nombre';
    elements.score.textContent = request.puntajeIA ?? 'Pendiente';
    elements.justification.textContent = request.justificacionIA || 'Sin justificación disponible.';
    updateBadge(elements.recommendation, request.clasificacionIA);
    updateBadge(elements.requestStatus, request.estado);
    elements.existingDecision.textContent = request.decisionAnalista || 'Sin registrar';
    elements.existingDecision.className = `badge ${request.decisionAnalista ? 'badge-success' : 'badge-warning'}`;
    elements.observations.value = request.observacionesAnalista || '';

    const confirmOption = form.querySelector('[value="confirm"]');
    confirmOption.disabled = !request.clasificacionIA;
    confirmOption.closest('.decision-option').classList.toggle('is-disabled', !request.clasificacionIA);
    elements.content.hidden = false;
  }

  async function loadRequest() {
    const requestId = new URLSearchParams(window.location.search).get('id')?.trim();
    if (!requestId) {
      setPageState('error', 'Expediente no indicado', 'Abra esta página desde el Dashboard seleccionando una solicitud.');
      return;
    }

    try {
      request = await window.ZoFrancaAPI.get(`/solicitudes/${encodeURIComponent(requestId)}`);
      renderRequest();
      setPageState('warning', 'Expediente disponible', 'Revise la recomendación de IA antes de registrar la decisión humana.');
    } catch (error) {
      console.error('No fue posible cargar el expediente:', error);
      setPageState('error', 'No fue posible cargar el expediente', 'Compruebe el ID y que la API esté activa en el puerto 3005.');
    }
  }

  async function registerDecision(event) {
    event.preventDefault();
    if (isSubmitting || !request || !validateForm()) return;

    let decision;
    try {
      decision = resolveDecision(getSelectedResolution());
    } catch (error) {
      elements.resolutionError.textContent = error.message;
      return;
    }

    const observations = elements.observations.value.trim();
    const decisionDate = new Date().toISOString();
    const previousDecision = {
      estado: request.estado,
      decisionAnalista: request.decisionAnalista,
      observacionesAnalista: request.observacionesAnalista,
      fechaDecision: request.fechaDecision
    };
    const decisionUpdate = {
      estado: decision.status,
      decisionAnalista: decision.analystDecision,
      observacionesAnalista: observations || null,
      fechaDecision: decisionDate
    };
    const historyEvent = {
      solicitudId: request.id,
      id_solicitud: request.id,
      empresaId: null,
      tipoEvento: 'decision-analista',
      resultado: decision.status,
      descripcion: `El analista registró la resolución ${decision.analystDecision} para ${request.empresa}.`,
      fecha: decisionDate,
      fecha_hora: decisionDate,
      responsable: 'Analista'
    };

    isSubmitting = true;
    elements.submitButton.disabled = true;
    setPageState('loading', 'Registrando decisión', 'Guardando la resolución y su evento de historial.');

    try {
      const updatedRequest = await window.ZoFrancaAPI.patch(`/solicitudes/${encodeURIComponent(request.id)}`, decisionUpdate);
      try {
        await window.ZoFrancaAPI.post('/historial', historyEvent);
      } catch (historyError) {
        await window.ZoFrancaAPI.patch(`/solicitudes/${encodeURIComponent(request.id)}`, previousDecision);
        throw historyError;
      }

      request = updatedRequest;
      renderRequest();
      setPageState('success', 'Decisión registrada', 'La resolución humana y el evento de historial se guardaron correctamente.');
    } catch (error) {
      console.error('No fue posible registrar la decisión:', error);
      setPageState('error', 'No fue posible registrar la decisión', 'No se completó la operación. Compruebe la API e intente nuevamente.');
    } finally {
      isSubmitting = false;
      elements.submitButton.disabled = false;
    }
  }

  form.addEventListener('change', event => {
    if (event.target.name === 'resolution') {
      elements.resolutionError.textContent = '';
      updateObservationRequirement();
    }
  });
  elements.observations.addEventListener('input', () => {
    if (elements.observations.value.trim()) {
      elements.observations.removeAttribute('aria-invalid');
      elements.observationsError.textContent = '';
    }
  });
  form.addEventListener('submit', registerDecision);

  loadRequest();
})();

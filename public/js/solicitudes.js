(function () {
  const form = document.querySelector('#solicitudForm');
  if (!form) return;

  const submitButton = document.querySelector('#btnSubmit');
  const statusBanner = document.querySelector('#statusBanner');
  const statusTitle = document.querySelector('#statusTitle');
  const statusMessage = document.querySelector('#statusMessage');

  const rules = {
    empresa: value => value.trim() ? '' : 'Ingrese el nombre de la empresa.',
    cedulaJuridica: value => value.trim() ? '' : 'Ingrese la cédula jurídica.',
    sector: value => value ? '' : 'Seleccione un sector.',
    correo: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? '' : 'Ingrese un correo válido.',
    telefono: value => value.trim() ? '' : 'Ingrese un teléfono.',
    representante: value => value.trim() ? '' : 'Ingrese el representante legal.',
    inversionProyectada: value => Number(value) > 0 ? '' : 'La inversión debe ser mayor que cero.',
    empleosProyectados: value => Number.isInteger(Number(value)) && Number(value) > 0 ? '' : 'Ingrese una cantidad entera mayor que cero.',
    descripcion: value => value.trim() ? '' : 'Ingrese una descripción.'
  };

  function validate() {
    let valid = true;
    Object.entries(rules).forEach(([name, rule]) => {
      const field = form.elements[name];
      const message = rule(field.value);
      const error = form.querySelector(`[data-error-for="${name}"]`);
      field.setAttribute('aria-invalid', String(Boolean(message)));
      error.textContent = message;
      if (message) valid = false;
    });
    return valid;
  }

  function showStatus(type, title, message) {
    const iconNames = { loading: 'loader-circle', success: 'circle-check', error: 'circle-alert' };
    statusBanner.hidden = false;
    statusBanner.className = `alert status-banner alert-${type}`;
    statusTitle.textContent = title;
    statusMessage.textContent = message;
    const icon = statusBanner.querySelector('[data-status-icon]');
    icon.setAttribute('data-lucide', iconNames[type]);
    icon.classList.toggle('spinner-icon', type === 'loading');
    window.lucide?.createIcons();
  }

  form.addEventListener('input', event => {
    const rule = rules[event.target.name];
    if (!rule) return;
    const error = form.querySelector(`[data-error-for="${event.target.name}"]`);
    const message = rule(event.target.value);
    event.target.setAttribute('aria-invalid', String(Boolean(message)));
    error.textContent = message;
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!validate()) {
      showStatus('error', 'Formulario incompleto', 'Revise los campos indicados antes de continuar.');
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    const data = new FormData(form);
    const solicitud = {
      empresa: data.get('empresa').trim(),
      cedulaJuridica: data.get('cedulaJuridica').trim(),
      sector: data.get('sector'),
      correo: data.get('correo').trim(),
      telefono: data.get('telefono').trim(),
      representante: data.get('representante').trim(),
      inversionProyectada: Number(data.get('inversionProyectada')),
      empleosProyectados: Number(data.get('empleosProyectados')),
      descripcion: data.get('descripcion').trim(),
      estado: 'pendiente',
      fecha: new Date().toISOString(),
      puntajeIA: null,
      clasificacionIA: null,
      justificacionIA: null,
      decisionAnalista: null,
      observacionesAnalista: null,
      fechaDecision: null
    };

    submitButton.disabled = true;
    showStatus('loading', 'Guardando solicitud', 'Espere mientras se registra la información.');

    try {
      await window.ZoFrancaAPI.post('/solicitudes', solicitud);
      form.reset();
      form.querySelectorAll('[aria-invalid]').forEach(field => field.removeAttribute('aria-invalid'));
      form.querySelectorAll('.field-error').forEach(error => { error.textContent = ''; });
      showStatus('success', 'Solicitud guardada', 'La solicitud se registró correctamente.');
    } catch (error) {
      showStatus('error', 'No fue posible guardar', 'Compruebe que la API esté activa e intente nuevamente.');
    } finally {
      submitButton.disabled = false;
    }
  });
})();

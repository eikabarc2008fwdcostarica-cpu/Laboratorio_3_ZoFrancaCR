/**
 * Lógica de negocio y presentación para la pantalla Cumplimiento - ZoFranca CR
 * Reporte Anual de Operaciones: Carga de API, cálculos en tiempo real, validación y envío.
 */

document.addEventListener('DOMContentLoaded', initCumplimiento);
document.addEventListener('zofranca:ui-ready', initCumplimiento);

let initialized = false;

function initCumplimiento() {
  if (initialized) return;
  const form = document.getElementById('reporteForm');
  if (!form) return;
  initialized = true;

  // Elementos DOM
  const empresaSelector = document.getElementById('empresaSelector');
  const btnSubmit = document.getElementById('btnSubmit');
  const statusBanner = document.getElementById('statusBanner');
  const statusIcon = document.getElementById('statusIcon');
  const statusMessage = document.getElementById('statusMessage');

  // Form Inputs
  const inputEmpresa = document.getElementById('empresa');
  const inputCedula = document.getElementById('cedula');
  const inputClasificacion = document.getElementById('clasificacion');
  const inputCategoria = document.getElementById('categoria');
  const inputGama = document.getElementById('gama');
  const inputPeriodo = document.getElementById('periodo');
  const inputNivelEmpleo = document.getElementById('nivelEmpleo');
  const inputEmpleoComprometido = document.getElementById('empleoComprometido');
  const inputInversionEjecutada = document.getElementById('inversionEjecutada');
  const inputInversionComprometida = document.getElementById('inversionComprometida');
  const inputExportaciones = document.getElementById('exportaciones');
  const inputMetasCorrespondientes = document.getElementById('metasCorrespondientes');

  // Display Outputs
  const calcPorcentajeEmpleo = document.getElementById('calcPorcentajeEmpleo');
  const calcBrechaEmpleo = document.getElementById('calcBrechaEmpleo');
  const barEmpleo = document.getElementById('barEmpleo');

  const calcPorcentajeInversion = document.getElementById('calcPorcentajeInversion');
  const calcSuperavitDeficit = document.getElementById('calcSuperavitDeficit');
  const barInversion = document.getElementById('barInversion');

  const calcPorcentajeExportaciones = document.getElementById('calcPorcentajeExportaciones');
  const calcMetaExportaciones = document.getElementById('calcMetaExportaciones');
  const barExportaciones = document.getElementById('barExportaciones');

  const calcEstadoBadge = document.getElementById('calcEstadoBadge');
  const calcEstadoDescripcion = document.getElementById('calcEstadoDescripcion');

  // List de inputs numéricos para recálculo instantáneo
  const calculationInputs = [
    inputNivelEmpleo,
    inputEmpleoComprometido,
    inputInversionEjecutada,
    inputInversionComprometida,
    inputExportaciones,
    inputMetasCorrespondientes
  ];

  // 1. Cargar lista de empresas desde la API local
  cargarEmpresas();

  async function cargarEmpresas() {
    setStatus('loading', 'Cargando datos de cumplimiento desde la API...');
    try {
      const empresas = await window.ZoFrancaAPI.getEmpresas();
      if (empresaSelector && Array.isArray(empresas) && empresas.length > 0) {
        empresaSelector.innerHTML = empresas.map(e => 
          `<option value="${escapeHTML(e.id)}">${escapeHTML(e.empresa)} (${escapeHTML(e.cedula)})</option>`
        ).join('');

        // Cargar primera empresa
        await cargarReporteEmpresa(empresas[0].id);
      }
      setStatus('hidden', '');
    } catch (error) {
      console.error('Error al cargar empresas:', error);
      setStatus('error', 'Error al consultar la API local de empresas.');
    }
  }

  // Evento de cambio de empresa en selector
  if (empresaSelector) {
    empresaSelector.addEventListener('change', async (e) => {
      setStatus('loading', 'Actualizando datos de la empresa...');
      await cargarReporteEmpresa(e.target.value);
      setStatus('hidden', '');
    });
  }

  // 2. Cargar reporte de una empresa dada desde la API
  async function cargarReporteEmpresa(empresaId) {
    try {
      const data = await window.ZoFrancaAPI.getReporteCumplimiento(empresaId);
      if (!data) return;

      if (inputEmpresa) inputEmpresa.value = data.empresa || '';
      if (inputCedula) inputCedula.value = data.cedula || '';
      if (inputClasificacion) inputClasificacion.value = data.clasificacion || '';
      if (inputCategoria) inputCategoria.value = data.categoria || '';
      if (inputGama) inputGama.value = data.gama || '';
      if (inputPeriodo) inputPeriodo.value = data.periodo || '';

      if (inputNivelEmpleo) inputNivelEmpleo.value = data.nivelEmpleo ?? 0;
      if (inputEmpleoComprometido) inputEmpleoComprometido.value = data.empleoComprometido ?? 0;
      if (inputInversionEjecutada) inputInversionEjecutada.value = data.inversionEjecutada ?? 0;
      if (inputInversionComprometida) inputInversionComprometida.value = data.inversionComprometida ?? 0;
      if (inputExportaciones) inputExportaciones.value = data.exportaciones ?? 0;
      if (inputMetasCorrespondientes) inputMetasCorrespondientes.value = data.metasCorrespondientes ?? 0;

      // Limpiar errores visuales
      form.querySelectorAll('.form-group').forEach(grp => grp.classList.remove('has-error'));

      // Ejecutar cálculos dinámicos
      recalcularMetrics();
    } catch (err) {
      console.error('Error al cargar reporte de empresa:', err);
    }
  }

  // 3. Listener para recalcular dinámicamente al escribir en los inputs
  form.querySelectorAll('input, select').forEach(element => {
    element.addEventListener('input', () => {
      const group = element.closest('.form-group');
      if (group) group.classList.remove('has-error');
      recalcularMetrics();
    });
  });

  // 4. Función central de cálculos dinámicos
  function recalcularMetrics() {
    const nivelEmpleo = parseFloat(inputNivelEmpleo?.value) || 0;
    const empleoComprometido = parseFloat(inputEmpleoComprometido?.value) || 0;

    const inversionEjecutada = parseFloat(inputInversionEjecutada?.value) || 0;
    const inversionComprometida = parseFloat(inputInversionComprometida?.value) || 0;

    const exportaciones = parseFloat(inputExportaciones?.value) || 0;
    const metasCorrespondientes = parseFloat(inputMetasCorrespondientes?.value) || 0;

    // --- A. Empleo ---
    const pctEmpleo = empleoComprometido > 0 ? (nivelEmpleo / empleoComprometido) * 100 : 0;
    const brechaEmpleo = nivelEmpleo - empleoComprometido;

    if (calcPorcentajeEmpleo) calcPorcentajeEmpleo.textContent = `${pctEmpleo.toFixed(1)}%`;
    if (calcBrechaEmpleo) {
      if (brechaEmpleo > 0) {
        calcBrechaEmpleo.textContent = `+${brechaEmpleo} empleos (Superávit)`;
      } else if (brechaEmpleo === 0) {
        calcBrechaEmpleo.textContent = `0 empleos (Meta alcanzada)`;
      } else {
        calcBrechaEmpleo.textContent = `${brechaEmpleo} empleos (Déficit)`;
      }
    }
    actualizarBarra(barEmpleo, pctEmpleo);

    // --- B. Inversión ---
    const pctInversion = inversionComprometida > 0 ? (inversionEjecutada / inversionComprometida) * 100 : 0;
    const diffInversion = inversionEjecutada - inversionComprometida;

    if (calcPorcentajeInversion) calcPorcentajeInversion.textContent = `${pctInversion.toFixed(1)}%`;
    if (calcSuperavitDeficit) {
      const diffFormateado = formatCurrency(Math.abs(diffInversion));
      if (diffInversion > 0) {
        calcSuperavitDeficit.textContent = `+${diffFormateado} (Superávit)`;
      } else if (diffInversion === 0) {
        calcSuperavitDeficit.textContent = `$0 (En meta)`;
      } else {
        calcSuperavitDeficit.textContent = `-${diffFormateado} (Déficit)`;
      }
    }
    actualizarBarra(barInversion, pctInversion);

    // --- C. Exportaciones ---
    const pctExportaciones = metasCorrespondientes > 0 ? (exportaciones / metasCorrespondientes) * 100 : 0;

    if (calcPorcentajeExportaciones) calcPorcentajeExportaciones.textContent = `${pctExportaciones.toFixed(1)}%`;
    if (calcMetaExportaciones) calcMetaExportaciones.textContent = formatCurrency(metasCorrespondientes);
    actualizarBarra(barExportaciones, pctExportaciones);

    // --- D. Estado de Cumplimiento ---
    actualizarEstadoGlobal(pctEmpleo, pctInversion, pctExportaciones);
  }

  // Actualizar ancho y color semántico de las barras de progreso
  function actualizarBarra(element, pct) {
    if (!element) return;
    const widthPct = Math.min(Math.max(pct, 0), 100);
    element.style.width = `${widthPct}%`;

    element.classList.remove('bar-success', 'bar-warning', 'bar-danger');
    if (pct >= 100) {
      element.classList.add('bar-success');
    } else if (pct >= 80) {
      element.classList.add('bar-warning');
    } else {
      element.classList.add('bar-danger');
    }
  }

  // Determinar y renderizar estado global de cumplimiento
  function actualizarEstadoGlobal(pctEmpleo, pctInversion, pctExportaciones) {
    if (!calcEstadoBadge || !calcEstadoDescripcion) return;

    let badgeClass = '';
    let iconSvg = '';
    let labelText = '';
    let descText = '';

    if (pctEmpleo >= 100 && pctInversion >= 100 && pctExportaciones >= 100) {
      badgeClass = 'badge-success';
      labelText = 'Cumplimiento Total';
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>`;
      descText = 'La empresa ha alcanzado o superado el 100% de todos sus compromisos de empleo, inversión ejecutada y metas de exportación contratadas.';
    } else if (pctEmpleo >= 80 && pctInversion >= 80 && pctExportaciones >= 80) {
      badgeClass = 'badge-warning';
      labelText = 'Cumplimiento Parcial';
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`;
      descText = 'La empresa se encuentra en un rango aceptable (>= 80%), pero aún no alcanza el 100% en uno o más de sus rubros.';
    } else {
      badgeClass = 'badge-danger';
      labelText = 'En Riesgo / Incumplimiento';
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
      descText = 'Se detectan desvíos críticos por debajo del 80% en los compromisos exigidos por la zona franca. Se requiere plan de acción.';
    }

    calcEstadoBadge.className = `badge-estado-large ${badgeClass}`;
    calcEstadoBadge.innerHTML = `${iconSvg}<span>${labelText}</span>`;
    calcEstadoDescripcion.textContent = descText;
  }

  // 5. Validación del formulario antes de enviar
  function validarFormulario() {
    let isValid = true;
    const requeridos = [
      { id: 'empresa', test: val => val.trim().length > 0 },
      { id: 'cedula', test: val => val.trim().length > 0 },
      { id: 'clasificacion', test: val => val.trim().length > 0 },
      { id: 'categoria', test: val => val.trim().length > 0 },
      { id: 'gama', test: val => val.trim().length > 0 },
      { id: 'periodo', test: val => val.trim().length > 0 },
      { id: 'nivelEmpleo', test: val => !isNaN(val) && val !== '' && parseFloat(val) >= 0 },
      { id: 'empleoComprometido', test: val => !isNaN(val) && val !== '' && parseFloat(val) > 0 },
      { id: 'inversionEjecutada', test: val => !isNaN(val) && val !== '' && parseFloat(val) >= 0 },
      { id: 'inversionComprometida', test: val => !isNaN(val) && val !== '' && parseFloat(val) > 0 },
      { id: 'exportaciones', test: val => !isNaN(val) && val !== '' && parseFloat(val) >= 0 },
      { id: 'metasCorrespondientes', test: val => !isNaN(val) && val !== '' && parseFloat(val) > 0 }
    ];

    requeridos.forEach(({ id, test }) => {
      const field = document.getElementById(id);
      if (!field) return;
      const group = field.closest('.form-group');
      const val = field.value;

      if (!test(val)) {
        if (group) group.classList.add('has-error');
        isValid = false;
      } else {
        if (group) group.classList.remove('has-error');
      }
    });

    return isValid;
  }

  // 6. Manejo de envío de formulario ("Enviar reporte")
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      setStatus('error', 'Por favor complete todos los datos requeridos con valores válidos antes de enviar.');
      return;
    }

    if (btnSubmit) btnSubmit.disabled = true;
    setStatus('loading', 'Validando y enviando reporte de cumplimiento a la API...');

    const payload = {
      empresa: inputEmpresa.value.trim(),
      cedula: inputCedula.value.trim(),
      clasificacion: inputClasificacion.value,
      categoria: inputCategoria.value,
      gama: inputGama.value,
      periodo: inputPeriodo.value.trim(),
      nivelEmpleo: parseFloat(inputNivelEmpleo.value),
      empleoComprometido: parseFloat(inputEmpleoComprometido.value),
      inversionEjecutada: parseFloat(inputInversionEjecutada.value),
      inversionComprometida: parseFloat(inputInversionComprometida.value),
      exportaciones: parseFloat(inputExportaciones.value),
      metasCorrespondientes: parseFloat(inputMetasCorrespondientes.value),
      fechaEnvio: new Date().toISOString()
    };

    try {
      const resultado = await window.ZoFrancaAPI.enviarReporteCumplimiento(payload);
      console.log('Reporte guardado exitosamente:', resultado);
      setStatus('success', 'Reporte de cumplimiento enviado y registrado exitosamente en la plataforma.');
    } catch (err) {
      console.error('Error al enviar reporte:', err);
      setStatus('error', 'Ocurrió un error al enviar el reporte. Por favor intente nuevamente.');
    } finally {
      if (btnSubmit) btnSubmit.disabled = false;
    }
  });

  // Auxiliares de formato e interfaz
  function setStatus(state, text) {
    if (!statusBanner) return;
    if (state === 'hidden') {
      statusBanner.className = 'status-banner';
      statusBanner.style.display = 'none';
      return;
    }
    statusBanner.style.display = 'flex';
    statusBanner.className = `status-banner ${state}`;
    if (statusMessage) statusMessage.textContent = text;

    if (statusIcon) {
      if (state === 'loading') {
        statusIcon.innerHTML = `<div class="spinner" aria-label="Cargando"></div>`;
      } else if (state === 'success') {
        statusIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>`;
      } else if (state === 'error') {
        statusIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`;
      }
    }
  }

  function formatCurrency(val) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, tag => 
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
}

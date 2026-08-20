/**
 * Lógica JavaScript Asíncrona para la pantalla Nueva Solicitud - ZoFranca CR
 * Cumple con validaciones de campos, simulación visual de documentos (sin almacenar binarios)
 * y envío POST a http://localhost:3005/solicitudes usando fetch, async/await y try/catch.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  const API_URL = 'http://localhost:3005/solicitudes';

  // Elementos del DOM
  const form = document.getElementById('solicitudForm');
  const btnSubmit = document.getElementById('btnSubmit');
  const statusBanner = document.getElementById('statusBanner');
  const statusIcon = document.getElementById('statusIcon');
  const statusMessage = document.getElementById('statusMessage');
  
  const dropzone = document.getElementById('dropzone');
  const documentosInput = document.getElementById('documentosInput');
  const fileList = document.getElementById('fileList');

  // Estado local de archivos simulados (únicamente nombres de archivo)
  let simulatedFiles = [];

  // =========================================================================
  // 1. Manejo de Selección de Archivos (Simulación Visual)
  // =========================================================================
  if (dropzone && documentosInput) {
    dropzone.addEventListener('click', () => documentosInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        addSimulatedFiles(e.dataTransfer.files);
      }
    });

    documentosInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        addSimulatedFiles(e.target.files);
        documentosInput.value = ''; // Reset input
      }
    });
  }

  function addSimulatedFiles(files) {
    Array.from(files).forEach(file => {
      if (!simulatedFiles.includes(file.name)) {
        simulatedFiles.push(file.name);
      }
    });
    renderFileList();
  }

  function removeFile(filename) {
    simulatedFiles = simulatedFiles.filter(name => name !== filename);
    renderFileList();
  }

  function renderFileList() {
    if (!fileList) return;
    fileList.innerHTML = '';
    simulatedFiles.forEach(filename => {
      const chip = document.createElement('div');
      chip.className = 'file-chip';
      chip.innerHTML = `
        <svg class="icon-file" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <span>${escapeHTML(filename)}</span>
        <button type="button" class="remove-file" aria-label="Eliminar archivo ${escapeHTML(filename)}">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      `;
      chip.querySelector('.remove-file').addEventListener('click', () => removeFile(filename));
      fileList.appendChild(chip);
    });
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // =========================================================================
  // 2. Control de Estados Visuales de Retroalimentación (RES-15)
  // =========================================================================
  function setStatus(state, text) {
    if (!statusBanner) return;
    statusBanner.className = 'status-banner ' + state;
    statusMessage.textContent = text;

    if (state === 'loading') {
      statusIcon.innerHTML = `<div class="spinner" aria-label="Cargando"></div>`;
    } else if (state === 'success') {
      statusIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-label="Éxito">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      `;
    } else if (state === 'error') {
      statusIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-label="Error">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      `;
    }
  }

  // =========================================================================
  // 3. Validación de Campos Obligatorios
  // =========================================================================
  function validateForm() {
    let isValid = true;

    const fields = [
      { id: 'nombreEmpresa', validate: val => val.trim().length > 0 },
      { id: 'sector', validate: val => val.trim().length > 0 },
      { 
        id: 'correo', 
        validate: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) 
      },
      { id: 'telefono', validate: val => val.trim().length > 0 },
      { id: 'representanteLegal', validate: val => val.trim().length > 0 },
      { id: 'inversionProyectada', validate: val => !isNaN(val) && Number(val) > 0 },
      { id: 'empleosProyectados', validate: val => !isNaN(val) && Number(val) > 0 && Number.isInteger(Number(val)) },
      { id: 'descripcion', validate: val => val.trim().length > 0 }
    ];

    fields.forEach(({ id, validate }) => {
      const input = document.getElementById(id);
      if (!input) return;
      const group = input.closest('.form-group');
      const value = input.value;

      if (!validate(value)) {
        if (group) group.classList.add('has-error');
        isValid = false;
      } else {
        if (group) group.classList.remove('has-error');
      }
    });

    return isValid;
  }

  // Limpiar errores al escribir
  if (form) {
    form.querySelectorAll('input, select, textarea').forEach(element => {
      element.addEventListener('input', () => {
        const group = element.closest('.form-group');
        if (group) group.classList.remove('has-error');
      });
    });

    // =========================================================================
    // 4. Envío Asíncrono de Solicitud (fetch, async/await, try/catch)
    // =========================================================================
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // 1. Validar campos obligatorios
      if (!validateForm()) {
        setStatus('error', 'Por favor complete todos los campos obligatorios antes de enviar.');
        return;
      }

      // 2. Deshabilitar botón y mostrar estado "Enviando solicitud..."
      if (btnSubmit) btnSubmit.disabled = true;
      setStatus('loading', 'Enviando solicitud...');

      // 3. Construir payload con estado "pendiente"
      const payload = {
        nombreEmpresa: document.getElementById('nombreEmpresa').value.trim(),
        sector: document.getElementById('sector').value,
        correo: document.getElementById('correo').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        representanteLegal: document.getElementById('representanteLegal').value.trim(),
        inversionProyectada: parseFloat(document.getElementById('inversionProyectada').value),
        empleosProyectados: parseInt(document.getElementById('empleosProyectados').value, 10),
        descripcion: document.getElementById('descripcion').value.trim(),
        documentos: [...simulatedFiles],
        estado: "pendiente",
        fechaCreacion: new Date().toISOString()
      };

      // 4. Petición POST asíncrona a http://localhost:3005/solicitudes
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`HTTP Error Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Solicitud guardada con éxito:', data);

        // Estado "Solicitud guardada correctamente."
        setStatus('success', 'Solicitud guardada correctamente.');
        
        // Limpiar formulario y lista de archivos
        form.reset();
        simulatedFiles = [];
        renderFileList();

      } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        // Estado "Error al guardar solicitud."
        setStatus('error', 'Error al guardar solicitud.');

      } finally {
        if (btnSubmit) btnSubmit.disabled = false;
      }

    });
  }

});

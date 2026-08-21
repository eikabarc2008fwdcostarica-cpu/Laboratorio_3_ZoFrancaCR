(function () {
  const API_BASE_URL = 'http://localhost:3005';

  async function request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options
      });

      if (!response.ok) {
        throw new Error(`La API respondió con el estado ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error al consultar ${endpoint}:`, error);
      throw error;
    }
  }

  function latestReport(reports) {
    return [...reports].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0] || null;
  }

  function toComplianceRecord(company, report) {
    return {
      empresaId: company.id,
      empresa: company.nombre,
      cedula: company.cedulaJuridica,
      clasificacion: company.sector,
      categoria: company.estado || 'No especificada',
      gama: 'No especificada',
      periodo: report?.periodo || '',
      nivelEmpleo: report?.empleosReales ?? 0,
      empleoComprometido: company.empleosComprometidos ?? 0,
      inversionEjecutada: report?.inversionEjecutada ?? 0,
      inversionComprometida: company.inversionComprometida ?? 0,
      exportaciones: report?.exportaciones ?? 0,
      metasCorrespondientes: company.exportacionesComprometidas ?? 0
    };
  }

  function toTimelineEvent(event) {
    const eventType = String(event.tipoEvento || 'evento').replaceAll('-', ' ');
    const isAlert = eventType.toLowerCase().includes('alerta');
    const isApproval = eventType.toLowerCase().includes('aprob');

    return {
      id: event.id,
      tipo: eventType,
      fecha: event.fecha,
      descripcion: event.descripcion,
      estado: isAlert ? 'Alerta' : isApproval ? 'Aprobado' : 'Registrado',
      documento: '',
      responsable: event.responsable,
      badgeClass: isAlert ? 'badge-warning' : isApproval ? 'badge-success' : 'badge-info'
    };
  }

  function toHistoryFile(company, events) {
    return {
      id: company.id,
      empresa: company.nombre,
      cedula: company.cedulaJuridica,
      regimen: 'Régimen de Zona Franca',
      parque: company.zonaFrancaId || 'No especificado',
      acuerdoEjecutivo: 'No especificado',
      analistaAsignado: events.at(-1)?.responsable || 'Analista de ZoFranca CR',
      diasEnProceso: 'No calculado',
      cantidadDocumentos: '0 documentos',
      eventos: events.map(toTimelineEvent)
    };
  }

  async function getEmpresas() {
    const companies = await request('/empresas');
    return companies.map(company => ({
      ...company,
      empresa: company.nombre,
      cedula: company.cedulaJuridica
    }));
  }

  async function getReporteCumplimiento(companyId) {
    const [company, reports] = await Promise.all([
      request(`/empresas/${encodeURIComponent(companyId)}`),
      request(`/reportes?empresaId=${encodeURIComponent(companyId)}`)
    ]);

    return toComplianceRecord(company, latestReport(reports));
  }

  async function enviarReporteCumplimiento(data) {
    const companies = await request(`/empresas?cedulaJuridica=${encodeURIComponent(data.cedula)}`);
    const company = companies[0];
    if (!company) throw new Error('No se encontró la empresa asociada al reporte.');

    return request('/reportes', {
      method: 'POST',
      body: JSON.stringify({
        empresaId: company.id,
        periodo: data.periodo,
        empleosReales: data.nivelEmpleo,
        inversionEjecutada: data.inversionEjecutada,
        exportaciones: data.exportaciones,
        fecha: data.fechaEnvio,
        estado: 'pendiente'
      })
    });
  }

  async function getHistorialExpedientes() {
    const [companies, history] = await Promise.all([
      request('/empresas'),
      request('/historial')
    ]);

    return {
      isOnline: true,
      data: companies.map(company => toHistoryFile(
        company,
        history.filter(event => event.empresaId === company.id)
      ))
    };
  }

  async function getHistorialExpediente(companyId) {
    const [company, history] = await Promise.all([
      request(`/empresas/${encodeURIComponent(companyId)}`),
      request(`/historial?empresaId=${encodeURIComponent(companyId)}`)
    ]);

    return { isOnline: true, data: toHistoryFile(company, history) };
  }

  window.ZoFrancaAPI = Object.freeze({
    baseUrl: API_BASE_URL,
    get: endpoint => request(endpoint),
    post: (endpoint, data) => request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
    patch: (endpoint, data) => request(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
    getEmpresas,
    getReporteCumplimiento,
    enviarReporteCumplimiento,
    getHistorialExpedientes,
    getHistorialExpediente
  });
})();

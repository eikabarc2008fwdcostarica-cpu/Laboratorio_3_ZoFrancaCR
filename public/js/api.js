/**
 * Comunicación con la API local / simulada - ZoFranca CR
 * Proporciona métodos asíncronos para cargar y actualizar reportes de cumplimiento, empresas e historial de expediente.
 */
(function (global) {
  const LOCAL_API_BASE = '/api';

  // Datos base iniciales de empresas y cumplimiento
  const INITIAL_EMPRESAS = [
    {
      id: 'emp-001',
      empresa: 'TechCorp Costa Rica S.A.',
      cedula: '3-101-789456',
      clasificacion: 'Tecnología y Servicios',
      categoria: 'Categoría a) Servicios de Exportación',
      gama: 'Gama Alta',
      periodo: '2025 - 2026',
      nivelEmpleo: 45,
      empleoComprometido: 50,
      inversionEjecutada: 520000,
      inversionComprometida: 500000,
      exportaciones: 1200000,
      metasCorrespondientes: 1000000
    },
    {
      id: 'emp-002',
      empresa: 'BioMed Device Solutions CR Ltda.',
      cedula: '3-102-654321',
      clasificacion: 'Ciencias de la Vida / Médica',
      categoria: 'Categoría b) Manufactura en Zona Franca',
      gama: 'Gama Alta',
      periodo: '2025 - 2026',
      nivelEmpleo: 120,
      empleoComprometido: 100,
      inversionEjecutada: 1500000,
      inversionComprometida: 1200000,
      exportaciones: 3500000,
      metasCorrespondientes: 3000000
    },
    {
      id: 'emp-003',
      empresa: 'AgroLogística del Caribe S.A.',
      cedula: '3-101-445566',
      clasificacion: 'Agroindustria y Logística',
      categoria: 'Categoría c) Comercialización y Logística',
      gama: 'Gama Media',
      periodo: '2025 - 2026',
      nivelEmpleo: 28,
      empleoComprometido: 40,
      inversionEjecutada: 380000,
      inversionComprometida: 500000,
      exportaciones: 750000,
      metasCorrespondientes: 900000
    }
  ];

  // Base de datos de Historial de Expedientes (Trazabilidad)
  const INITIAL_HISTORIAL = [
    {
      id: 'emp-001',
      empresa: 'TechCorp Costa Rica S.A.',
      cedula: '3-101-789456',
      regimen: 'Régimen de Zona Franca (Ley 7210)',
      parque: 'Parque Industrial América (Heredia)',
      acuerdoEjecutivo: 'AE-2026-0428',
      analistaAsignado: 'Ing. Carlos Mendoza',
      diasEnProceso: '14 días',
      cantidadDocumentos: '8 documentos',
      eventos: [
        {
          id: 'evt-101',
          tipo: 'solicitud creada',
          fecha: '2026-08-01 09:15 AM',
          descripcion: 'Se registró formalmente la solicitud de ingreso al régimen de zona franca por parte del apoderado legal.',
          estado: 'Pendiente',
          documento: 'Plan_de_Negocios_TechCorp.pdf',
          responsable: 'TechCorp Costa Rica S.A.',
          badgeClass: 'badge-info'
        },
        {
          id: 'evt-102',
          tipo: 'evaluación IA',
          fecha: '2026-08-01 09:16 AM',
          descripcion: 'El motor de Inteligencia Artificial evaluó el expediente obteniendo un puntaje de afinidad de 88/100 (Recomendada). Alta viabilidad financiera.',
          estado: 'Recomendada (88/100)',
          documento: 'Dictamen_Preliminar_IA.json',
          responsable: 'Motor Evaluador IA',
          badgeClass: 'badge-success'
        },
        {
          id: 'evt-103',
          tipo: 'decisión del analista',
          fecha: '2026-08-03 02:30 PM',
          descripcion: 'El analista humano revisó los atestados y la recomendación del motor IA, ratificando la aprobación formal de la solicitud.',
          estado: 'Aprobado',
          documento: 'Resolución_Analista_0428.pdf',
          responsable: 'Ing. Carlos Mendoza (Analista)',
          badgeClass: 'badge-success'
        },
        {
          id: 'evt-104',
          tipo: 'cambios de estado',
          fecha: '2026-08-05 10:00 AM',
          descripcion: 'Estado actualizado de "En Evaluación" a "Empresa Instalada y Activa". Emisión de carné de régimen.',
          estado: 'Instalada',
          documento: 'Acuerdo_Ejecutivo_AE-2026-0428.pdf',
          responsable: 'Dirección Operativa ZoFranca',
          badgeClass: 'badge-info'
        },
        {
          id: 'evt-105',
          tipo: 'reporte recibido',
          fecha: '2026-08-15 11:45 AM',
          descripcion: 'Se recibió el Reporte Anual de Operaciones periodo 2025-2026 con $520,000 ejecutados e ingreso de personal.',
          estado: 'En Regla',
          documento: 'Reporte_Anual_Operaciones_2025_2026.pdf',
          responsable: 'Representante Legal TechCorp',
          badgeClass: 'badge-success'
        },
        {
          id: 'evt-106',
          tipo: 'alerta detectada',
          fecha: '2026-08-15 11:46 AM',
          descripcion: 'El módulo de seguimiento registró una brecha de -5 empleos (45/50 puestos comprometidos, 90.0% cumplimiento).',
          estado: 'Alerta de Cumplimiento',
          documento: 'Informe_Desviacion_Empleo.pdf',
          responsable: 'Módulo de Monitoreo de Cumplimiento',
          badgeClass: 'badge-warning'
        }
      ]
    },
    {
      id: 'emp-002',
      empresa: 'BioMed Device Solutions CR Ltda.',
      cedula: '3-102-654321',
      regimen: 'Régimen de Zona Franca (Ley 7210)',
      parque: 'Zona Franca Coyol (Alajuela)',
      acuerdoEjecutivo: 'AE-2026-0512',
      analistaAsignado: 'Licda. Sofía Vargas',
      diasEnProceso: '22 días',
      cantidadDocumentos: '12 documentos',
      eventos: [
        {
          id: 'evt-201',
          tipo: 'solicitud creada',
          fecha: '2026-07-10 08:30 AM',
          descripcion: 'Ingreso de expediente para instalación de planta de dispositivos médicos de clase II y III.',
          estado: 'Pendiente',
          documento: 'Expediente_Tecnico_BioMed.pdf',
          responsable: 'BioMed Device Solutions',
          badgeClass: 'badge-info'
        },
        {
          id: 'evt-202',
          tipo: 'evaluación IA',
          fecha: '2026-07-10 08:32 AM',
          descripcion: 'Evaluación IA completada: Puntaje de 94/100 (Recomendada). Excelentes proyecciones de exportación.',
          estado: 'Recomendada (94/100)',
          documento: 'Evaluacion_IA_BioMed.json',
          responsable: 'Motor Evaluador IA',
          badgeClass: 'badge-success'
        },
        {
          id: 'evt-203',
          tipo: 'decisión del analista',
          fecha: '2026-07-12 04:15 PM',
          descripcion: 'Aprobación definitiva otorgada tras verificar cumplimiento de requisitos ambientales y permisos de salud.',
          estado: 'Aprobado',
          documento: 'Dictamen_Final_Vargas.pdf',
          responsable: 'Licda. Sofía Vargas (Analista)',
          badgeClass: 'badge-success'
        },
        {
          id: 'evt-204',
          tipo: 'cambios de estado',
          fecha: '2026-07-15 11:00 AM',
          descripcion: 'Cambio de estado a "Empresa Instalada en Régimen". Inicio de operaciones en nave 4B.',
          estado: 'Instalada',
          documento: 'Acuerdo_Ejecutivo_AE-2026-0512.pdf',
          responsable: 'Secretaría de Zonas Francas',
          badgeClass: 'badge-info'
        },
        {
          id: 'evt-205',
          tipo: 'reporte recibido',
          fecha: '2026-08-18 03:20 PM',
          descripcion: 'Presentación del Reporte Anual de Operaciones con 120 empleos reales ($1.5M invertidos).',
          estado: 'En Regla',
          documento: 'Reporte_Operaciones_BioMed_2026.pdf',
          responsable: 'Gerencia General BioMed',
          badgeClass: 'badge-success'
        }
      ]
    },
    {
      id: 'emp-003',
      empresa: 'AgroLogística del Caribe S.A.',
      cedula: '3-101-445566',
      regimen: 'Régimen de Zona Franca (Ley 7210)',
      parque: 'Zona Franca Moín (Limón)',
      acuerdoEjecutivo: 'AE-2026-0309',
      analistaAsignado: 'Ing. Esteban Rojas',
      diasEnProceso: '35 días',
      cantidadDocumentos: '6 documentos',
      eventos: [
        {
          id: 'evt-301',
          tipo: 'solicitud creada',
          fecha: '2026-06-01 11:00 AM',
          descripcion: 'Solicitud para centro de acopio y cadena de frío agroindustrial en la zona atlántica.',
          estado: 'Pendiente',
          documento: 'Solicitud_AgroLogistica.pdf',
          responsable: 'AgroLogística del Caribe',
          badgeClass: 'badge-info'
        },
        {
          id: 'evt-302',
          tipo: 'evaluación IA',
          fecha: '2026-06-01 11:02 AM',
          descripcion: 'Evaluación IA emitida: Puntaje de 62/100 (Revisar). Se señala riesgo moderado por alta rotación.',
          estado: 'Revisar (62/100)',
          documento: 'Informe_Riesgo_IA.json',
          responsable: 'Motor Evaluador IA',
          badgeClass: 'badge-warning'
        },
        {
          id: 'evt-303',
          tipo: 'decisión del analista',
          fecha: '2026-06-05 09:45 AM',
          descripcion: 'Analista requiere garantía fiduciaria adicional antes de recomendar aprobación.',
          estado: 'Aprobado con Condición',
          documento: 'Acta_Condicionada_Rojas.pdf',
          responsable: 'Ing. Esteban Rojas (Analista)',
          badgeClass: 'badge-warning'
        },
        {
          id: 'evt-304',
          tipo: 'reporte recibido',
          fecha: '2026-08-10 02:10 PM',
          descripcion: 'Reporte parcial presentado con 28 empleos y $380,000 ejecutados.',
          estado: 'Con Observación',
          documento: 'Reporte_Parcial_Agro.pdf',
          responsable: 'Dirección Financiera AgroLogística',
          badgeClass: 'badge-warning'
        },
        {
          id: 'evt-305',
          tipo: 'alerta detectada',
          fecha: '2026-08-10 02:12 PM',
          descripcion: 'Alerta de Incumplimiento: Empleo al 70% (28/40 puestos) e Inversión al 76% ($380K/$500K).',
          estado: 'Alerta Grave',
          documento: 'Notificacion_Incumplimiento.pdf',
          responsable: 'Sistema de Alertas de Zona Franca',
          badgeClass: 'badge-danger'
        }
      ]
    }
  ];

  function getStoredEmpresas() {
    try {
      const stored = localStorage.getItem('zofranca_empresas_cumplimiento');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('localStorage no disponible:', e);
    }
    return INITIAL_EMPRESAS;
  }

  function saveStoredEmpresas(data) {
    try {
      localStorage.setItem('zofranca_empresas_cumplimiento', JSON.stringify(data));
    } catch (e) {
      console.warn('Error al guardar en localStorage:', e);
    }
  }

  function getStoredHistorial() {
    try {
      const stored = localStorage.getItem('zofranca_historial_expedientes');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('localStorage no disponible:', e);
    }
    return INITIAL_HISTORIAL;
  }

  const ZoFrancaAPI = {
    /**
     * Obtener listado de empresas registradas
     */
    async getEmpresas() {
      try {
        const response = await fetch(`${LOCAL_API_BASE}/empresas`);
        if (response.ok) {
          return await response.json();
        }
      } catch (e) {
        // Fallback local
      }

      await new Promise(res => setTimeout(res, 150));
      return getStoredEmpresas();
    },

    /**
     * Obtener el reporte de cumplimiento para una empresa específica
     */
    async getReporteCumplimiento(empresaId) {
      try {
        const response = await fetch(`${LOCAL_API_BASE}/reportes/${empresaId}`);
        if (response.ok) {
          return await response.json();
        }
      } catch (e) {
        // Fallback local
      }

      await new Promise(res => setTimeout(res, 200));
      const empresas = getStoredEmpresas();
      const match = empresas.find(e => e.id === empresaId || e.cedula === empresaId) || empresas[0];
      return { ...match };
    },

    /**
     * Enviar y guardar reporte de cumplimiento
     */
    async enviarReporteCumplimiento(reporteData) {
      let saved = false;
      let responsePayload = null;

      try {
        const response = await fetch(`${LOCAL_API_BASE}/reportes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reporteData)
        });
        if (response.ok) {
          responsePayload = await response.json();
          saved = true;
        }
      } catch (e) {
        // Servidor no respondió
      }

      if (!saved) {
        await new Promise(res => setTimeout(res, 450));
        const empresas = getStoredEmpresas();
        const index = empresas.findIndex(e => e.cedula === reporteData.cedula || e.id === reporteData.id);
        const record = {
          ...reporteData,
          id: reporteData.id || `rep-${Date.now()}`,
          fechaActualizacion: new Date().toISOString()
        };

        if (index >= 0) {
          empresas[index] = { ...empresas[index], ...record };
        } else {
          empresas.push(record);
        }
        saveStoredEmpresas(empresas);
        responsePayload = record;
      }

      return responsePayload;
    },

    /**
     * Obtener el historial completo de expedientes y eventos
     * Retorna { isOnline: boolean, data: Array }
     */
    async getHistorialExpedientes() {
      let isOnline = false;
      try {
        const response = await fetch(`${LOCAL_API_BASE}/historial`);
        if (response.ok) {
          const data = await response.json();
          return { isOnline: true, data };
        }
      } catch (e) {
        // API no disponible
      }

      await new Promise(res => setTimeout(res, 300));
      return { isOnline: false, data: getStoredHistorial() };
    },

    /**
     * Obtener un expediente específico por ID o Cédula con su trazabilidad
     */
    async getHistorialExpediente(expedienteId) {
      let isOnline = false;
      try {
        const response = await fetch(`${LOCAL_API_BASE}/historial/${expedienteId}`);
        if (response.ok) {
          const data = await response.json();
          return { isOnline: true, data };
        }
      } catch (e) {
        // API no disponible
      }

      await new Promise(res => setTimeout(res, 250));
      const lista = getStoredHistorial();
      const match = lista.find(e => e.id === expedienteId || e.cedula === expedienteId) || lista[0];
      return { isOnline: false, data: { ...match } };
    }
  };

  global.ZoFrancaAPI = ZoFrancaAPI;
})(typeof window !== 'undefined' ? window : this);

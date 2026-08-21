const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Datos en memoria simulados para la API local de empresas y reportes
const empresasDB = [
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

const reportesDB = [];

// Historial de Expedientes (Trazabilidad)
const historialDB = [
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

// Rutas de API
app.get('/api/empresas', (req, res) => {
  res.json(empresasDB);
});

app.get('/api/reportes/:id', (req, res) => {
  const match = empresasDB.find(e => e.id === req.params.id || e.cedula === req.params.id);
  if (match) {
    return res.json(match);
  }
  res.status(404).json({ error: 'Empresa no encontrada' });
});

app.post('/api/reportes', (req, res) => {
  const reporte = {
    ...req.body,
    id: req.body.id || `rep-${Date.now()}`,
    fechaCreacion: new Date().toISOString()
  };

  reportesDB.push(reporte);

  const index = empresasDB.findIndex(e => e.cedula === reporte.cedula || e.id === reporte.id);
  if (index >= 0) {
    empresasDB[index] = { ...empresasDB[index], ...reporte };
  } else {
    empresasDB.push(reporte);
  }

  res.status(201).json({ status: 'ok', data: reporte });
});

app.get('/api/historial', (req, res) => {
  res.json(historialDB);
});

app.get('/api/historial/:id', (req, res) => {
  const match = historialDB.find(e => e.id === req.params.id || e.cedula === req.params.id);
  if (match) {
    return res.json(match);
  }
  res.status(404).json({ error: 'Expediente no encontrado' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages/index.html'));
});

const pageNames = [
  'index',
  'nueva-solicitud',
  'detalle',
  'decision',
  'cumplimiento',
  'alertas',
  'historial'
];

pageNames.forEach(pageName => {
  const pageFile = path.join(__dirname, 'public', 'pages', `${pageName}.html`);

  app.get(`/${pageName}.html`, (req, res) => {
    res.sendFile(pageFile);
  });

  if (pageName !== 'index') {
    app.get(`/${pageName}`, (req, res) => {
      res.sendFile(pageFile);
    });
  }
});

const PORT = Number(process.env.ZOFRANCA_WEB_PORT) || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

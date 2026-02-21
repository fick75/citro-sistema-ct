/**
 * ═══════════════════════════════════════════════════════════════
 * CITRO — Configuración de Formularios
 * Definición de todos los formularios del sistema
 * Universidad Veracruzana
 * ═══════════════════════════════════════════════════════════════
 */

const FORMS_CONFIG = {
    
    // ━━━ APOYO ACADÉMICO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    apoyo_academico: {
        title: 'Apoyo Académico',
        subtitle: 'Solicitud de apoyo para actividades académicas, congresos, viajes de investigación',
        fields: [
            {
                name: 'tipo_solicitante',
                label: 'Tipo de Solicitante',
                type: 'select',
                required: true,
                options: [
                    'Estudiante de Licenciatura',
                    'Estudiante de Maestría',
                    'Estudiante de Doctorado',
                    'Académico',
                    'Técnico Académico',
                    'Personal Administrativo'
                ]
            },
            {
                name: 'nombre_completo',
                label: 'Nombre Completo',
                type: 'text',
                required: true,
                placeholder: 'Nombre completo del solicitante'
            },
            {
                name: 'correo',
                label: 'Correo Electrónico',
                type: 'email',
                required: true,
                placeholder: 'correo@uv.mx'
            },
            {
                name: 'matricula',
                label: 'Matrícula / Número de Personal',
                type: 'text',
                required: true,
                placeholder: 'Matrícula o número de personal'
            },
            {
                name: 'titulo_actividad',
                label: 'Título de la Actividad',
                type: 'text',
                required: true,
                placeholder: 'Nombre del congreso, evento, viaje, etc.'
            },
            {
                name: 'tipo_actividad',
                label: 'Tipo de Actividad',
                type: 'select',
                required: true,
                options: [
                    'Congreso',
                    'Conferencia',
                    'Taller',
                    'Curso',
                    'Estancia de Investigación',
                    'Trabajo de Campo',
                    'Otro'
                ]
            },
            {
                name: 'fecha_inicio',
                label: 'Fecha de Inicio',
                type: 'date',
                required: true
            },
            {
                name: 'fecha_fin',
                label: 'Fecha de Fin',
                type: 'date',
                required: false
            },
            {
                name: 'destino',
                label: 'Destino (Ciudad, Estado, País)',
                type: 'text',
                required: true,
                placeholder: 'Ej: Monterrey, N.L., México'
            },
            {
                name: 'institucion_anfitriona',
                label: 'Institución Organizadora',
                type: 'text',
                required: false,
                placeholder: 'Nombre de la institución que organiza'
            },
            {
                name: 'monto_total',
                label: 'Monto Total Solicitado (MXN)',
                type: 'number',
                required: true,
                placeholder: '0.00',
                help: 'Incluir transporte, hospedaje, registro, etc.'
            },
            {
                name: 'desglose_gastos',
                label: 'Desglose de Gastos',
                type: 'textarea',
                rows: 4,
                required: true,
                placeholder: 'Transporte: $X, Hospedaje: $Y, Registro: $Z, etc.'
            },
            {
                name: 'justificacion',
                label: 'Justificación de la Solicitud',
                type: 'textarea',
                rows: 5,
                required: true,
                placeholder: 'Explique la importancia y beneficios de la actividad para su formación académica o investigación'
            }
        ]
    },
    
    // ━━━ AVAL INSTITUCIONAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    aval_institucional: {
        title: 'Aval Institucional',
        subtitle: 'Respaldo oficial para representar al CITRO en eventos académicos',
        fields: [
            {
                name: 'tipo_solicitante',
                label: 'Tipo de Solicitante',
                type: 'select',
                required: true,
                options: [
                    'Estudiante de Licenciatura',
                    'Estudiante de Maestría',
                    'Estudiante de Doctorado',
                    'Académico',
                    'Técnico Académico'
                ]
            },
            {
                name: 'nombre_completo',
                label: 'Nombre Completo',
                type: 'text',
                required: true,
                placeholder: 'Nombre completo del solicitante'
            },
            {
                name: 'correo',
                label: 'Correo Electrónico',
                type: 'email',
                required: true,
                placeholder: 'correo@uv.mx'
            },
            {
                name: 'matricula',
                label: 'Matrícula / Número de Personal',
                type: 'text',
                required: true
            },
            {
                name: 'titulo_actividad',
                label: 'Nombre del Evento',
                type: 'text',
                required: true,
                placeholder: 'Nombre completo del evento o actividad'
            },
            {
                name: 'tipo_participacion',
                label: 'Tipo de Participación',
                type: 'select',
                required: true,
                options: [
                    'Ponencia Oral',
                    'Póster',
                    'Taller',
                    'Mesa Redonda',
                    'Conferencia Magistral',
                    'Asistente',
                    'Organizador',
                    'Otro'
                ]
            },
            {
                name: 'fecha_actividad',
                label: 'Fecha del Evento',
                type: 'date',
                required: true
            },
            {
                name: 'lugar',
                label: 'Lugar (Ciudad, Estado, País)',
                type: 'text',
                required: true,
                placeholder: 'Ej: Ciudad de México, CDMX, México'
            },
            {
                name: 'institucion_organizadora',
                label: 'Institución Organizadora',
                type: 'text',
                required: true,
                placeholder: 'Nombre de la institución que organiza'
            },
            {
                name: 'titulo_trabajo',
                label: 'Título del Trabajo a Presentar',
                type: 'textarea',
                rows: 2,
                required: false,
                placeholder: 'Si aplica'
            },
            {
                name: 'justificacion',
                label: 'Justificación',
                type: 'textarea',
                rows: 5,
                required: true,
                placeholder: 'Explique por qué requiere el aval institucional del CITRO'
            }
        ]
    },
    
    // ━━━ APOYO A TERCEROS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    apoyo_terceros: {
        title: 'Apoyo a Terceros',
        subtitle: 'Apoyo para colaboradores externos o instituciones',
        fields: [
            {
                name: 'nombre_solicitante',
                label: 'Tu Nombre (Solicitante UV)',
                type: 'text',
                required: true,
                placeholder: 'Académico o estudiante UV que solicita'
            },
            {
                name: 'correo_solicitante',
                label: 'Tu Correo Electrónico',
                type: 'email',
                required: true,
                placeholder: 'tu_correo@uv.mx'
            },
            {
                name: 'adscripcion_solicitante',
                label: 'Tu Adscripción',
                type: 'text',
                required: true,
                placeholder: 'Ej: Posgrado en Ecología Tropical'
            },
            {
                name: 'nombre_beneficiario',
                label: 'Nombre del Beneficiario (Tercero)',
                type: 'text',
                required: true,
                placeholder: 'Nombre de la persona o institución externa'
            },
            {
                name: 'institucion_beneficiario',
                label: 'Institución del Beneficiario',
                type: 'text',
                required: true,
                placeholder: 'Institución a la que pertenece'
            },
            {
                name: 'tipo_apoyo',
                label: 'Tipo de Apoyo Solicitado',
                type: 'select',
                required: true,
                options: [
                    'Apoyo Económico',
                    'Hospedaje',
                    'Transporte',
                    'Uso de Instalaciones',
                    'Equipo',
                    'Otro'
                ]
            },
            {
                name: 'monto_total',
                label: 'Monto Solicitado (si aplica)',
                type: 'number',
                required: false,
                placeholder: '0.00'
            },
            {
                name: 'periodo',
                label: 'Periodo del Apoyo',
                type: 'text',
                required: true,
                placeholder: 'Ej: Del 1 al 15 de marzo de 2026'
            },
            {
                name: 'proposito',
                label: 'Propósito del Apoyo',
                type: 'textarea',
                rows: 4,
                required: true,
                placeholder: 'Describa la actividad o proyecto que justifica el apoyo'
            },
            {
                name: 'justificacion',
                label: 'Justificación y Beneficios para el CITRO',
                type: 'textarea',
                rows: 5,
                required: true,
                placeholder: 'Explique por qué este apoyo es importante y cómo beneficia al CITRO'
            }
        ]
    },
    
    // ━━━ COMITÉ TUTORIAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    comite_tutorial: {
        title: 'Modificación de Comité Tutorial',
        subtitle: 'Para estudiantes de posgrado (Maestría y Doctorado)',
        fields: [
            {
                name: 'nombre_estudiante',
                label: 'Nombre del Estudiante',
                type: 'text',
                required: true,
                placeholder: 'Nombre completo'
            },
            {
                name: 'correo',
                label: 'Correo Electrónico',
                type: 'email',
                required: true,
                placeholder: 'correo@uv.mx'
            },
            {
                name: 'matricula',
                label: 'Matrícula',
                type: 'text',
                required: true
            },
            {
                name: 'programa',
                label: 'Programa de Posgrado',
                type: 'select',
                required: true,
                options: [
                    'Maestría en Ecología Tropical',
                    'Doctorado en Ecología Tropical',
                    'Maestría en Manejo de Ecosistemas',
                    'Otro'
                ]
            },
            {
                name: 'semestre_actual',
                label: 'Semestre Actual',
                type: 'select',
                required: true,
                options: ['1', '2', '3', '4', '5', '6', '7', '8']
            },
            {
                name: 'tipo_modificacion',
                label: 'Tipo de Modificación Solicitada',
                type: 'select',
                required: true,
                options: [
                    'Cambio de Director de Tesis',
                    'Cambio de Asesor',
                    'Agregar Miembro al Comité',
                    'Eliminar Miembro del Comité',
                    'Reemplazo de Miembro'
                ]
            },
            {
                name: 'comite_actual',
                label: 'Comité Tutorial Actual',
                type: 'textarea',
                rows: 3,
                required: true,
                placeholder: 'Lista de miembros actuales del comité (nombres y roles)'
            },
            {
                name: 'comite_propuesto',
                label: 'Comité Tutorial Propuesto',
                type: 'textarea',
                rows: 3,
                required: true,
                placeholder: 'Lista de miembros propuestos (nombres y roles)'
            },
            {
                name: 'nombre_nuevo_miembro',
                label: 'Nombre del Nuevo Miembro (si aplica)',
                type: 'text',
                required: false,
                placeholder: 'Dr./Dra. Nombre Completo'
            },
            {
                name: 'institucion_nuevo_miembro',
                label: 'Institución del Nuevo Miembro',
                type: 'text',
                required: false
            },
            {
                name: 'justificacion',
                label: 'Justificación de la Modificación',
                type: 'textarea',
                rows: 6,
                required: true,
                placeholder: 'Explique las razones académicas que justifican esta modificación'
            }
        ]
    },
    
    // ━━━ SOLICITUD LIBRE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    solicitud_libre: {
        title: 'Solicitud Libre',
        subtitle: 'Para trámites no contemplados en los formatos anteriores',
        fields: [
            {
                name: 'tipo_solicitante',
                label: 'Tipo de Solicitante',
                type: 'select',
                required: true,
                options: [
                    'Estudiante de Licenciatura',
                    'Estudiante de Maestría',
                    'Estudiante de Doctorado',
                    'Académico',
                    'Técnico Académico',
                    'Personal Administrativo',
                    'Externo'
                ]
            },
            {
                name: 'nombre_completo',
                label: 'Nombre Completo',
                type: 'text',
                required: true,
                placeholder: 'Nombre completo del solicitante'
            },
            {
                name: 'correo',
                label: 'Correo Electrónico',
                type: 'email',
                required: true,
                placeholder: 'correo@uv.mx'
            },
            {
                name: 'matricula',
                label: 'Matrícula / Número de Personal',
                type: 'text',
                required: false,
                placeholder: 'Si aplica'
            },
            {
                name: 'asunto',
                label: 'Asunto de la Solicitud',
                type: 'text',
                required: true,
                placeholder: 'Resumen breve del asunto'
            },
            {
                name: 'categoria',
                label: 'Categoría',
                type: 'select',
                required: true,
                options: [
                    'Académico',
                    'Administrativo',
                    'Infraestructura',
                    'Recursos',
                    'Otro'
                ]
            },
            {
                name: 'descripcion',
                label: 'Descripción Detallada',
                type: 'textarea',
                rows: 8,
                required: true,
                placeholder: 'Describa detalladamente su solicitud, incluyendo antecedentes, justificación y resultados esperados'
            },
            {
                name: 'documentos_adjuntos',
                label: 'Documentos Adjuntos (opcional)',
                type: 'textarea',
                rows: 2,
                required: false,
                placeholder: 'Liste los documentos que adjunta o mencione si los enviará posteriormente'
            }
        ]
    }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LOG DE CARGA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if (typeof CONFIG !== 'undefined' && CONFIG.options?.debug) {
    console.log('📦 forms-data.js cargado');
    console.log('   Formularios disponibles:', Object.keys(FORMS_CONFIG).length);
    console.log('   Tipos:', Object.keys(FORMS_CONFIG).join(', '));
}

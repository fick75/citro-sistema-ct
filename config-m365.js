/**
 * ═══════════════════════════════════════════════════════════════
 * CITRO — Configuración HÍBRIDA
 * SharePoint Lists + OneDrive
 * Universidad Veracruzana
 * ═══════════════════════════════════════════════════════════════
 */

const CONFIG = {
    
    // ━━━ AZURE ACTIVE DIRECTORY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    azure: {
        clientId: '0681dda0-70f4-4038-b901-d41ee738cc2e',
        tenantId: '3c907651-d8c6-4ca6-a8a4-6a242430e653',
        
        scopes: [
            'User.Read',
            'Sites.ReadWrite.All',    // ← SharePoint Lists
            'Files.ReadWrite',        // ← OneDrive (NUEVO)
            'Calendars.ReadWrite',
            'Mail.Send'
        ]
    },

    // ━━━ SHAREPOINT (SOLO LISTAS) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    sharepoint: {
        siteUrl: 'https://uvmx.sharepoint.com/sites/CtTramites2026',
        tenant: 'uvmx',
        listName: 'SolicitudesCITRO'  // ← Solo lista, sin biblioteca
    },

    // ━━━ ONEDRIVE (ALMACENAMIENTO DE PDFS) ━━━━━━━━━━━━━━━━━━━
    onedrive: {
        // Carpeta base en OneDrive
        basePath: 'CITRO/PDFs',
        
        // Subcarpetas por tipo de trámite
        folders: {
            apoyo_academico:     '01_Apoyo_Academico',
            aval_institucional:  '02_Aval_Institucional',
            apoyo_terceros:      '03_Apoyo_Terceros',
            comite_tutorial:     '04_Comite_Tutorial',
            solicitud_libre:     '05_Solicitud_Libre'
        }
    },

    // ━━━ POWER AUTOMATE (Opcional) ━━━━━━━━━━━━━━━━━━━━━━━━━━━
    powerAutomate: {
        flowUrl: '',
        enabled: false
    },

    // ━━━ ADMINISTRADORES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    admins: [
        'clopez@uv.mx',
        'rmenchaca@uv.mx',
        'carlolopezo@uv.mx'
    ],

    // ━━━ INFORMACIÓN INSTITUCIONAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━
    institucion: {
        nombre:      'Centro de Investigaciones Tropicales',
        nombreCorto: 'CITRO',
        universidad: 'Universidad Veracruzana',
        email:       'ctecnicocitro@uv.mx',
        telefono:    '228-842-1800',
        direccion:   'Xalapa, Veracruz, México',
        sitioWeb:    'https://www.uv.mx/citro'
    },

    // ━━━ CONFIGURACIÓN DE CORREOS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    email: {
        adminEmail: 'ctecnicocitro@uv.mx',
        enviarConfirmacion: true,
        ccAdminEnConfirmacion: false,
        firmaEmail: 'H. Consejo Técnico del CITRO<br>Universidad Veracruzana'
    },

    // ━━━ OPCIONES DE SEGURIDAD Y VALIDACIÓN ━━━━━━━━━━━━━━━━━━
    options: {
        soloEmailUV: true,
        dominioPermitido: 'uv.mx',
        plazoMinimoDias: 21,
        montoMaximo: 100000,
        requiereJustificacionSi: 50000,
        debug: true,
        cacheDuration: 5
    },

    // ━━━ CONFIGURACIÓN DE FORMULARIOS ━━━━━━━━━━━━━━━━━━━━━━━━
    formularios: {
        camposObligatorios: ['nombre_completo', 'correo', 'matricula'],
        formatoFolio: {
            apoyo_academico:    'AAC',
            aval_institucional: 'AVI',
            apoyo_terceros:     'TER',
            comite_tutorial:    'CMT',
            solicitud_libre:    'LIB'
        },
        tiposSolicitante: [
            'Estudiante de Licenciatura',
            'Estudiante de Maestría',
            'Estudiante de Doctorado',
            'Académico',
            'Técnico Académico',
            'Personal Administrativo',
            'Externo'
        ]
    },

    // ━━━ VERSIÓN ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    version: {
        numero: '1.2',
        fecha: 'Febrero 2026',
        nombre: 'Sistema CITRO M365 - Híbrido (SharePoint + OneDrive)'
    }
};

// ━━━ VALIDACIÓN ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
(function validarConfig() {
    const errores = [];
    
    if (CONFIG.azure.clientId.includes('PEGAR')) {
        errores.push('⚠️ Falta configurar Azure clientId');
    }
    
    if (CONFIG.azure.tenantId.includes('PEGAR')) {
        errores.push('⚠️ Falta configurar Azure tenantId');
    }
    
    if (!CONFIG.sharepoint.siteUrl.includes('uvmx.sharepoint.com')) {
        errores.push('⚠️ URL de SharePoint incorrecta');
    }
    
    if (!CONFIG.onedrive.basePath) {
        errores.push('⚠️ Falta configurar ruta base de OneDrive');
    }
    
    if (errores.length > 0) {
        console.error('❌ ERRORES DE CONFIGURACIÓN:');
        errores.forEach(e => console.error(e));
    } else if (CONFIG.options.debug) {
        console.log('✅ Configuración validada correctamente');
        console.log('📋 SharePoint Lists:', CONFIG.sharepoint.listName);
        console.log('📁 OneDrive:', CONFIG.onedrive.basePath);
    }
})();

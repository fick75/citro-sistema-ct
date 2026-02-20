/**
 * ═══════════════════════════════════════════════════════════════
 * CITRO — Lógica Principal M365 (OPTIMIZADO)
 * Gestión de formularios, envío y generación de PDFs
 * Versión: 1.1 - Febrero 2026
 * ═══════════════════════════════════════════════════════════════
 */

// Estado global de la aplicación
const appState = {
    currentTramite: null,
    formData: {},
    folio: null,
    lastPdfUrl: null,
    isProcessing: false
};

// ════════════════════════════════════════════════════════════════
// NAVEGACIÓN ENTRE SECCIONES
// ════════════════════════════════════════════════════════════════

/**
 * Mostrar sección específica
 */
function showSection(name) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll(
        '.landing-page, .form-section, .mis-solicitudes-section, .admin-panel-section, .success-section'
    );
    sections.forEach(section => section.classList.remove('active'));

    // Mapeo de nombres a IDs
    const sectionMap = {
        'landing': 'landing-page',
        'form': 'form-section',
        'mis-solicitudes': 'mis-solicitudes-section',
        'admin-panel': 'admin-panel-section',
        'success': 'success-section'
    };

    // Mostrar sección solicitada
    const sectionId = sectionMap[name];
    if (sectionId) {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            if (CONFIG.options.debug) {
                console.log(`📄 Navegando a: ${name}`);
            }
        }
    }

    // Scroll suave al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Volver al inicio
 */
function goToHome() {
    showSection('landing');
    resetForm();
}

/**
 * Volver a landing page
 */
function backToLanding() {
    showSection('landing');
    resetForm();
}

/**
 * Mostrar/ocultar overlay de carga
 */
function showLoading(visible) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        if (visible) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    }
}

/**
 * Ir al panel del usuario (Mis Solicitudes o Admin)
 */
function goToPanel() {
    if (userState.isAdmin) {
        goToAdminPanel();
    } else {
        goToMisSolicitudes();
    }
}

// ════════════════════════════════════════════════════════════════
// SELECCIÓN DE TRÁMITE
// ════════════════════════════════════════════════════════════════

/**
 * Seleccionar tipo de trámite e iniciar formulario
 */
function selectTramite(tipo) {
    // Verificar autenticación
    if (!userState.isLoggedIn) {
        if (CONFIG.options.debug) {
            console.log('⚠️ Usuario no autenticado, redirigiendo a login...');
        }
        signInWithMicrosoft();
        return;
    }

    // Verificar que el tipo de trámite existe
    if (!FORMS_CONFIG[tipo]) {
        console.error(`❌ Tipo de trámite no válido: ${tipo}`);
        alert('Error: Tipo de trámite no válido');
        return;
    }

    appState.currentTramite = tipo;
    
    if (CONFIG.options.debug) {
        console.log(`📝 Trámite seleccionado: ${FORMS_CONFIG[tipo].title}`);
    }

    loadForm(tipo);
    showSection('form');
}

// ════════════════════════════════════════════════════════════════
// GENERACIÓN DINÁMICA DE FORMULARIO
// ════════════════════════════════════════════════════════════════

/**
 * Cargar formulario dinámico según tipo de trámite
 */
function loadForm(tipo) {
    const config = FORMS_CONFIG[tipo];
    
    if (!config) {
        console.error(`❌ Configuración de formulario no encontrada para: ${tipo}`);
        return;
    }

    // Actualizar título y subtítulo
    const titleElement = document.getElementById('form-title');
    const subtitleElement = document.getElementById('form-subtitle');
    
    if (titleElement) {
        titleElement.textContent = config.title;
    }
    
    if (subtitleElement) {
        subtitleElement.textContent = config.subtitle || 'Complete todos los campos marcados con *';
    }

    // Generar campos del formulario
    const formContainer = document.getElementById('dynamic-form');
    if (!formContainer) {
        console.error('❌ Contenedor de formulario no encontrado');
        return;
    }

    formContainer.innerHTML = '';

    if (CONFIG.options.debug) {
        console.log(`📋 Generando formulario con ${config.fields.length} campos`);
    }

    // Crear cada campo
    config.fields.forEach((field, index) => {
        const fieldGroup = createFormField(field);
        formContainer.appendChild(fieldGroup);
    });

    // Pre-llenar datos del usuario autenticado
    prefillUserData(formContainer);

    if (CONFIG.options.debug) {
        console.log('✅ Formulario generado exitosamente');
    }
}

/**
 * Crear elemento de campo de formulario
 */
function createFormField(fieldConfig) {
    const group = document.createElement('div');
    group.className = 'form-group';

    // Label
    const label = document.createElement('label');
    label.className = 'form-label' + (fieldConfig.required ? ' required' : '');
    label.textContent = fieldConfig.label;
    label.setAttribute('for', fieldConfig.name);
    group.appendChild(label);

    // Input
    let input;

    switch (fieldConfig.type) {
        case 'select':
            input = document.createElement('select');
            input.className = 'form-select';
            
            // Opción vacía
            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.textContent = 'Seleccione...';
            input.appendChild(emptyOption);
            
            // Opciones
            (fieldConfig.options || []).forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                input.appendChild(opt);
            });
            break;

        case 'textarea':
            input = document.createElement('textarea');
            input.className = 'form-textarea';
            input.rows = fieldConfig.rows || 4;
            input.placeholder = fieldConfig.placeholder || '';
            break;

        default:
            input = document.createElement('input');
            input.type = fieldConfig.type;
            input.className = 'form-input';
            input.placeholder = fieldConfig.placeholder || '';
            
            // Validaciones específicas por tipo
            if (fieldConfig.type === 'email') {
                input.pattern = '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$';
            }
            if (fieldConfig.type === 'number' || fieldConfig.type === 'currency') {
                input.min = '0';
                input.step = fieldConfig.type === 'currency' ? '0.01' : '1';
            }
            break;
    }

    input.id = fieldConfig.name;
    input.name = fieldConfig.name;
    if (fieldConfig.required) {
        input.required = true;
    }

    group.appendChild(input);

    // Texto de ayuda
    if (fieldConfig.help) {
        const helpText = document.createElement('div');
        helpText.className = 'form-help-text';
        helpText.textContent = fieldConfig.help;
        group.appendChild(helpText);
    }

    return group;
}

/**
 * Pre-llenar datos del usuario autenticado
 */
function prefillUserData(formContainer) {
    if (!userState.profile) {
        return;
    }

    // Campos de email
    const emailFields = formContainer.querySelectorAll(
        '[name="correo"], [name="correo_solicitante"]'
    );
    emailFields.forEach(field => {
        field.value = userState.profile.email;
        field.readOnly = true; // Email no debe cambiar
    });

    // Campos de nombre
    const nameFields = formContainer.querySelectorAll(
        '[name="nombre_completo"], [name="nombre_estudiante"], [name="nombre_solicitante"]'
    );
    nameFields.forEach(field => {
        field.value = userState.profile.nombre;
    });

    if (CONFIG.options.debug) {
        console.log('✅ Datos del usuario pre-llenados');
        console.log('   Nombre:', userState.profile.nombre);
        console.log('   Email:', userState.profile.email);
    }
}

// ════════════════════════════════════════════════════════════════
// ENVÍO DE FORMULARIO
// ════════════════════════════════════════════════════════════════

/**
 * Enviar formulario y procesar solicitud
 */
async function submitForm() {
    // Verificar autenticación
    if (!userState.isLoggedIn) {
        if (CONFIG.options.debug) {
            console.log('⚠️ Usuario no autenticado');
        }
        signInWithMicrosoft();
        return;
    }

    // Prevenir envíos múltiples
    if (appState.isProcessing) {
        if (CONFIG.options.debug) {
            console.log('⚠️ Ya hay un envío en proceso');
        }
        return;
    }

    const form = document.getElementById('dynamic-form');
    if (!form) {
        console.error('❌ Formulario no encontrado');
        return;
    }

    // Validar formulario HTML5
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Recopilar datos del formulario
    appState.formData = {};
    const formDataObj = new FormData(form);
    formDataObj.forEach((value, key) => {
        appState.formData[key] = value;
    });

    // Validar datos adicionales
    const validationError = validateFormData(appState.formData);
    if (validationError) {
        alert(`⚠️ Error de validación:\n\n${validationError}`);
        return;
    }

    // Generar folio
    appState.folio = generateFolio(appState.currentTramite);

    if (CONFIG.options.debug) {
        console.log('\n🚀 Iniciando envío de solicitud...');
        console.log('   Folio:', appState.folio);
        console.log('   Tipo:', FORMS_CONFIG[appState.currentTramite].title);
        console.log('   Usuario:', userState.profile.email);
        console.log('   Datos:', appState.formData);
    }

    appState.isProcessing = true;
    showLoading(true);

    try {
        // PASO 1: Generar PDF
        if (CONFIG.options.debug) {
            console.log('\n📄 [1/5] Generando PDF...');
        }
        const pdfBlob = generatePDF(
            appState.currentTramite,
            appState.formData,
            appState.folio
        );
        
        if (!pdfBlob || pdfBlob.size === 0) {
            throw new Error('No se pudo generar el PDF');
        }
        
        if (CONFIG.options.debug) {
            console.log(`✅ PDF generado (${(pdfBlob.size / 1024).toFixed(2)} KB)`);
        }

        // PASO 2: Subir PDF a SharePoint
        if (CONFIG.options.debug) {
            console.log('\n📤 [2/5] Subiendo PDF a SharePoint...');
        }
        const pdfUrl = await uploadPDFToSharePoint(
            pdfBlob,
            appState.folio,
            appState.currentTramite
        );
        appState.lastPdfUrl = pdfUrl;
        
        if (CONFIG.options.debug) {
            console.log('✅ PDF subido exitosamente');
        }

        // PASO 3: Crear item en lista SharePoint
        if (CONFIG.options.debug) {
            console.log('\n💾 [3/5] Guardando en SharePoint...');
        }
        await createSolicitudEnSharePoint({
            folio: appState.folio,
            tipo: FORMS_CONFIG[appState.currentTramite].title,
            formData: appState.formData
        });
        
        if (CONFIG.options.debug) {
            console.log('✅ Solicitud guardada en SharePoint');
        }

        // PASO 4: Email de confirmación al usuario
        if (CONFIG.email.enviarConfirmacion) {
            if (CONFIG.options.debug) {
                console.log('\n📧 [4/5] Enviando email al usuario...');
            }
            
            const destinatario = appState.formData.correo || 
                               appState.formData.correo_solicitante || 
                               userState.profile.email;
            
            await sendEmailViaGraph(
                destinatario,
                `CITRO — Solicitud recibida (Folio: ${appState.folio})`,
                buildConfirmationEmailHTML(
                    appState.formData,
                    appState.folio,
                    appState.currentTramite,
                    pdfUrl
                )
            );
            
            if (CONFIG.options.debug) {
                console.log('✅ Email de confirmación enviado');
            }
        } else {
            if (CONFIG.options.debug) {
                console.log('⏭️  [4/5] Email de confirmación desactivado');
            }
        }

        // PASO 5: Notificación al Consejo Técnico
        if (CONFIG.options.debug) {
            console.log('\n📬 [5/5] Notificando al Consejo Técnico...');
        }
        
        await sendEmailViaGraph(
            CONFIG.email.adminEmail,
            `CITRO — Nueva solicitud: ${appState.folio}`,
            buildAdminNotificationHTML(
                appState.formData,
                appState.folio,
                appState.currentTramite,
                pdfUrl
            )
        );
        
        if (CONFIG.options.debug) {
            console.log('✅ Notificación al CT enviada');
        }

        // OPCIONAL: Power Automate
        if (CONFIG.powerAutomate.enabled && CONFIG.powerAutomate.flowUrl) {
            if (CONFIG.options.debug) {
                console.log('\n⚡ Trigger Power Automate...');
            }
            
            try {
                await fetch(CONFIG.powerAutomate.flowUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        folio: appState.folio,
                        tipo: FORMS_CONFIG[appState.currentTramite].title,
                        solicitante: appState.formData.nombre_completo || '',
                        email: userState.profile.email,
                        pdfUrl: pdfUrl || ''
                    })
                });
                
                if (CONFIG.options.debug) {
                    console.log('✅ Power Automate triggered');
                }
            } catch (error) {
                console.warn('⚠️ Error en Power Automate (no crítico):', error);
            }
        }

        // Mostrar pantalla de éxito
        if (CONFIG.options.debug) {
            console.log('\n✅ Proceso completado exitosamente');
            console.log('════════════════════════════════════════\n');
        }
        
        showSuccess();

    } catch (error) {
        console.error('❌ Error al enviar solicitud:', error);
        
        // Mensaje de error amigable
        const errorMessage = getErrorMessage(error);
        
        alert(
            `❌ Error al enviar la solicitud\n\n` +
            `${errorMessage}\n\n` +
            `Folio afectado: ${appState.folio}\n\n` +
            `Si el problema persiste, contacta al administrador.\n` +
            `Presiona F12 para ver detalles técnicos.`
        );

    } finally {
        appState.isProcessing = false;
        showLoading(false);
    }
}

/**
 * Validar datos del formulario
 */
function validateFormData(data) {
    // Validar email si existe
    const email = data.correo || data.correo_solicitante;
    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'El email no es válido';
        }
        
        // Validar dominio si está configurado
        if (CONFIG.options.soloEmailUV) {
            const domain = email.split('@')[1];
            if (domain !== CONFIG.options.dominioPermitido) {
                return `Solo se permiten emails del dominio @${CONFIG.options.dominioPermitido}`;
            }
        }
    }

    // Validar monto si existe
    const monto = data.monto_total || data.monto_solicitado;
    if (monto) {
        const montoNum = parseFloat(monto);
        if (isNaN(montoNum) || montoNum < 0) {
            return 'El monto debe ser un número positivo';
        }
        if (CONFIG.options.montoMaximo && montoNum > CONFIG.options.montoMaximo) {
            return `El monto no puede exceder $${CONFIG.options.montoMaximo.toLocaleString('es-MX')} MXN`;
        }
    }

    // Validar fechas si existen
    const fechaInicio = data.fecha_inicio;
    const fechaFin = data.fecha_fin;
    if (fechaInicio && fechaFin) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        if (fin < inicio) {
            return 'La fecha de fin no puede ser anterior a la fecha de inicio';
        }
    }

    return null; // Sin errores
}

/**
 * Obtener mensaje de error amigable
 */
function getErrorMessage(error) {
    const message = error.message || String(error);

    if (message.includes('no existe en SharePoint')) {
        return 'Error de configuración de SharePoint.\nContacta al administrador del sistema.';
    }
    
    if (message.includes('No tienes permisos')) {
        return 'No tienes los permisos necesarios en SharePoint.\nContacta al administrador.';
    }
    
    if (message.includes('Token') || message.includes('401')) {
        return 'Tu sesión expiró. Por favor, cierra sesión y vuelve a iniciar.';
    }
    
    if (message.includes('network') || message.includes('fetch')) {
        return 'Error de conexión. Verifica tu internet e intenta de nuevo.';
    }
    
    if (message.includes('PDF')) {
        return 'Error al generar o subir el PDF. Intenta de nuevo.';
    }

    return message; // Mensaje original si no coincide ningún patrón
}

// ════════════════════════════════════════════════════════════════
// GENERACIÓN DE PDF (jsPDF)
// ════════════════════════════════════════════════════════════════

/**
 * Generar PDF de la solicitud
 */
function generatePDF(tipo, formData, folio) {
    try {
        if (CONFIG.options.debug) {
            console.log('   Generando PDF...');
        }

        const { jsPDF } = window.jspdf;
        if (!jsPDF) {
            throw new Error('Librería jsPDF no cargada');
        }

        const doc = new jsPDF();
        const config = FORMS_CONFIG[tipo];
        const margin = 20;
        let yPosition = margin;

        // ─── ENCABEZADO ───
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text('CENTRO DE INVESTIGACIONES TROPICALES (CITRO)', 105, yPosition, { align: 'center' });
        yPosition += 6;

        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.text('Universidad Veracruzana', 105, yPosition, { align: 'center' });
        yPosition += 7;

        // Línea separadora
        doc.setDrawColor(0, 120, 212);
        doc.setLineWidth(0.7);
        doc.line(margin, yPosition, 210 - margin, yPosition);
        yPosition += 7;

        // Folio
        doc.setTextColor(0, 120, 212);
        doc.setFontSize(8);
        doc.setFont(undefined, 'bold');
        doc.text(`Folio: ${folio}`, 105, yPosition, { align: 'center' });
        yPosition += 9;

        // Título del trámite
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(13);
        doc.setFont(undefined, 'bold');
        const titleLines = doc.splitTextToSize((config.title || '').toUpperCase(), 170);
        titleLines.forEach(line => {
            doc.text(line, 105, yPosition, { align: 'center' });
            yPosition += 7;
        });

        // ─── FECHA Y LUGAR ───
        const meses = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];
        const today = new Date();
        const fechaStr = `Xalapa, Ver., ${today.getDate()} de ${meses[today.getMonth()]} de ${today.getFullYear()}`;

        yPosition += 4;
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.text(fechaStr, 190, yPosition, { align: 'right' });
        yPosition += 12;

        // ─── DESTINATARIO ───
        const destinatarios = [
            'H. Consejo Técnico',
            'Centro de Investigaciones Tropicales (CITRO)',
            'Universidad Veracruzana'
        ];
        destinatarios.forEach(dest => {
            doc.text(dest, margin, yPosition);
            yPosition += 5;
        });

        doc.setFont(undefined, 'bold');
        doc.text('Presente.', margin, yPosition);
        doc.setFont(undefined, 'normal');
        yPosition += 12;

        // ─── CUERPO ───
        const nombre = formData.nombre_completo || 
                      formData.nombre_estudiante || 
                      formData.nombre_solicitante || 
                      '[Nombre]';
        const matricula = formData.matricula || '[Matrícula]';

        const cuerpoTexto = `Por medio del presente, ${nombre}, con número de identificación ${matricula}, ` +
                          `me dirijo respetuosamente a este H. Consejo Técnico para solicitar el apoyo ` +
                          `correspondiente según los datos del documento con folio ${folio}.`;

        const cuerpoLines = doc.splitTextToSize(cuerpoTexto, 170);
        cuerpoLines.forEach(line => {
            doc.text(line, margin, yPosition);
            yPosition += 5.5;
        });
        yPosition += 8;

        // ─── RESUMEN ───
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text('RESUMEN DE LA SOLICITUD', margin, yPosition);
        yPosition += 7;

        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');

        let rowIndex = 0;
        Object.entries(formData).forEach(([key, value]) => {
            if (!value || value === '') return;

            // Nueva página si es necesario
            if (yPosition > 252) {
                doc.addPage();
                yPosition = margin;
            }

            // Alternar color de fondo
            if (rowIndex % 2 === 0) {
                doc.setFillColor(235, 243, 251);
                doc.rect(margin, yPosition - 3.5, 170, 6, 'F');
            }

            // Nombre del campo
            const fieldName = key.replace(/_/g, ' ').toUpperCase();
            doc.setFont(undefined, 'bold');
            doc.text(fieldName, margin + 1, yPosition);

            // Valor del campo (truncado si es muy largo)
            const fieldValue = String(value).substring(0, 80);
            doc.setFont(undefined, 'normal');
            doc.text(fieldValue, margin + 65, yPosition);

            yPosition += 6;
            rowIndex++;
        });

        // ─── FIRMA ───
        yPosition += 14;
        if (yPosition > 242) {
            doc.addPage();
            yPosition = margin;
        }

        doc.text('Atentamente,', margin, yPosition);
        yPosition += 20;

        // Línea de firma
        doc.line(margin, yPosition, margin + 60, yPosition);
        yPosition += 5;

        doc.setFont(undefined, 'bold');
        doc.text(nombre, margin, yPosition);
        yPosition += 5;

        doc.setFont(undefined, 'normal');
        doc.setFontSize(7);
        doc.text(matricula, margin, yPosition);

        // ─── PIE DE PÁGINA EN TODAS LAS PÁGINAS ───
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(7);
            doc.setTextColor(120, 120, 120);
            doc.text(
                `Folio: ${folio}  ·  ${fechaStr}  ·  CITRO / Universidad Veracruzana  ·  Microsoft 365`,
                105,
                287,
                { align: 'center' }
            );
        }

        const blob = doc.output('blob');
        
        if (CONFIG.options.debug) {
            console.log(`   ✅ PDF generado: ${(blob.size / 1024).toFixed(2)} KB, ${totalPages} página(s)`);
        }

        return blob;

    } catch (error) {
        console.error('❌ Error al generar PDF:', error);
        throw new Error(`No se pudo generar el PDF: ${error.message}`);
    }
}

// ════════════════════════════════════════════════════════════════
// PANTALLA DE ÉXITO
// ════════════════════════════════════════════════════════════════

/**
 * Mostrar pantalla de éxito
 */
function showSuccess() {
    const folioElement = document.getElementById('success-folio');
    const dateElement = document.getElementById('success-date');
    const typeElement = document.getElementById('success-type');

    if (folioElement) {
        folioElement.textContent = appState.folio;
    }

    if (dateElement) {
        dateElement.textContent = new Date().toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    if (typeElement) {
        typeElement.textContent = FORMS_CONFIG[appState.currentTramite]?.title || '';
    }

    showSection('success');
}

/**
 * Abrir PDF en SharePoint
 */
function openSharePoint() {
    const url = appState.lastPdfUrl || CONFIG.sharepoint.siteUrl;
    window.open(url, '_blank');
}

// ════════════════════════════════════════════════════════════════
// UTILIDADES
// ════════════════════════════════════════════════════════════════

/**
 * Generar folio único
 */
function generateFolio(tipo) {
    const prefixes = {
        'apoyo_academico': 'AAC',
        'aval_institucional': 'AVI',
        'apoyo_terceros': 'TER',
        'comite_tutorial': 'CMT',
        'solicitud_libre': 'LIB'
    };

    const prefix = prefixes[tipo] || 'DOC';
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const folio = `${prefix}-${year}${month}${day}-${hours}${minutes}${seconds}`;

    if (CONFIG.options.debug) {
        console.log('   Folio generado:', folio);
    }

    return folio;
}

/**
 * Resetear formulario y estado
 */
function resetForm() {
    appState.currentTramite = null;
    appState.formData = {};
    appState.folio = null;
    appState.lastPdfUrl = null;

    const formContainer = document.getElementById('dynamic-form');
    if (formContainer) {
        formContainer.innerHTML = '';
    }

    if (CONFIG.options.debug) {
        console.log('🔄 Formulario reseteado');
    }
}

// ════════════════════════════════════════════════════════════════
// LOG DE INICIALIZACIÓN
// ════════════════════════════════════════════════════════════════

if (CONFIG.options.debug) {
    console.log('📦 app-m365.js cargado');
    console.log('   Versión: 1.1 Optimizado');
}

/**
 * ═══════════════════════════════════════════════════════════════
 * CITRO — Integración con Outlook Calendar (OPTIMIZADO)
 * Microsoft Graph Calendar API
 * Exportación a Excel/CSV
 * Versión: 1.1 - Febrero 2026
 * ═══════════════════════════════════════════════════════════════
 */

// ════════════════════════════════════════════════════════════════
// AGREGAR EVENTO A OUTLOOK CALENDAR
// ════════════════════════════════════════════════════════════════

/**
 * Agregar solicitud al calendario de Outlook
 */
async function addToOutlookCalendar() {
    // Verificar autenticación
    if (!userState.isLoggedIn) {
        alert('⚠️ Debes iniciar sesión primero para agregar al calendario');
        return;
    }

    // Validar que hay datos de la solicitud
    if (!appState.formData || !appState.folio) {
        console.error('❌ No hay datos de solicitud para agregar al calendario');
        alert('Error: No hay información de la solicitud para crear el evento');
        return;
    }

    const { formData, currentTramite, folio } = appState;
    const config = FORMS_CONFIG[currentTramite];

    if (!config) {
        console.error('❌ Configuración de formulario no encontrada');
        return;
    }

    // Obtener fecha de inicio
    const fechaInicio = formData.fecha_inicio || 
                       formData.fecha_actividad || 
                       formData.fecha_evento;

    // Si no hay fecha, usar método manual
    if (!fechaInicio) {
        if (CONFIG.options.debug) {
            console.log('⚠️ No hay fecha en el formulario, usando método manual');
        }
        addToOutlookManual();
        return;
    }

    if (CONFIG.options.debug) {
        console.log('\n📅 Creando evento en Outlook Calendar...');
        console.log('   Folio:', folio);
        console.log('   Tipo:', config.title);
        console.log('   Fecha inicio:', fechaInicio);
    }

    showLoading(true);

    try {
        // Obtener token de acceso
        const token = await getAccessToken();

        // Fecha de fin (usar misma fecha si no hay fecha_fin)
        const fechaFin = formData.fecha_termino || 
                        formData.fecha_fin || 
                        fechaInicio;

        // Construir objeto de evento
        const event = {
            subject: `CITRO: ${config.title}`,
            body: {
                contentType: 'HTML',
                content: buildEventBody(formData, folio, currentTramite)
            },
            start: {
                dateTime: `${fechaInicio}T09:00:00`,
                timeZone: 'America/Mexico_City'
            },
            end: {
                dateTime: `${fechaFin}T18:00:00`,
                timeZone: 'America/Mexico_City'
            },
            location: {
                displayName: formData.destino || 
                           formData.lugar || 
                           'CITRO - Universidad Veracruzana, Xalapa, Ver.'
            },
            categories: ['CITRO', 'Solicitud', config.title],
            isReminderOn: true,
            reminderMinutesBeforeStart: 1440, // 24 horas antes
            importance: 'normal',
            sensitivity: 'normal'
        };

        if (CONFIG.options.debug) {
            console.log('   Evento:', event.subject);
            console.log('   Ubicación:', event.location.displayName);
            console.log('   Inicio:', event.start.dateTime);
            console.log('   Fin:', event.end.dateTime);
        }

        // Crear evento vía Graph API
        const response = await fetch('https://graph.microsoft.com/v1.0/me/events', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `Error ${response.status}`);
        }

        const createdEvent = await response.json();

        if (CONFIG.options.debug) {
            console.log('✅ Evento creado en Outlook Calendar');
            console.log('   ID:', createdEvent.id);
            console.log('   Link:', createdEvent.webLink);
        }

        // Actualizar botón para abrir el evento
        updateCalendarButton(createdEvent);

        // Mensaje de éxito
        showNotification('✅ Evento agregado a tu calendario de Outlook', 'success');

    } catch (error) {
        console.error('❌ Error al crear evento en Outlook:', error);

        if (CONFIG.options.debug) {
            console.log('   Intentando método manual como fallback...');
        }

        // Fallback a método manual
        addToOutlookManual();

    } finally {
        showLoading(false);
    }
}

/**
 * Actualizar botón de calendario después de crear evento
 */
function updateCalendarButton(event) {
    const button = document.querySelector('.btn-calendar-outlook');
    
    if (button) {
        button.textContent = '✅ Evento creado en Outlook';
        button.style.background = '#107C10';
        button.style.cursor = 'pointer';
        
        // Cambiar acción del botón para abrir el evento
        button.onclick = () => {
            if (event.webLink) {
                window.open(event.webLink, '_blank');
            }
        };
        
        // Agregar tooltip
        button.title = 'Click para abrir el evento en Outlook';
    }
}

/**
 * Construir HTML del cuerpo del evento
 */
function buildEventBody(formData, folio, tipo) {
    const tipoNombre = FORMS_CONFIG[tipo]?.title || tipo;
    const nombre = formData.nombre_completo || 
                  formData.nombre_estudiante || 
                  formData.nombre_solicitante || 
                  '—';
    
    const monto = formData.monto_total ? 
        `$${parseFloat(formData.monto_total).toLocaleString('es-MX')} MXN` : 
        'Sin monto especificado';

    // Construir filas adicionales según datos disponibles
    let extraRows = '';
    
    if (formData.titulo_actividad) {
        extraRows += `<tr><td><b>Actividad</b></td><td>${formData.titulo_actividad}</td></tr>`;
    }
    
    if (formData.destino) {
        extraRows += `<tr style="background:#F3F2F1"><td><b>Destino</b></td><td>${formData.destino}</td></tr>`;
    }
    
    if (formData.institucion_anfitriona) {
        extraRows += `<tr><td><b>Institución</b></td><td>${formData.institucion_anfitriona}</td></tr>`;
    }

    return `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px">
        <h3 style="color:#0078D4;margin:0 0 16px">Solicitud CITRO — ${tipoNombre}</h3>
        
        <table border="1" cellpadding="10" cellspacing="0" style="border-collapse:collapse;width:100%;font-size:14px;border:1px solid #EDEBE9">
            <tr style="background:#0078D4;color:white">
                <td colspan="2" style="padding:10px"><b>📋 Folio: ${folio}</b></td>
            </tr>
            <tr>
                <td style="width:35%;font-weight:600;background:#FAF9F8"><b>Tipo de Trámite</b></td>
                <td>${tipoNombre}</td>
            </tr>
            <tr style="background:#F3F2F1">
                <td style="font-weight:600"><b>Solicitante</b></td>
                <td>${nombre}</td>
            </tr>
            ${extraRows}
            <tr>
                <td style="font-weight:600;background:#FAF9F8"><b>Monto Solicitado</b></td>
                <td style="font-weight:700;color:#107C10">${monto}</td>
            </tr>
            <tr style="background:#FFF4CE">
                <td style="font-weight:600"><b>Estado Actual</b></td>
                <td><b>⏳ Pendiente de Revisión</b></td>
            </tr>
        </table>
        
        <p style="color:#605E5C;font-size:13px;margin-top:16px;line-height:1.6">
            <b>📌 Nota:</b> Este evento corresponde a una solicitud registrada en el sistema CITRO.<br>
            El H. Consejo Técnico revisará la solicitud en las próximas sesiones.
        </p>
        
        <hr style="border:none;border-top:1px solid #EDEBE9;margin:16px 0">
        
        <p style="color:#888;font-size:11px;margin:0">
            <b>${CONFIG.institucion.nombre}</b><br>
            ${CONFIG.institucion.universidad}<br>
            Generado automáticamente por Sistema CITRO · Microsoft 365
        </p>
    </div>`;
}

/**
 * Agregar a Outlook manualmente (método fallback)
 */
function addToOutlookManual() {
    const { formData, currentTramite, folio } = appState;
    const config = FORMS_CONFIG[currentTramite];

    if (!config) {
        console.error('❌ No hay configuración de formulario');
        return;
    }

    // Fecha de inicio (usar hoy si no hay)
    const fechaInicio = formData.fecha_inicio || 
                       formData.fecha_actividad || 
                       new Date().toISOString().split('T')[0];

    const fechaFin = formData.fecha_termino || 
                    formData.fecha_fin || 
                    fechaInicio;

    // Construir descripción
    const descripcion = `Folio: ${folio}\n` +
                       `Tipo: ${config.title}\n` +
                       `Solicitante: ${formData.nombre_completo || formData.nombre_estudiante || ''}\n` +
                       `Estado: Pendiente de Revisión\n\n` +
                       `Sistema CITRO - ${CONFIG.institucion.universidad}`;

    // URL de Outlook Calendar
    const url = 'https://outlook.office.com/calendar/0/deeplink/compose?' +
        `subject=${encodeURIComponent('CITRO: ' + config.title)}` +
        `&body=${encodeURIComponent(descripcion)}` +
        `&location=${encodeURIComponent(formData.destino || formData.lugar || 'CITRO - UV')}` +
        `&startdt=${fechaInicio}T09:00:00` +
        `&enddt=${fechaFin}T18:00:00`;

    if (CONFIG.options.debug) {
        console.log('📅 Abriendo Outlook Calendar (método manual)');
        console.log('   URL:', url);
    }

    // Abrir en nueva pestaña
    window.open(url, '_blank');

    // Mensaje informativo
    showNotification('📅 Abriendo Outlook Calendar. Revisa la nueva pestaña.', 'info');
}

// ════════════════════════════════════════════════════════════════
// EXPORTAR A EXCEL/CSV (SOLO ADMIN)
// ════════════════════════════════════════════════════════════════

/**
 * Exportar solicitudes a CSV/Excel
 */
async function exportToExcel() {
    // Verificar permisos de admin
    if (!userState.isAdmin) {
        alert('⛔ Solo administradores pueden exportar datos');
        return;
    }

    if (CONFIG.options.debug) {
        console.log('\n📊 Exportando solicitudes a CSV...');
    }

    showLoading(true);

    try {
        // Obtener todas las solicitudes
        const solicitudes = await getAllSolicitudes();

        if (!solicitudes || solicitudes.length === 0) {
            alert('⚠️ No hay solicitudes para exportar');
            return;
        }

        if (CONFIG.options.debug) {
            console.log(`   ${solicitudes.length} solicitud(es) para exportar`);
        }

        // Definir encabezados
        const headers = [
            'Folio',
            'Fecha Solicitud',
            'Tipo de Trámite',
            'Nombre Solicitante',
            'Email Solicitante',
            'Matrícula',
            'Monto Solicitado',
            'Estado',
            'Monto Autorizado',
            'Notas del CT',
            'URL PDF'
        ];

        // Mapear datos
        const rows = solicitudes.map(solicitud => [
            solicitud.Folio || '',
            solicitud.FechaSolicitud ? 
                new Date(solicitud.FechaSolicitud).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                }) : '',
            solicitud.TipoTramite || '',
            solicitud.NombreSolicitante || '',
            solicitud.EmailSolicitante || '',
            solicitud.Matricula || '',
            solicitud.MontoSolicitado || 0,
            solicitud.Estado || 'Pendiente',
            solicitud.MontoAutorizado || 0,
            solicitud.NotasCT || '',
            solicitud.URLPdf ? solicitud.URLPdf.Url || solicitud.URLPdf : ''
        ]);

        // Construir CSV
        const csvContent = [headers, ...rows]
            .map(row => 
                row.map(cell => {
                    // Escapar comillas y envolver en comillas
                    const cellStr = String(cell).replace(/"/g, '""');
                    return `"${cellStr}"`;
                }).join(',')
            )
            .join('\n');

        // BOM para UTF-8 (para Excel)
        const csvWithBOM = '\uFEFF' + csvContent;

        // Crear blob
        const blob = new Blob([csvWithBOM], { 
            type: 'text/csv;charset=utf-8;' 
        });

        // Generar nombre de archivo
        const fecha = new Date().toISOString().split('T')[0];
        const fileName = `CITRO_Solicitudes_${fecha}.csv`;

        // Descargar archivo
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Limpiar URL
        setTimeout(() => URL.revokeObjectURL(url), 100);

        if (CONFIG.options.debug) {
            console.log('✅ CSV exportado exitosamente');
            console.log('   Archivo:', fileName);
            console.log('   Registros:', solicitudes.length);
        }

        // Mensaje de éxito
        showNotification(
            `✅ ${solicitudes.length} solicitud(es) exportada(s) a ${fileName}`,
            'success'
        );

    } catch (error) {
        console.error('❌ Error al exportar:', error);
        
        alert(
            '❌ Error al exportar datos\n\n' +
            error.message + '\n\n' +
            'Verifica la consola (F12) para más detalles.'
        );

    } finally {
        showLoading(false);
    }
}

/**
 * Exportar solicitudes filtradas (para el panel de admin)
 */
async function exportFilteredData(filteredSolicitudes) {
    if (!userState.isAdmin) {
        return;
    }

    if (!filteredSolicitudes || filteredSolicitudes.length === 0) {
        alert('⚠️ No hay solicitudes filtradas para exportar');
        return;
    }

    if (CONFIG.options.debug) {
        console.log(`📊 Exportando ${filteredSolicitudes.length} solicitudes filtradas`);
    }

    showLoading(true);

    try {
        const headers = [
            'Folio',
            'Fecha',
            'Tipo',
            'Solicitante',
            'Email',
            'Estado',
            'Monto Solicitado',
            'Monto Autorizado'
        ];

        const rows = filteredSolicitudes.map(s => [
            s.Folio || '',
            s.FechaSolicitud ? new Date(s.FechaSolicitud).toLocaleDateString('es-MX') : '',
            s.TipoTramite || '',
            s.NombreSolicitante || '',
            s.EmailSolicitante || '',
            s.Estado || 'Pendiente',
            s.MontoSolicitado || 0,
            s.MontoAutorizado || 0
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const fileName = `CITRO_Filtrado_${new Date().toISOString().split('T')[0]}.csv`;

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();

        showNotification(`✅ ${filteredSolicitudes.length} solicitudes exportadas`, 'success');

    } catch (error) {
        console.error('Error al exportar:', error);
        alert('Error al exportar: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// ════════════════════════════════════════════════════════════════
// UTILIDADES
// ════════════════════════════════════════════════════════════════

/**
 * Mostrar notificación temporal
 */
function showNotification(message, type = 'info') {
    // Crear elemento de notificación si no existe
    let notification = document.getElementById('app-notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'app-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 6px;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(notification);
    }

    // Colores según tipo
    const colors = {
        success: { bg: '#DFF6DD', border: '#107C10', text: '#107C10' },
        error: { bg: '#FDE7D9', border: '#D83B01', text: '#D83B01' },
        warning: { bg: '#FFF4CE', border: '#FFB900', text: '#7A4F01' },
        info: { bg: '#EBF3FB', border: '#0078D4', text: '#0078D4' }
    };

    const color = colors[type] || colors.info;

    notification.style.background = color.bg;
    notification.style.border = `2px solid ${color.border}`;
    notification.style.color = color.text;
    notification.textContent = message;

    // Mostrar
    notification.style.opacity = '1';

    // Ocultar después de 4 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
    }, 4000);
}

// ════════════════════════════════════════════════════════════════
// LOG DE INICIALIZACIÓN
// ════════════════════════════════════════════════════════════════

if (CONFIG.options.debug) {
    console.log('📦 calendar-outlook.js cargado');
    console.log('   Versión: 1.1 Optimizado');
}

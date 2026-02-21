/**
 * ═══════════════════════════════════════════════════════════════
 * CITRO — Panel de Administración
 * Gestión de solicitudes para administradores
 * Universidad Veracruzana
 * ═══════════════════════════════════════════════════════════════
 */

// ════════════════════════════════════════════════════════════════
// PANEL DE ADMINISTRACIÓN
// ════════════════════════════════════════════════════════════════

/**
 * Ir al panel de administración
 */
async function goToAdminPanel() {
    // Verificar permisos
    if (!userState.isAdmin) {
        alert('⛔ No tienes permisos de administrador');
        goToHome();
        return;
    }

    if (CONFIG.options.debug) {
        console.log('👑 Cargando panel de administración...');
    }

    showSection('admin-panel');
    showLoading(true);

    try {
        // Cargar todas las solicitudes
        const solicitudes = await getAllSolicitudes();
        
        if (CONFIG.options.debug) {
            console.log(`✅ ${solicitudes.length} solicitudes cargadas`);
        }

        renderAdminPanel(solicitudes);

    } catch (error) {
        console.error('❌ Error al cargar panel admin:', error);
        alert('Error al cargar solicitudes:\n' + error.message);
    } finally {
        showLoading(false);
    }
}

/**
 * Renderizar panel de administración
 */
function renderAdminPanel(solicitudes) {
    const content = document.getElementById('admin-panel-content');
    
    if (!content) {
        console.error('❌ Elemento admin-panel-content no encontrado');
        return;
    }

    // Estadísticas
    const pendientes = solicitudes.filter(s => s.Estado === 'Pendiente').length;
    const aprobadas = solicitudes.filter(s => s.Estado === 'Aprobado').length;
    const rechazadas = solicitudes.filter(s => s.Estado === 'Rechazado').length;

    let html = `
        <div style="margin-bottom: 24px;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
                <div style="background: #FFF4CE; padding: 20px; border-radius: 8px; border-left: 4px solid #FFB900;">
                    <div style="font-size: 32px; font-weight: 700; color: #7A4F01;">${pendientes}</div>
                    <div style="color: #605E5C;">Pendientes</div>
                </div>
                <div style="background: #DFF6DD; padding: 20px; border-radius: 8px; border-left: 4px solid #107C10;">
                    <div style="font-size: 32px; font-weight: 700; color: #107C10;">${aprobadas}</div>
                    <div style="color: #605E5C;">Aprobadas</div>
                </div>
                <div style="background: #FDE7D9; padding: 20px; border-radius: 8px; border-left: 4px solid #D83B01;">
                    <div style="font-size: 32px; font-weight: 700; color: #D83B01;">${rechazadas}</div>
                    <div style="color: #605E5C;">Rechazadas</div>
                </div>
                <div style="background: #EBF3FB; padding: 20px; border-radius: 8px; border-left: 4px solid #0078D4;">
                    <div style="font-size: 32px; font-weight: 700; color: #0078D4;">${solicitudes.length}</div>
                    <div style="color: #605E5C;">Total</div>
                </div>
            </div>

            <div style="margin-bottom: 16px; display: flex; gap: 12px; align-items: center;">
                <button onclick="exportToExcel()" class="btn btn-primary" style="display: flex; align-items: center; gap: 8px;">
                    📊 Exportar a Excel
                </button>
                <button onclick="goToHome()" class="btn btn-secondary">
                    ← Volver al Inicio
                </button>
            </div>
        </div>

        <div style="background: white; border: 1px solid #EDEBE9; border-radius: 8px; overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <thead>
                    <tr style="background: #F3F2F1; border-bottom: 2px solid #EDEBE9;">
                        <th style="padding: 12px; text-align: left; font-weight: 600;">Folio</th>
                        <th style="padding: 12px; text-align: left; font-weight: 600;">Fecha</th>
                        <th style="padding: 12px; text-align: left; font-weight: 600;">Tipo</th>
                        <th style="padding: 12px; text-align: left; font-weight: 600;">Solicitante</th>
                        <th style="padding: 12px; text-align: left; font-weight: 600;">Monto</th>
                        <th style="padding: 12px; text-align: left; font-weight: 600;">Estado</th>
                        <th style="padding: 12px; text-align: center; font-weight: 600;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
    `;

    if (solicitudes.length === 0) {
        html += `
            <tr>
                <td colspan="7" style="padding: 40px; text-align: center; color: #605E5C;">
                    No hay solicitudes registradas
                </td>
            </tr>
        `;
    } else {
        solicitudes.forEach((solicitud, index) => {
            const fecha = solicitud.FechaSolicitud ? 
                new Date(solicitud.FechaSolicitud).toLocaleDateString('es-MX') : '—';
            
            const monto = solicitud.MontoSolicitado ? 
                `$${parseFloat(solicitud.MontoSolicitado).toLocaleString('es-MX')}` : '—';

            const estadoColor = {
                'Pendiente': 'background: #FFF4CE; color: #7A4F01;',
                'Aprobado': 'background: #DFF6DD; color: #107C10;',
                'Rechazado': 'background: #FDE7D9; color: #D83B01;'
            }[solicitud.Estado] || '';

            html += `
                <tr style="border-bottom: 1px solid #EDEBE9; ${index % 2 === 0 ? 'background: #FAF9F8;' : ''}">
                    <td style="padding: 12px; font-family: monospace; font-weight: 600; color: #0078D4;">
                        ${solicitud.Folio || '—'}
                    </td>
                    <td style="padding: 12px;">${fecha}</td>
                    <td style="padding: 12px;">${solicitud.TipoTramite || '—'}</td>
                    <td style="padding: 12px;">${solicitud.NombreSolicitante || '—'}</td>
                    <td style="padding: 12px; font-weight: 600;">${monto}</td>
                    <td style="padding: 12px;">
                        <span style="padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; ${estadoColor}">
                            ${solicitud.Estado || 'Pendiente'}
                        </span>
                    </td>
                    <td style="padding: 12px; text-align: center;">
                        ${solicitud.URLPdf ? 
                            `<a href="${solicitud.URLPdf}" target="_blank" style="color: #0078D4; text-decoration: none; margin-right: 8px;">📄 Ver PDF</a>` : 
                            ''
                        }
                    </td>
                </tr>
            `;
        });
    }

    html += `
                </tbody>
            </table>
        </div>
    `;

    content.innerHTML = html;
}

// ════════════════════════════════════════════════════════════════
// MIS SOLICITUDES
// ════════════════════════════════════════════════════════════════

/**
 * Ir a "Mis Solicitudes"
 */
async function goToMisSolicitudes() {
    if (!userState.isLoggedIn) {
        alert('⚠️ Debes iniciar sesión primero');
        signInWithMicrosoft();
        return;
    }

    if (CONFIG.options.debug) {
        console.log('📋 Cargando mis solicitudes...');
    }

    showSection('mis-solicitudes');
    showLoading(true);

    try {
        const solicitudes = await getSolicitudesUsuario();
        
        if (CONFIG.options.debug) {
            console.log(`✅ ${solicitudes.length} solicitudes cargadas`);
        }

        renderMisSolicitudes(solicitudes);

    } catch (error) {
        console.error('❌ Error al cargar solicitudes:', error);
        alert('Error al cargar tus solicitudes:\n' + error.message);
    } finally {
        showLoading(false);
    }
}

/**
 * Renderizar "Mis Solicitudes"
 */
function renderMisSolicitudes(solicitudes) {
    const content = document.getElementById('mis-solicitudes-content');
    
    if (!content) {
        console.error('❌ Elemento mis-solicitudes-content no encontrado');
        return;
    }

    let html = `
        <div style="margin-bottom: 24px;">
            <p style="color: #605E5C;">Has enviado <strong>${solicitudes.length}</strong> solicitud(es) al Consejo Técnico.</p>
        </div>
    `;

    if (solicitudes.length === 0) {
        html += `
            <div style="background: #EBF3FB; border-left: 4px solid #0078D4; padding: 24px; border-radius: 0 8px 8px 0;">
                <p style="margin: 0; color: #323130;">
                    No has enviado ninguna solicitud aún.
                </p>
                <button onclick="goToHome()" class="btn btn-primary" style="margin-top: 16px;">
                    📝 Crear Nueva Solicitud
                </button>
            </div>
        `;
    } else {
        html += `<div style="display: grid; gap: 16px;">`;

        solicitudes.forEach(solicitud => {
            const fecha = solicitud.FechaSolicitud ? 
                new Date(solicitud.FechaSolicitud).toLocaleDateString('es-MX', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                }) : '—';

            const monto = solicitud.MontoSolicitado ? 
                `$${parseFloat(solicitud.MontoSolicitado).toLocaleString('es-MX')} MXN` : null;

            const estadoColor = {
                'Pendiente': '#FFB900',
                'Aprobado': '#107C10',
                'Rechazado': '#D83B01'
            }[solicitud.Estado] || '#605E5C';

            html += `
                <div style="background: white; border: 1px solid #EDEBE9; border-radius: 8px; padding: 24px;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
                        <div>
                            <h3 style="margin: 0 0 8px; font-size: 18px; color: #323130;">
                                ${solicitud.TipoTramite || 'Solicitud'}
                            </h3>
                            <p style="margin: 0; color: #605E5C; font-size: 14px;">
                                Folio: <strong style="color: #0078D4; font-family: monospace;">${solicitud.Folio}</strong>
                            </p>
                        </div>
                        <span style="padding: 6px 16px; border-radius: 16px; font-size: 13px; font-weight: 600; background: ${estadoColor}15; color: ${estadoColor};">
                            ${solicitud.Estado || 'Pendiente'}
                        </span>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 16px; font-size: 14px;">
                        <div>
                            <div style="color: #605E5C; font-size: 12px; margin-bottom: 4px;">Fecha de Solicitud</div>
                            <div style="font-weight: 600;">${fecha}</div>
                        </div>
                        ${monto ? `
                        <div>
                            <div style="color: #605E5C; font-size: 12px; margin-bottom: 4px;">Monto Solicitado</div>
                            <div style="font-weight: 600; color: #107C10;">${monto}</div>
                        </div>
                        ` : ''}
                    </div>

                    ${solicitud.URLPdf ? `
                    <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #EDEBE9;">
                        <a href="${solicitud.URLPdf}" target="_blank" class="btn btn-secondary" style="display: inline-block; text-decoration: none;">
                            📄 Ver Documento
                        </a>
                    </div>
                    ` : ''}
                </div>
            `;
        });

        html += `</div>`;
    }

    content.innerHTML = html;
}

// ════════════════════════════════════════════════════════════════
// LOG DE INICIALIZACIÓN
// ════════════════════════════════════════════════════════════════

if (CONFIG?.options?.debug) {
    console.log('📦 admin-m365.js cargado');
}

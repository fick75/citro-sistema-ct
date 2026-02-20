[README.md](https://github.com/user-attachments/files/25453081/README.md)
# 🎓 CITRO — Sistema de Gestión Académica Digital
## Universidad Veracruzana | Microsoft 365

<div align="center">

![Version](https://img.shields.io/badge/version-1.0-blue.svg)
![Microsoft 365](https://img.shields.io/badge/Microsoft_365-Integrado-0078D4.svg)
![SharePoint](https://img.shields.io/badge/SharePoint-Online-217346.svg)
![License](https://img.shields.io/badge/license-UV_Internal-green.svg)

**Sistema completo de gestión de solicitudes académicas**  
**Integrado nativamente con Microsoft 365**

[📘 Guía de Instalación](#-instalación) • [📊 Flujos de Trabajo](FLUJOS_TRABAJO.md) • [🔧 Soporte](#-soporte)

</div>

---

## 🎯 QUÉ ES ESTE SISTEMA

Sistema web para gestionar solicitudes académicas del **Centro de Investigaciones Tropicales (CITRO)** de la **Universidad Veracruzana**, completamente integrado con el ecosistema Microsoft 365 de la institución.

### ✨ Características Principales

- ✅ **5 Tipos de Formularios** configurables
- ✅ **Autenticación institucional** con Azure AD (@uv.mx)
- ✅ **Almacenamiento en SharePoint** (CtTramites2026)
- ✅ **Generación automática de PDFs** profesionales
- ✅ **Notificaciones por Outlook** con templates HTML
- ✅ **Calendario Outlook** integrado
- ✅ **Panel de administración** con estadísticas en tiempo real
- ✅ **Gestión de presupuesto** autorizado por el Consejo Técnico
- ✅ **Exportación a Excel/CSV** para reportes
- ✅ **100% responsive** (móvil, tablet, desktop)
- ✅ **Diseño Fluent UI** (look & feel Microsoft)

---

## 📦 CONTENIDO DEL PAQUETE

```
CITRO_M365_OPTIMIZADO/
│
├── 📁 frontend/                      ← Archivos para hosting
│   ├── index.html                   Interfaz principal
│   ├── config-m365.js               ⚙️ CONFIGURACIÓN (editar primero)
│   ├── auth-msal.js                 Autenticación Azure AD
│   ├── sharepoint.js                Integración SharePoint
│   ├── app-m365.js                  Lógica y generación PDF
│   ├── admin-m365.js                Panel de administración
│   ├── calendar-outlook.js          Calendario + Exportación
│   ├── forms-data.js                Definición de 5 formularios
│   └── styles.css                   Diseño Fluent UI
│
├── 📄 Setup-SharePoint-UV.ps1       Script PowerShell automático
├── 📘 GUIA_INSTALACION_UV.md       Guía paso a paso (45-60 min)
├── 📊 FLUJOS_TRABAJO.md            Flujos operativos detallados
└── 📋 README.md                    Este archivo

Total: 10 archivos | ~150 KB
```

---

## 🚀 INSTALACIÓN

### Resumen (4 Pasos — 45-60 minutos)

| # | Paso | Tiempo | Herramienta |
|---|------|--------|-------------|
| 1️⃣ | Configurar SharePoint | 15 min | PowerShell |
| 2️⃣ | Registrar App en Azure AD | 10 min | portal.azure.com |
| 3️⃣ | Editar configuración | 5 min | Editor de texto |
| 4️⃣ | Hospedar frontend | 15-20 min | GitHub/Servidor/SharePoint |

### 📘 Guía Completa

Ver: **[GUIA_INSTALACION_UV.md](GUIA_INSTALACION_UV.md)** para instrucciones paso a paso con:
- ✅ Prerequisites detallados
- ✅ Comandos exactos de PowerShell
- ✅ Screenshots de Azure Portal
- ✅ 3 opciones de hosting
- ✅ Troubleshooting completo
- ✅ Checklist de verificación

---

## 🏗️ ARQUITECTURA

```
┌─────────────┐
│   Usuario   │ Login @uv.mx
│   @uv.mx    │────────────────┐
└─────────────┘                 │
                                ▼
┌──────────────────────────────────────────┐
│      Frontend (HTML/JS/CSS)              │
│  • 5 Formularios dinámicos               │
│  • Generación PDF (jsPDF)                │
│  • Autenticación (MSAL 2.x)              │
│  GitHub Pages / Servidor UV / SharePoint │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│      Azure Active Directory              │
│  • SSO institucional                     │
│  • OAuth 2.0                             │
│  • Permisos delegados                    │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│      Microsoft Graph API                 │
│  • /me - Perfil                          │
│  • /sites/.../lists - SharePoint         │
│  • /sites/.../drive - Upload PDFs        │
│  • /me/sendMail - Emails                 │
│  • /me/events - Calendario               │
└──────┬───────────────────────┬───────────┘
       │                       │
       ▼                       ▼
┌─────────────────┐   ┌─────────────────┐
│   SharePoint    │   │ Exchange Online │
│ CtTramites2026  │   │                 │
│ • Lista         │   │ • Outlook Mail  │
│ • Biblioteca    │   │ • Calendar      │
└─────────────────┘   └─────────────────┘
```

**Site SharePoint específico:**
```
https://uvmx.sharepoint.com/sites/CtTramites2026
```

---

## 📋 FORMULARIOS DISPONIBLES

| # | Nombre | Campos | Para qué |
|---|--------|--------|----------|
| 1️⃣ | **Apoyo Académico** | 13 | Viáticos, congresos, estancias |
| 2️⃣ | **Aval Institucional** | 11 | Respaldo oficial para eventos |
| 3️⃣ | **Apoyo a Terceros** | 16 | Invitados, colaboradores externos |
| 4️⃣ | **Comité Tutorial** | 16 | Conformación de comités posgrado |
| 5️⃣ | **Solicitud Libre** | 12 | Trámites no contemplados |

**Todos los formularios generan:**
- ✅ PDF automático con formato institucional
- ✅ Folio único (ej: `AAC-20260219-143022`)
- ✅ Registro en SharePoint
- ✅ Email de confirmación
- ✅ Notificación al Consejo Técnico

---

## 👥 ROLES Y PERMISOS

### 👤 Usuario Normal
- ✅ Login con @uv.mx
- ✅ Enviar solicitudes (5 tipos)
- ✅ Ver solo sus propias solicitudes
- ✅ Agregar a Outlook Calendar
- ✅ Descargar PDFs
- ❌ No puede ver solicitudes de otros
- ❌ No puede cambiar estados

### 👑 Administrador
**Todo lo de Usuario Normal +**
- ✅ Ver todas las solicitudes
- ✅ Dashboard con estadísticas:
  - 💰 Total Autorizado
  - 📋 Total Solicitudes
  - ⏳ Pendientes
  - ✅ Aprobadas
- ✅ Editar estados de solicitudes
- ✅ Asignar montos autorizados
- ✅ Agregar notas del Consejo Técnico
- ✅ Filtrar y buscar en todas las solicitudes
- ✅ Exportar reportes a Excel
- ✅ Notificar usuarios por email

**Configurar admins en:** `frontend/config-m365.js`

```javascript
admins: [
    'director.citro@uv.mx',
    'secretario.ct@uv.mx'
]
```

---

## 🔄 FLUJO OPERATIVO

### 1. Usuario envía solicitud

```
Login → Selecciona tipo → Llena formulario → Envía
    ↓
Sistema procesa (5-15 segundos):
    ├─ Genera PDF
    ├─ Sube a SharePoint
    ├─ Crea registro en lista
    ├─ Email al usuario
    └─ Email al CT
    ↓
Usuario ve confirmación + opción calendario
```

### 2. Admin revisa y aprueba

```
Login → Panel Admin → Ver solicitud → Editar
    ↓
Cambiar estado: Aprobado
Asignar monto: $12,000
Agregar notas del CT
Marcar: Notificar al usuario
    ↓
Guardar → SharePoint actualizado → Email enviado
```

### 3. Usuario consulta resultado

```
Login → Mis Solicitudes → Ver estado actualizado
    ↓
✅ Aprobado | $12,000 autorizado | Notas del CT
```

📊 **Ver diagramas detallados:** [FLUJOS_TRABAJO.md](FLUJOS_TRABAJO.md)

---

## 🔐 SEGURIDAD

### Autenticación
- ✅ **Azure AD** (SSO institucional)
- ✅ **OAuth 2.0** con MSAL 2.x
- ✅ **Tokens seguros** en sessionStorage
- ✅ **Renovación automática** de tokens
- ✅ **Logout completo** con revocación

### Autorización
- ✅ **Permisos delegados** (no de aplicación)
- ✅ **Filtrado por email** (usuarios ven solo lo suyo)
- ✅ **Validación de admin** en cada operación
- ✅ **HTTPS obligatorio** (requerido por Azure)

### Datos
- ✅ **Almacenamiento SharePoint** (centro de datos Microsoft)
- ✅ **Backups automáticos** de Microsoft 365
- ✅ **Auditoría completa** (Azure AD logs, SharePoint versioning)
- ✅ **Cumplimiento GDPR** (infraestructura Microsoft)

---

## 📊 REPORTES Y ANÁLISIS

### Exportación

```
Panel Admin → Exportar a Excel
    ↓
Descarga: CITRO_YYYYMMDD.csv con:
    - Folio, Fecha, Tipo
    - Nombre, Email, Matrícula
    - Montos (solicitado/autorizado)
    - Estado, Notas CT
```

### Análisis en Excel

```excel
1. Abrir CSV en Excel
2. Insertar → Tabla Dinámica
3. Analizar por:
   - Tipo de trámite
   - Estado
   - Presupuesto
   - Tiempo de respuesta
```

### Conexión Power BI

```
1. Power BI Desktop → Obtener datos → SharePoint Online List
2. Conectar a: https://uvmx.sharepoint.com/sites/CtTramites2026
3. Seleccionar: SolicitudesCITRO
4. Crear dashboards interactivos
```

---

## ⚙️ CONFIGURACIÓN

### Archivo principal: `frontend/config-m365.js`

```javascript
const CONFIG = {
    // Azure AD (del portal.azure.com)
    azure: {
        clientId: 'TU_CLIENT_ID',  // ⚠️ EDITAR
        tenantId: 'TU_TENANT_ID',  // ⚠️ EDITAR
    },
    
    // SharePoint Universidad Veracruzana
    sharepoint: {
        siteUrl: 'https://uvmx.sharepoint.com/sites/CtTramites2026',  // ✅ Pre-configurado
        tenant: 'uvmx',  // ✅ Pre-configurado
    },
    
    // Administradores
    admins: [
        'tu-email@uv.mx'  // ⚠️ EDITAR
    ],
    
    // Email del Consejo Técnico
    email: {
        adminEmail: 'consejo.tecnico.citro@uv.mx'  // ⚠️ EDITAR
    }
};
```

### Opciones Avanzadas

Ver todas las opciones en `config-m365.js`:
- ✅ Validación de dominio (@uv.mx only)
- ✅ Plazo mínimo de solicitudes
- ✅ Montos máximos
- ✅ Modo debug
- ✅ Cache duration

---

## 🛠️ REQUISITOS TÉCNICOS

### Para Instalación

| Software | Versión | Uso |
|----------|---------|-----|
| PowerShell | 7+ | Configurar SharePoint |
| Navegador moderno | Chrome/Edge/Firefox | Acceso al sistema |
| Cuenta @uv.mx | M365 | Autenticación |

### Para Desarrollo

| Herramienta | Opcional | Uso |
|-------------|----------|-----|
| VS Code | Sí | Editar código |
| Git | Sí | Control de versiones |
| Node.js | No | No se requiere |

**Nota:** Sistema 100% frontend, sin backend adicional.

---

## 🔧 MANTENIMIENTO

### Tareas Periódicas

**Semanal:**
- ✅ Exportar backup (CSV)
- ✅ Revisar solicitudes pendientes

**Mensual:**
- ✅ Revisar estadísticas
- ✅ Actualizar lista de admins si cambió
- ✅ Verificar uso de almacenamiento SharePoint

**Anual:**
- ✅ Audit de seguridad
- ✅ Revisar políticas de retención
- ✅ Actualizar documentación

---

## 📞 SOPORTE

### CITRO — Universidad Veracruzana

**Contacto:**
- 📧 Email: citro@uv.mx
- 📞 Teléfono: 228-842-1800
- 🌐 Web: https://www.uv.mx/citro
- 📍 Dirección: Xalapa, Veracruz, México

### Problemas Técnicos

**Azure AD / SharePoint:**
- Contactar al área de TI de la UV
- Solicitar soporte para "Aplicación web en Azure AD"

**Sistema CITRO:**
- Revisar: [GUIA_INSTALACION_UV.md](GUIA_INSTALACION_UV.md) → Sección "Solución de Problemas"
- Abrir F12 → Console para ver errores
- Verificar permisos en SharePoint

### Recursos Microsoft

- 📘 [Microsoft Graph API Docs](https://docs.microsoft.com/graph)
- 📘 [SharePoint Online Docs](https://docs.microsoft.com/sharepoint)
- 📘 [MSAL.js Documentation](https://docs.microsoft.com/azure/active-directory/develop/msal-overview)
- 📘 [Azure AD App Registration](https://docs.microsoft.com/azure/active-directory/develop/quickstart-register-app)

---

## 📝 CHANGELOG

### v1.0 (Febrero 2026)
- ✅ 5 formularios completos
- ✅ Autenticación Azure AD
- ✅ Integración SharePoint (uvmx.sharepoint.com/sites/CtTramites2026)
- ✅ Panel de administración
- ✅ Gestión de presupuesto
- ✅ Outlook Calendar
- ✅ Emails HTML con Fluent UI
- ✅ Exportación CSV
- ✅ Diseño responsive
- ✅ Optimizado para UV

---

## 📄 LICENCIA

**Uso Interno — Universidad Veracruzana**

Este sistema fue desarrollado específicamente para el **Centro de Investigaciones Tropicales (CITRO)** de la **Universidad Veracruzana**.

- ✅ Uso permitido: Institucional (UV)
- ❌ Redistribución: No permitida
- ❌ Uso comercial: No permitido
- ✅ Modificaciones: Permitidas para uso interno UV

---

## 🙏 CRÉDITOS

**Desarrollado para:**
- Centro de Investigaciones Tropicales (CITRO)
- Universidad Veracruzana

**Tecnologías:**
- Microsoft 365 (SharePoint, Azure AD, Outlook)
- Microsoft Graph API
- MSAL.js 2.x
- jsPDF
- Fluent UI Design System

**Versión:** 1.0  
**Fecha:** Febrero 2026  
**Microsoft 365 Integration**

---

<div align="center">

**¿Listo para instalar?**  
👉 Comienza con: [GUIA_INSTALACION_UV.md](GUIA_INSTALACION_UV.md)

---

**Centro de Investigaciones Tropicales (CITRO)**  
**Universidad Veracruzana**  
🌐 https://www.uv.mx/citro

</div>

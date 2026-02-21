Términos y Condiciones de Uso
Sistema de Gestión de Solicitudes CITRO
Última actualización: Febrero 2026
Universidad Veracruzana
Centro de Investigaciones Tropicales (CITRO)
1. Aceptación de los Términos
Al acceder y utilizar el Sistema de Gestión de Solicitudes CITRO, usted acepta estos Términos y Condiciones en su totalidad.

📞 Contacto
Centro de Investigaciones Tropicales (CITRO)
Universidad Veracruzana
Email: ctecnicocitro@uv.mx
Teléfono: 228-842-1800




# 🎓 SISTEMA CITRO M365

Sistema de Gestión de Solicitudes para el H. Consejo Técnico del Centro de Investigaciones Tropicales (CITRO), Universidad Veracruzana.

---

## 📦 ARCHIVOS DEL SISTEMA

```
citro-sistema-ct/
├── index.html              ← Interfaz principal
├── config-m365.js          ← Configuración y credenciales Azure
├── forms-data.js           ← Definición de 5 formularios
├── auth-msal.js            ← Autenticación Microsoft (MSAL)
├── sharepoint.js           ← API SharePoint Lists + OneDrive
├── app-m365.js             ← Lógica principal del sistema
├── admin-m365.js           ← Panel de administración
├── calendar-outlook.js     ← Integración Outlook Calendar
├── .nojekyll               ← Configuración GitHub Pages
└── README.md               ← Este archivo
```

---

## 🚀 INSTALACIÓN

### Paso 1: Clonar repositorio

```bash
git clone https://github.com/fick75/citro-sistema-ct.git
cd citro-sistema-ct
```

### Paso 2: Verificar archivos

```bash
ls -la
# Debes ver todos los archivos .js listados arriba
```

### Paso 3: Configurar GitHub Pages

1. Ir a: https://github.com/fick75/citro-sistema-ct/settings/pages
2. Source: **Deploy from a branch**
3. Branch: **main**
4. Folder: **/ (root)**
5. Click **Save**

### Paso 4: Esperar deployment (2-3 minutos)

### Paso 5: Abrir sitio

```
https://fick75.github.io/citro-sistema-ct/
```

---

## ✅ VERIFICACIÓN

### En el navegador:

1. Abrir: https://fick75.github.io/citro-sistema-ct/
2. Presionar **F12** → Console
3. Ejecutar:
   ```javascript
   typeof CONFIG
   ```
4. Debe mostrar: `"object"` ✅

---

## 🔐 CONFIGURACIÓN AZURE AD

### IDs configurados:

- **Client ID:** `0681dda0-70f4-4038-b901-d41ee738cc2`
- **Tenant ID:** `3c907651-d8c6-4ca6-a8a4-6a242430e653`
- **Dominio:** Universidad Veracruzana (@uv.mx)

### Permisos requeridos:

- ✅ User.Read
- ✅ Sites.ReadWrite.All (SharePoint Lists)
- ✅ Files.ReadWrite (OneDrive)
- ✅ Calendars.ReadWrite
- ✅ Mail.Send

---

## 📋 CARACTERÍSTICAS

### Formularios disponibles:

1. **Apoyo Académico** - Solicitud de apoyo para congresos, viajes
2. **Aval Institucional** - Respaldo oficial del CITRO
3. **Apoyo a Terceros** - Apoyo para colaboradores externos
4. **Comité Tutorial** - Modificación de comité (posgrado)
5. **Solicitud Libre** - Trámites no contemplados

### Funcionalidades:

- ✅ Autenticación Microsoft (@uv.mx)
- ✅ Generación automática de PDFs
- ✅ Almacenamiento en SharePoint Lists (datos)
- ✅ Almacenamiento en OneDrive (PDFs)
- ✅ Emails automáticos de confirmación
- ✅ Integración con Outlook Calendar
- ✅ Panel de administración
- ✅ "Mis Solicitudes" para usuarios
- ✅ Exportación a Excel/CSV

---

## 👥 USUARIOS

### Administradores configurados:

- clopez@uv.mx
- rmenchaca@uv.mx
- carlolopezo@uv.mx

### Usuarios regulares:

Cualquier usuario con email @uv.mx puede:
- Enviar solicitudes
- Ver sus propias solicitudes
- Descargar PDFs
- Agregar eventos a calendario

---

## 🔧 DESARROLLO

### Activar modo debug:

En `config-m365.js`:
```javascript
options: {
    debug: true  // Ver logs detallados en consola
}
```

### Logs en consola:

Con debug activado verás:
```
✅ Configuración validada
📋 Client ID: 0681dda0...
🚀 Iniciando envío de solicitud...
📄 [1/5] Generando PDF...
✅ PDF generado: 87.45 KB
📤 [2/5] Subiendo PDF a OneDrive...
✅ PDF subido exitosamente
```

---

## 📊 ARQUITECTURA

```
┌─────────────────────────────────────────┐
│  FRONTEND (Vercel/GitHub Pages)         │
│  HTML + JavaScript                      │
├─────────────────────────────────────────┤
│                                         │
│  📋 SharePoint Lists                    │
│     └─ Datos estructurados              │
│                                         │
│  📁 OneDrive                            │
│     └─ PDFs organizados                 │
│                                         │
│  📧 Microsoft Graph API                 │
│     └─ Emails y calendario              │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🐛 TROUBLESHOOTING

### Error: "CONFIG is not defined"

**Solución:** Verificar orden de scripts en index.html

### Error: "No se pudo conectar con SharePoint"

**Solución:** Ejecutar script `Setup-SharePoint-UV.ps1`

### Error: "No tienes permisos"

**Solución:** Verificar permisos en Azure AD

---

## 📞 SOPORTE

**Centro de Investigaciones Tropicales (CITRO)**  
Universidad Veracruzana  
Email: ctecnicocitro@uv.mx  
Tel: 228-842-1800

---

## 📄 LICENCIA

Sistema desarrollado para uso exclusivo de la Universidad Veracruzana - CITRO.

---

## 🎯 VERSIÓN

**v1.2 Híbrida** - Febrero 2026  
Sistema optimizado con SharePoint Lists + OneDrive

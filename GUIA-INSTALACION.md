# 📦 PAQUETE COMPLETO - SISTEMA CITRO M365

## ✅ ARCHIVOS INCLUIDOS (9 ARCHIVOS)

### 1. **index.html** ✅
Interfaz principal del sistema con todos los elementos necesarios

### 2. **config-m365.js** ✅
Configuración con IDs de Azure correctos para Universidad Veracruzana

### 3. **forms-data.js** ✅
Definición completa de los 5 formularios del sistema

### 4. **auth-msal.js** ✅
Autenticación Microsoft con validación de dominio @uv.mx

### 5. **sharepoint.js** ✅
Versión híbrida: SharePoint Lists + OneDrive para PDFs

### 6. **app-m365.js** ✅
Lógica principal optimizada con validaciones completas

### 7. **admin-m365.js** ✅
Panel de administración y "Mis Solicitudes"

### 8. **calendar-outlook.js** ✅
Integración con Outlook Calendar y exportación Excel

### 9. **.nojekyll** ✅
Configuración para GitHub Pages

### 10. **README.md** ✅
Documentación del sistema

---

## 🚀 INSTALACIÓN EN 3 PASOS

### PASO 1: Descargar todos los archivos

**Descarga los 10 archivos de arriba**

Verifica que tengas:
```
□ index.html
□ config-m365.js
□ forms-data.js
□ auth-msal.js
□ sharepoint.js
□ app-m365.js
□ admin-m365.js
□ calendar-outlook.js
□ .nojekyll
□ README.md
```

---

### PASO 2: Subir a GitHub

#### Opción A: GitHub.com (MÁS FÁCIL)

1. **Ir a:** https://github.com/fick75/citro-sistema-ct

2. **Si el repositorio tiene archivos viejos:**
   - Click en cada archivo viejo
   - Click en 🗑️ (eliminar)
   - Commit

3. **Subir archivos nuevos:**
   - Click "Add file" → "Upload files"
   - **Arrastrar los 10 archivos** a la vez
   - Commit message: "Complete CITRO system v1.2"
   - Click "Commit changes"

#### Opción B: Terminal/Git

```bash
# 1. Clonar tu repo
git clone https://github.com/fick75/citro-sistema-ct.git
cd citro-sistema-ct

# 2. Limpiar archivos viejos (si hay)
rm -rf *
rm -rf .*  # Solo si quieres eliminar .git también

# 3. Copiar todos los archivos descargados aquí
# (Arrastrar los 10 archivos a esta carpeta)

# 4. Verificar
ls -la
# Debes ver los 10 archivos

# 5. Subir
git add .
git commit -m "Complete CITRO system v1.2"
git push

# Si da error, fuerza el push:
git push -f origin main
```

---

### PASO 3: Configurar GitHub Pages

1. **Ir a:** https://github.com/fick75/citro-sistema-ct/settings/pages

2. **Configurar:**
   - Source: **Deploy from a branch**
   - Branch: **main** (o master)
   - Folder: **/ (root)**

3. **Click "Save"**

4. **Esperar 2-3 minutos**

5. **Abrir sitio:** https://fick75.github.io/citro-sistema-ct/

---

## ✅ VERIFICACIÓN

### 1. En GitHub

**Ir a:** https://github.com/fick75/citro-sistema-ct

**¿Ves los 10 archivos?**
- ✅ Sí → Continuar
- ❌ No → Verificar que se subieron

### 2. Probar acceso a archivos

**Abrir en navegador:**
```
https://fick75.github.io/citro-sistema-ct/config-m365.js
```

**¿Ves el código JavaScript?**
- ✅ Sí → Archivos están públicos
- ❌ 404 → Esperar más tiempo o verificar GitHub Pages

### 3. Probar el sitio

**Abrir:** https://fick75.github.io/citro-sistema-ct/

**Presionar F12 → Console**

**Ejecutar:**
```javascript
typeof CONFIG
```

**Resultado esperado:** `"object"` ✅

**Si dice `undefined`:**
- Esperar 2-3 minutos más
- Limpiar caché: Ctrl+Shift+R
- Verificar que archivos están en GitHub

### 4. Probar funcionalidad

1. **¿Ves 5 tarjetas de formularios?** ✅
2. **Click "Iniciar sesión con Microsoft"**
3. **Login con cuenta @uv.mx**
4. **¿Ves tu nombre arriba?** ✅
5. **Click en un formulario**
6. **¿Aparece el formulario?** ✅

---

## 🎯 RESULTADO ESPERADO

### Página principal:
```
┌─────────────────────────────────────────┐
│ CITRO - Sistema de Gestión              │
│ Universidad Veracruzana                  │
│                                          │
│  [🔐 Iniciar sesión con Microsoft]      │
└─────────────────────────────────────────┘

Gestión de Solicitudes al Consejo Técnico

┌──────────┐ ┌──────────┐ ┌──────────┐
│    🎓    │ │    ✅    │ │    👥    │
│  Apoyo   │ │   Aval   │ │  Apoyo   │
│Académico │ │Instit.   │ │Terceros  │
└──────────┘ └──────────┘ └──────────┘
┌──────────┐ ┌──────────┐
│    📚    │ │    📝    │
│ Comité   │ │Solicitud │
│Tutorial  │ │  Libre   │
└──────────┘ └──────────┘
```

---

## 🐛 TROUBLESHOOTING

### Error: "CONFIG is not defined"

**Causa:** Archivos no se cargaron

**Solución:**
1. Verificar que archivos están en GitHub
2. Esperar 2-3 minutos más
3. Limpiar caché (Ctrl+Shift+R)

### Error: "404 Not Found"

**Causa:** GitHub Pages no está configurado

**Solución:**
1. Settings → Pages
2. Source: main branch
3. Folder: / (root)
4. Save

### No aparece botón de login

**Causa:** HTML no cargó bien

**Solución:**
1. Verificar que index.html está en GitHub
2. Abrir: https://fick75.github.io/citro-sistema-ct/index.html
3. Ver si carga

### Formularios no cargan

**Causa:** Usuario no logueado

**Solución:**
1. Iniciar sesión PRIMERO
2. LUEGO click en formulario

---

## 📞 SI NECESITAS AYUDA

**Dime:**
1. ¿Qué archivos ves en https://github.com/fick75/citro-sistema-ct?
2. ¿Qué sale en consola cuando ejecutas `typeof CONFIG`?
3. ¿Qué error específico ves?

---

## ✅ CHECKLIST FINAL

```
□ 10 archivos descargados
□ Subidos a GitHub (opción A o B)
□ GitHub Pages configurado (main, /)
□ Esperado 2-3 minutos
□ Sitio abre: https://fick75.github.io/citro-sistema-ct/
□ Console muestra: typeof CONFIG = "object"
□ Aparecen 5 tarjetas de formularios
□ Botón de login aparece
□ Login con @uv.mx funciona
□ Formularios cargan después de login
□ ✅ Sistema 100% funcional
```

---

**¡Listo para instalar!** 🚀

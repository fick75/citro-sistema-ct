/**

- ═══════════════════════════════════════════════════════════════
- CITRO — SharePoint Lists + OneDrive (HÍBRIDO)
- SharePoint para datos, OneDrive para PDFs
- Versión: 1.2 Híbrida - Febrero 2026
- ═══════════════════════════════════════════════════════════════
  */

const GRAPH_BASE = ‘https://graph.microsoft.com/v1.0’;

// ════════════════════════════════════════════════════════════════
// SUBIR PDF A ONEDRIVE (NUEVO)
// ════════════════════════════════════════════════════════════════

/**

- Subir PDF a OneDrive del CT
  */
  async function uploadPDFToOneDrive(pdfBlob, folio, tipoTramite) {
  try {
  if (!pdfBlob || pdfBlob.size === 0) {
  throw new Error(‘El PDF está vacío’);
  }
  
  ```
   const token = await getAccessToken();
   const carpeta = CONFIG.onedrive.folders[tipoTramite] || 'Otros';
   const fileName = `${folio}.pdf`;
   const fullPath = `${CONFIG.onedrive.basePath}/${carpeta}/${fileName}`;
  
   if (CONFIG.options.debug) {
       console.log('📤 Subiendo PDF a OneDrive...');
       console.log('   Archivo:', fileName);
       console.log('   Ruta:', fullPath);
       console.log('   Tamaño:', (pdfBlob.size / 1024).toFixed(2), 'KB');
   }
  
   const arrayBuffer = await pdfBlob.arrayBuffer();
  
   // Subir a OneDrive del usuario autenticado
   const uploadUrl = `${GRAPH_BASE}/me/drive/root:/${fullPath}:/content`;
  
   const response = await fetch(uploadUrl, {
       method: 'PUT',
       headers: {
           'Authorization': `Bearer ${token}`,
           'Content-Type': 'application/pdf'
       },
       body: arrayBuffer
   });
  
   if (!response.ok) {
       const errorText = await response.text();
       throw new Error(`Error ${response.status}: ${errorText}`);
   }
  
   const data = await response.json();
   const pdfUrl = data.webUrl;
  
   if (CONFIG.options.debug) {
       console.log('✅ PDF subido a OneDrive');
       console.log('   URL:', pdfUrl);
   }
  
   return pdfUrl;
  ```
  
  } catch (error) {
  console.error(‘❌ Error al subir PDF a OneDrive:’, error);
  throw new Error(`No se pudo subir el PDF a OneDrive: ${error.message}`);
  }
  }

// ════════════════════════════════════════════════════════════════
// SHAREPOINT LIST (IGUAL QUE ANTES)
// ════════════════════════════════════════════════════════════════

/**

- Crear solicitud en SharePoint List
  */
  async function createSolicitudEnSharePoint(solicitudData) {
  try {
  if (!userState.isLoggedIn) {
  throw new Error(‘Debes iniciar sesión’);
  }
  
  ```
   const siteId = await getSiteId();
   const formData = solicitudData.formData;
  
   const fields = {
       Title: solicitudData.folio,
       Folio: solicitudData.folio,
       TipoTramite: solicitudData.tipo,
       NombreSolicitante: formData.nombre_completo || 
                         formData.nombre_estudiante || 
                         userState.profile.nombre,
       EmailSolicitante: formData.correo || userState.profile.email,
       EmailUsuarioM365: userState.profile.email,
       Matricula: formData.matricula || '',
       MontoSolicitado: parseFloat(formData.monto_total || 0),
       MontoAutorizado: 0,
       Estado: 'Pendiente',
       DatosCompletos: JSON.stringify(formData),
       FechaSolicitud: new Date().toISOString(),
       NotasCT: '',
       URLPdf: solicitudData.pdfUrl || '' // ← URL de OneDrive
   };
  
   if (CONFIG.options.debug) {
       console.log('💾 Guardando en SharePoint List...');
       console.log('   Folio:', fields.Folio);
       console.log('   URL PDF:', fields.URLPdf);
   }
  
   const response = await callGraph(
       `/sites/${siteId}/lists/${CONFIG.sharepoint.listName}/items`,
       'POST',
       { fields }
   );
  
   if (CONFIG.options.debug) {
       console.log('✅ Solicitud guardada en SharePoint List');
       console.log('   Item ID:', response.id);
   }
  
   return response;
  ```
  
  } catch (error) {
  console.error(‘❌ Error al crear solicitud:’, error);
  throw error;
  }
  }

/**

- Obtener Site ID (igual que antes)
  */
  async function getSiteId() {
  if (_siteId && _siteIdExpiry && Date.now() < _siteIdExpiry) {
  return _siteId;
  }
  
  try {
  const siteUrl = new URL(CONFIG.sharepoint.siteUrl);
  const hostname = siteUrl.hostname;
  const pathname = siteUrl.pathname;
  
  ```
   const data = await callGraph(`/sites/${hostname}:${pathname}`);
   
   _siteId = data.id;
   _siteIdExpiry = Date.now() + (30 * 60 * 1000);
  
   if (CONFIG.options.debug) {
       console.log('✅ Site ID obtenido:', _siteId);
   }
  
   return _siteId;
  ```
  
  } catch (error) {
  console.error(‘❌ Error al obtener Site ID:’, error);
  throw error;
  }
  }

/**

- Llamada a Graph API (igual que antes)
  */
  async function callGraph(endpoint, method = ‘GET’, body = null, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
  try {
  const token = await getAccessToken();
  
  ```
       const options = {
           method,
           headers: {
               'Authorization': `Bearer ${token}`,
               'Content-Type': 'application/json',
               'Accept': 'application/json'
           }
       };
  
       if (body) {
           options.body = JSON.stringify(body);
       }
  
       const response = await fetch(`${GRAPH_BASE}${endpoint}`, options);
  
       if (response.status === 204) {
           return null;
       }
  
       if (!response.ok) {
           const errorData = await response.json().catch(() => ({}));
           const errorMsg = errorData.error?.message || `Error ${response.status}`;
           
           if (response.status === 401 && attempt < retries) {
               await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
               continue;
           }
           
           throw new Error(errorMsg);
       }
  
       return response.json();
  
   } catch (error) {
       if (attempt === retries) {
           throw error;
       }
       await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
   }
  ```
  
  }
  }

// ════════════════════════════════════════════════════════════════
// OBTENER SOLICITUDES (IGUAL QUE ANTES)
// ════════════════════════════════════════════════════════════════

async function getSolicitudesUsuario() {
try {
if (!userState.isLoggedIn) {
throw new Error(‘Debes iniciar sesión’);
}

```
    const siteId = await getSiteId();
    const email = userState.profile.email;

    const query = `/sites/${siteId}/lists/${CONFIG.sharepoint.listName}/items?` +
        `$filter=fields/EmailUsuarioM365 eq '${email}'` +
        `&$select=id,fields` +
        `&$expand=fields` +
        `&$orderby=fields/FechaSolicitud desc` +
        `&$top=100`;

    const data = await callGraph(query);

    const solicitudes = (data.value || []).map(item => ({
        spId: item.id,
        ...item.fields
    }));

    if (CONFIG.options.debug) {
        console.log(`✅ ${solicitudes.length} solicitud(es) obtenida(s)`);
    }

    return solicitudes;

} catch (error) {
    console.error('❌ Error:', error);
    throw error;
}
```

}

async function getAllSolicitudes() {
try {
if (!userState.isAdmin) {
throw new Error(‘No tienes permisos’);
}

```
    const siteId = await getSiteId();

    const query = `/sites/${siteId}/lists/${CONFIG.sharepoint.listName}/items?` +
        `$select=id,fields` +
        `&$expand=fields` +
        `&$orderby=fields/FechaSolicitud desc` +
        `&$top=500`;

    const data = await callGraph(query);

    const solicitudes = (data.value || []).map(item => ({
        spId: item.id,
        ...item.fields
    }));

    if (CONFIG.options.debug) {
        console.log(`✅ ${solicitudes.length} solicitud(es) (admin)`);
    }

    return solicitudes;

} catch (error) {
    console.error('❌ Error:', error);
    throw error;
}
```

}

// Los emails se quedan IGUAL
// … código de emails …

if (CONFIG.options.debug) {
console.log(‘📦 sharepoint-onedrive-hybrid.js cargado’);
console.log(’   SharePoint Lists para datos’);
console.log(’   OneDrive para PDFs’);
}
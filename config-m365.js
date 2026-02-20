# ═══════════════════════════════════════════════════════════════
# CITRO — Configuración de SharePoint para Universidad Veracruzana
# Site: https://uvmx.sharepoint.com/sites/CtTramites2026
# ═══════════════════════════════════════════════════════════════

<#
.SYNOPSIS
    Configura automáticamente SharePoint para el Sistema CITRO

.DESCRIPTION
    Este script crea la lista SolicitudesCITRO con todas las columnas necesarias
    y la biblioteca PDFs_Solicitudes con carpetas organizadas por tipo de trámite.

.PARAMETER SiteUrl
    URL del sitio SharePoint de la UV
    Default: https://uvmx.sharepoint.com/sites/CtTramites2026

.PARAMETER AdminEmail
    Email del administrador (para conectar)

.EXAMPLE
    .\Setup-SharePoint-UV.ps1 -AdminEmail "admin@uv.mx"

.NOTES
    Requiere: PnP.PowerShell módulo instalado
    Install-Module PnP.PowerShell -Force -AllowClobber
#>

param(
    [Parameter(Mandatory = $false)]
    [string]$SiteUrl = "https://uvmx.sharepoint.com/sites/CtTramites2026",

    [Parameter(Mandatory = $true)]
    [string]$AdminEmail
)

# Colores para output
function Write-ColorOutput($ForegroundColor, $Message) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    Write-Output $Message
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-ColorOutput Cyan "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-ColorOutput Cyan "🚀 CITRO — Configuración de SharePoint"
Write-ColorOutput Cyan "Universidad Veracruzana"
Write-ColorOutput Cyan "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n"

# ═══ VERIFICAR MÓDULO PNP ═══════════════════════════════════════
Write-ColorOutput Yellow "🔍 Verificando módulo PnP.PowerShell..."

if (!(Get-Module -ListAvailable -Name PnP.PowerShell)) {
    Write-ColorOutput Red "❌ Módulo PnP.PowerShell no encontrado"
    Write-ColorOutput Yellow "`nInstalando módulo..."
    
    try {
        Install-Module PnP.PowerShell -Force -AllowClobber -Scope CurrentUser
        Write-ColorOutput Green "✅ Módulo instalado correctamente"
    }
    catch {
        Write-ColorOutput Red "❌ Error al instalar módulo: $_"
        Write-ColorOutput Yellow "Intenta manualmente: Install-Module PnP.PowerShell -Force"
        exit 1
    }
}
else {
    Write-ColorOutput Green "✅ Módulo PnP.PowerShell encontrado"
}

# ═══ CONECTAR A SHAREPOINT ══════════════════════════════════════
Write-ColorOutput Yellow "`n🔐 Conectando a SharePoint..."
Write-ColorOutput White "   Site: $SiteUrl"
Write-ColorOutput White "   User: $AdminEmail`n"

try {
    Connect-PnPOnline -Url $SiteUrl -Interactive
    Write-ColorOutput Green "✅ Conectado exitosamente`n"
}
catch {
    Write-ColorOutput Red "❌ Error al conectar: $_"
    exit 1
}

# ═══ CREAR LISTA "SolicitudesCITRO" ═════════════════════════════
Write-ColorOutput Yellow "📋 Configurando lista 'SolicitudesCITRO'..."

$lista = Get-PnPList -Identity "SolicitudesCITRO" -ErrorAction SilentlyContinue

if (-not $lista) {
    try {
        $lista = New-PnPList -Title "SolicitudesCITRO" -Template GenericList -Url "SolicitudesCITRO"
        Write-ColorOutput Green "   ✅ Lista creada"
    }
    catch {
        Write-ColorOutput Red "   ❌ Error al crear lista: $_"
        exit 1
    }
}
else {
    Write-ColorOutput White "   ℹ️  Lista ya existe, actualizando columnas..."
}

# ═══ CREAR COLUMNAS ═════════════════════════════════════════════
Write-ColorOutput Yellow "`n📊 Agregando columnas..."

$columnas = @(
    @{
        Nombre = "Folio"
        Tipo = "Text"
        Descripcion = "Folio único de la solicitud"
    },
    @{
        Nombre = "TipoTramite"
        Tipo = "Choice"
        Opciones = @("Apoyo Académico", "Aval Institucional", "Apoyo a Terceros", "Comité Tutorial", "Solicitud Libre")
        Descripcion = "Tipo de trámite solicitado"
    },
    @{
        Nombre = "NombreSolicitante"
        Tipo = "Text"
        Descripcion = "Nombre completo del solicitante"
    },
    @{
        Nombre = "EmailSolicitante"
        Tipo = "Text"
        Descripcion = "Email del solicitante"
    },
    @{
        Nombre = "EmailUsuarioM365"
        Tipo = "Text"
        Descripcion = "Email de Microsoft 365 del usuario"
    },
    @{
        Nombre = "Matricula"
        Tipo = "Text"
        Descripcion = "Número de matrícula o identificación"
    },
    @{
        Nombre = "MontoSolicitado"
        Tipo = "Currency"
        Descripcion = "Monto solicitado en MXN"
    },
    @{
        Nombre = "MontoAutorizado"
        Tipo = "Currency"
        Descripcion = "Monto autorizado por el Consejo Técnico"
    },
    @{
        Nombre = "Estado"
        Tipo = "Choice"
        Opciones = @("Pendiente", "En Revisión", "Aprobado", "Rechazado")
        Default = "Pendiente"
        Descripcion = "Estado actual de la solicitud"
    },
    @{
        Nombre = "DatosCompletos"
        Tipo = "Note"
        Descripcion = "Datos completos del formulario en formato JSON"
    },
    @{
        Nombre = "NotasCT"
        Tipo = "Note"
        Descripcion = "Notas del Consejo Técnico"
    },
    @{
        Nombre = "URLPdf"
        Tipo = "URL"
        Descripcion = "Enlace al PDF en SharePoint"
    },
    @{
        Nombre = "FechaSolicitud"
        Tipo = "DateTime"
        Descripcion = "Fecha y hora de la solicitud"
    }
)

$contadorExistentes = 0
$contadorNuevas = 0

foreach ($col in $columnas) {
    $existe = Get-PnPField -List "SolicitudesCITRO" -Identity $col.Nombre -ErrorAction SilentlyContinue

    if (-not $existe) {
        try {
            switch ($col.Tipo) {
                "Text" {
                    Add-PnPField -List "SolicitudesCITRO" -DisplayName $col.Nombre -InternalName $col.Nombre -Type Text -AddToDefaultView | Out-Null
                }
                "Note" {
                    Add-PnPField -List "SolicitudesCITRO" -DisplayName $col.Nombre -InternalName $col.Nombre -Type Note -AddToDefaultView | Out-Null
                }
                "Currency" {
                    Add-PnPField -List "SolicitudesCITRO" -DisplayName $col.Nombre -InternalName $col.Nombre -Type Currency -AddToDefaultView | Out-Null
                }
                "DateTime" {
                    Add-PnPField -List "SolicitudesCITRO" -DisplayName $col.Nombre -InternalName $col.Nombre -Type DateTime -AddToDefaultView | Out-Null
                }
                "URL" {
                    Add-PnPField -List "SolicitudesCITRO" -DisplayName $col.Nombre -InternalName $col.Nombre -Type URL -AddToDefaultView | Out-Null
                }
                "Choice" {
                    $opcionesXml = ($col.Opciones | ForEach-Object { "<CHOICE>$_</CHOICE>" }) -join ""
                    $defaultXml = if ($col.Default) { "<Default>$($col.Default)</Default>" } else { "" }
                    $fieldXml = "<Field Type='Choice' Name='$($col.Nombre)' DisplayName='$($col.Nombre)'><CHOICES>$opcionesXml</CHOICES>$defaultXml</Field>"
                    Add-PnPFieldFromXml -List "SolicitudesCITRO" -FieldXml $fieldXml | Out-Null
                }
            }
            Write-ColorOutput Green "   ✅ $($col.Nombre)"
            $contadorNuevas++
        }
        catch {
            Write-ColorOutput Red "   ❌ Error con $($col.Nombre): $_"
        }
    }
    else {
        Write-ColorOutput White "   ✓  $($col.Nombre) (ya existe)"
        $contadorExistentes++
    }
}

Write-ColorOutput Green "`n   📊 Resumen: $contadorNuevas nuevas, $contadorExistentes existentes"

# ═══ CREAR BIBLIOTECA DE DOCUMENTOS ═════════════════════════════
Write-ColorOutput Yellow "`n📁 Configurando biblioteca 'PDFs_Solicitudes'..."

$biblioteca = Get-PnPList -Identity "PDFs_Solicitudes" -ErrorAction SilentlyContinue

if (-not $biblioteca) {
    try {
        $biblioteca = New-PnPList -Title "PDFs_Solicitudes" -Template DocumentLibrary -Url "PDFs_Solicitudes"
        Write-ColorOutput Green "   ✅ Biblioteca creada"
    }
    catch {
        Write-ColorOutput Red "   ❌ Error al crear biblioteca: $_"
    }
}
else {
    Write-ColorOutput White "   ℹ️  Biblioteca ya existe"
}

# ═══ CREAR CARPETAS POR TIPO ════════════════════════════════════
Write-ColorOutput Yellow "`n📂 Creando carpetas organizadas..."

$carpetas = @(
    "01_Apoyo_Academico",
    "02_Aval_Institucional",
    "03_Apoyo_Terceros",
    "04_Comite_Tutorial",
    "05_Solicitud_Libre"
)

$contadorCarpetasNuevas = 0
$contadorCarpetasExistentes = 0

foreach ($carpeta in $carpetas) {
    $existe = Get-PnPFolder -Url "PDFs_Solicitudes/$carpeta" -ErrorAction SilentlyContinue
    
    if (-not $existe) {
        try {
            Add-PnPFolder -Name $carpeta -Folder "PDFs_Solicitudes" | Out-Null
            Write-ColorOutput Green "   ✅ $carpeta"
            $contadorCarpetasNuevas++
        }
        catch {
            Write-ColorOutput Red "   ❌ Error con $carpeta : $_"
        }
    }
    else {
        Write-ColorOutput White "   ✓  $carpeta (ya existe)"
        $contadorCarpetasExistentes++
    }
}

Write-ColorOutput Green "`n   📂 Resumen: $contadorCarpetasNuevas nuevas, $contadorCarpetasExistentes existentes"

# ═══ RESUMEN FINAL ══════════════════════════════════════════════
Write-ColorOutput Cyan "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-ColorOutput Green "✅ CONFIGURACIÓN COMPLETADA EXITOSAMENTE"
Write-ColorOutput Cyan "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n"

Write-ColorOutput White "📋 Lista creada:     $SiteUrl/Lists/SolicitudesCITRO"
Write-ColorOutput White "📁 Biblioteca:       $SiteUrl/PDFs_Solicitudes"
Write-ColorOutput White "🌐 Sitio SharePoint: $SiteUrl`n"

Write-ColorOutput Yellow "🔑 PRÓXIMOS PASOS:"
Write-ColorOutput White "   1. ✅ SharePoint configurado"
Write-ColorOutput White "   2. 📝 Registrar App en Azure AD (portal.azure.com)"
Write-ColorOutput White "   3. ⚙️  Editar config-m365.js con clientId y tenantId"
Write-ColorOutput White "   4. 📧 Configurar emails de administradores"
Write-ColorOutput White "   5. 🌐 Subir frontend a hosting`n"

Write-ColorOutput Cyan "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n"

# Desconectar
Disconnect-PnPOnline

Write-ColorOutput Green "Script completado. SharePoint listo para usar.`n"

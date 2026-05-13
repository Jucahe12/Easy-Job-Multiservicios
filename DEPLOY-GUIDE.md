# Easy-Job Multiservicios - Checklist Pre-Deploy

## ✅ Archivos creados

### 1. **robots.txt**
Permite a los motores de búsqueda indexar tu sitio.

### 2. **sitemap.xml**
Ayuda a Google a encontrar todas las páginas de tu sitio.

### 3. **privacidad.html**
Página de política de privacidad. **Importante:** Completa el campo de NIT si tienes uno.

### 4. **manifest.json**
Permite que la web se instale como app en móviles (PWA).

### 5. **.htaccess**
Configuración para Apache: compresión GZIP, caché, headers de seguridad.

### 6. **404.html**
Página de error personalizada.

### 7. **Favicon SVG**
Agregado inline en el `index.html` - funciona en todos los navegadores modernos.

---

## 📸 IMÁGENES QUE FALTAN (IMPORTANTE)

La sección "Antes y Después" referencia estas imágenes que **no existen**:

```
assets/img/antes-despues/
├── jardin1-antes.jpg
├── jardin1-despues.jpg
├── jardin2-antes.jpg
├── jardin2-despues.jpg
├── oficina1-antes.jpg
└── oficina1-despues.jpg
```

### Opciones:
1. **Agregar imágenes reales**: Sube fotos de trabajos reales con nombre exacto
2. **Usar placeholders**: Las imágenes mostrarán iconos por defecto (ya configurado en el HTML)
3. **Ocultar la sección**: Si no tienes fotos aún, puedes ocultar temporalmente la sección

---

## 🎨 ICONOS PARA PWA

Para que el manifest.json funcione correctamente, necesitas crear icones en:

```
assets/icons/
├── icon-72x72.png
├── icon-96x96.png
├── icon-128x128.png
├── icon-144x144.png
├── icon-152x152.png
├── icon-192x192.png
├── icon-384x384.png
└── icon-512x512.png
```

### Cómo crearlos:
1. Ve a https://favicon.io/ o https://realfavicongenerator.net/
2. Sube tu logo
3. Descarga el paquete y coloca los archivos en `assets/icons/`

---

## 🚀 ANTES DE SUBIR AL HOST

### Revisa estos datos:

| Campo | Ubicación | Estado |
|-------|-----------|--------|
| NIT en política de privacidad | `privacidad.html` línea ~90 | ⚠️ Completar |
| URL del sitio | `sitemap.xml` | ⚠️ Actualizar dominio real |
| URL OG Image | `index.html` meta tags | ⚠️ Actualizar dominio real |

---

## 📤 SUBIR AL HOSTING

### Opción 1: Netlify (Gratis - Recomendado)
1. Ve a https://www.netlify.com/
2. Arrastra la carpeta del proyecto
3. Listo! Te darán una URL tipo `easy-job-123.netlify.app`
4. (Opcional) Configura tu dominio personalizado

### Opción 2: Vercel (Gratis)
1. Ve a https://vercel.com/
2. Importa el proyecto
3. Sigue los pasos de configuración

### Opción 3: Hostinger/Namecheap/cPanel
1. Comprime todo en un archivo ZIP
2. Sube vía File Manager o FTP
3. Descomprime en la carpeta `public_html`

---

## 🔍 VERIFICACIÓN POST-DEPLOY

Después de subir, verifica:

- [ ] El sitio carga correctamente
- [ ] El favicon aparece en la pestaña del navegador
- [ ] Los enlaces internos funcionan (servicios, contacto, etc.)
- [ ] El formulario de contacto abre WhatsApp correctamente
- [ ] El botón flotante de WhatsApp funciona
- [ ] La versión móvil se ve bien (usa Chrome DevTools)
- [ ] https://search.google.com/test/rich-results (prueba de Google)

---

## 📊 GOOGLE ANALYTICS (Opcional)

Para agregar Analytics, inserta este código antes de `</head>` en `index.html`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

Reemplaza `GA_MEASUREMENT_ID` con tu ID de Google Analytics 4.

---

## 📱 CONSEJOS PARA SEO LOCAL

1. **Google Business Profile**: Crea tu ficha gratuita en https://business.google.com/
2. **Palabras clave**: "Jardinería Cajicá", "Limpieza Chía", etc.
3. **Reseñas**: Pide a tus clientes que dejen reseñas en Google
4. **Ubicación**: Asegúrate de que tu dirección esté consistente en toda la web

---

## 📞 SOPORTE

¿Problemas con el deploy? Revisa:
- Que todas las imágenes tengan extensiones correctas (.jpg, .jpeg, .png)
- Que los nombres de archivos coincidan exactamente (mayúsculas/minúsculas)
- Que el archivo `.htaccess` funcione en tu hosting (algunos usan nginx)

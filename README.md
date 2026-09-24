# Track Creativo · Installers On Track

Web estática de 20 páginas. Mantiene la identidad de la academia y organiza los contenidos entre orientación por nivel, programas presenciales, formación online, método, formador y comunidad.

## Trabajar en el proyecto

Se necesita Node.js 24 y npm.

```sh
npm ci
npm run build
npm run dev
```

Abre http://127.0.0.1:4173/. El servidor muestra el contenido de `dist/`: después de editar una plantilla, vuelve a ejecutar la construcción.

```sh
npm run check
npm run format
npm run format:check
```

`build` prepara las imágenes, genera los HTML con formato legible y copia la web a `dist/`. También actualiza los HTML de la raíz para permitir una publicación estática sencilla. `check` revisa las páginas, enlaces, imágenes y controles, y sirve el resultado por HTTP tanto en la raíz como bajo una carpeta.

## Publicar en GitHub Pages

La opción preparada es **GitHub Actions**. En el repositorio, selecciona **Settings → Pages → Build and deployment → Source → GitHub Actions**. Sube el proyecto completo y ejecuta el flujo **Publish GitHub Pages**, o actualiza la rama `main` o `master`.

El archivo `.github/workflows/pages.yml` instala las dependencias, prepara todas las imágenes, construye la web, ejecuta las comprobaciones y publica únicamente `dist/`. La dirección pública y la carpeta del repositorio se obtienen de GitHub, de modo que los metadatos, el sitemap y la página 404 usan el destino correcto.

También se puede publicar el contenido de `dist/` desde una rama. Debe copiarse **todo** su contenido: los HTML, `styles.css`, `main.js`, `logo.jpg`, `.nojekyll` y la carpeta `assets/`. Subir únicamente los HTML deja referencias a imágenes y fuentes que no existen en el destino.

Para una construcción manual con el dominio definitivo, define `SITE_URL`, incluyendo la carpeta del repositorio si existe. Ejemplo en PowerShell (sustituye la dirección):

```powershell
$env:SITE_URL = 'https://TU-USUARIO.github.io/TU-REPOSITORIO'
npm run build
npm run check
Remove-Item Env:SITE_URL
```

Sin `SITE_URL` se genera una versión transportable con rutas relativas y sin dominio canónico ni sitemap. Funciona desde una carpeta local o un alojamiento estático. Para que la página 404 cargue correctamente al visitar rutas inexistentes de varios niveles, utiliza la construcción con `SITE_URL` o el flujo de Actions.

La configuración `.openai/hosting.json` corresponde al alojamiento anterior de Sites. No interviene en GitHub Pages y no se incluye en los archivos públicos.

Referencia: [publicar con un flujo de GitHub Actions](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Dónde editar

| Archivo                   | Contenido                                                               |
| ------------------------- | ----------------------------------------------------------------------- |
| `scripts/home.mjs`        | Portada y presentación de la academia                                   |
| `scripts/academy.mjs`     | Datos de los cuatro cursos, selector de nivel y demostración del método |
| `scripts/pages.mjs`       | Páginas interiores y fichas de curso                                    |
| `scripts/shared.mjs`      | Navegación, pie, imágenes y metadatos comunes                           |
| `scripts/site-config.mjs` | Dominio y carpeta de publicación                                        |
| `styles.css`              | Estilos y adaptación a tamaños de pantalla                              |
| `main.js`                 | Menú móvil, filtros, selector y formulario                              |
| `scripts/assets.mjs`      | Preparación de fotografías a partir de los originales                   |

Edita las plantillas para hacer cambios permanentes: los HTML se regeneran con `npm run build`. Prettier y `.editorconfig` mantienen la sangría, los saltos de línea y la codificación UTF-8.

## Imágenes

Los originales PNG/JPEG de la raíz se conservan para poder reconstruir la web. Se generan versiones WebP y JPEG a dos tamaños, sin ampliar las fotografías por encima de su resolución original. El nombre `-720` identifica el tamaño solicitado; el manifiesto recoge el ancho real y ese ancho se usa en `srcset`.

Cada fotografía utiliza `<picture>`: el navegador elige WebP si lo admite y dispone de JPEG como alternativa de formato. No hay conversión de imágenes en GitHub Pages ni peticiones a un servicio externo. Ambos formatos deben publicarse; la alternativa JPEG no sustituye un archivo WebP que falte en el servidor.

Las fuentes y sus licencias están en `assets/`. El tamaño y la calidad de las fotografías siguen limitados por el material original facilitado, que incluye capturas de pantalla.

## Revisión de entrega · 24/09/2026

- HTML, CSS y JavaScript con formato legible, incluidas las plantillas.
- Selector por nivel solo en la portada; catálogo con los cuatro programas visibles en cursos presenciales.
- Demostración sobre la fotografía solo en la página del método.
- Eliminados el índice duplicado de cursos, el bloque repetido de filosofía de enseñanza, el recordatorio duplicado del formulario y la promoción repetida del pie.
- Eliminado el dominio antiguo de los metadatos y corregida la base de la página 404 para publicaciones en una carpeta.
- Comprobadas 20 páginas, 495 enlaces internos y 44 archivos WebP/JPEG; se verifican también las rutas `srcset`, las fuentes y la coincidencia de mayúsculas de los archivos.
- Pruebas en Chrome a 320, 390, 768, 1024, 1440 y 1920 px: 120 vistas sin imágenes rotas, desbordamientos ni errores de consola.
- Menú móvil, teclado, filtros, selección de curso, puntos de observación, formulario, preguntas frecuentes y navegación sin JavaScript comprobados.

Las pruebas son locales y simulan la carpeta de GitHub Pages. No acreditan que la copia que ya está publicada contenga estos cambios: para verificarla hace falta su URL y subir la nueva entrega.

Las capturas y los informes quedan localmente en `.delivery/qa/`, fuera de la publicación. Para repetir las pruebas con Chrome instalado en Windows:

```sh
npm install --prefix .delivery --no-save playwright
node scripts/browser-check.mjs
```

`BROWSER_EXECUTABLE` permite indicar otro ejecutable de Chrome. `BASE_URL` permite probar una dirección de desarrollo distinta. Una página como argumento limita la revisión visual; `--interactions` ejecuta solo las comprobaciones de interacción.

## Contacto y datos del cliente

El formulario prepara un mensaje de WhatsApp para que el visitante lo revise y lo envíe. No reserva plazas, cobra ni crea cuentas. Los accesos de alumnos continúan hacia Installers On Track.

Se conservan los contactos y contenidos del proyecto. Las fechas, precios, duración, disponibilidad y materiales de los cursos se consultan con la academia; no se han inventado datos. La información fiscal y el texto legal definitivo deben facilitarlos los responsables de la academia antes de considerarlos cerrados para la entrega comercial.

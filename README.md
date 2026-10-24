# Sistema de registro de productos

Aplicación web académica para registrar y administrar un inventario, creada para demostrar un flujo de trabajo con Git, GitHub y GitHub Actions.

## Funciones

- Registrar productos con nombre, categoría, precio y existencias.
- Listar, buscar, editar y eliminar productos.
- Validar los datos antes de guardarlos.
- Conservar el inventario en `localStorage`.
- Ejecutar pruebas automatizadas de la lógica independiente de la interfaz.
- Comprobar cada `push` y `pull request` mediante integración continua.

## Herramientas

- HTML, CSS y JavaScript.
- Bootstrap 5 mediante CDN para el diseño adaptable.
- Node.js, npm y el módulo integrado `node:test`.
- Git y GitHub.
- GitHub Actions.

## Requisitos

- Un navegador web moderno.
- Node.js 20 o posterior (el workflow utiliza Node.js 22 LTS).
- npm.
- Git.
- Conexión a internet para cargar Bootstrap desde el CDN y publicar en GitHub.

Consulta las versiones instaladas en tu equipo antes de anotarlas en un reporte:

```bash
node --version
npm --version
git --version
```

## Ejecutar la aplicación

1. Abre una terminal y entra en la carpeta del proyecto:

   ```bash
   cd registro-productos
   ```

2. Abre `index.html` en un navegador. También puedes servir la carpeta con una extensión de servidor local de tu editor.
3. Registra un producto; los datos permanecerán en el almacenamiento local de ese navegador.

## Instalar y ejecutar las pruebas

Desde la raíz del proyecto:

```bash
npm ci
npm test
```

`npm ci` usa el archivo `package-lock.json` y `npm test` ejecuta todos los archivos de prueba con `node --test`.

## Estructura

```text
registro-productos/
├── .github/workflows/ci.yml
├── css/styles.css
├── js/productos.js
├── js/app.js
├── tests/productos.test.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

La lógica validable se encuentra en `js/productos.js`; `js/app.js` se encarga del DOM y de `localStorage`. La interfaz crea nodos y asigna datos con `textContent`, por lo que no interpreta el contenido escrito por el usuario como HTML.

## Integración continua

El workflow `.github/workflows/ci.yml` se activa con cada `push` y `pull request`. Descarga el código, configura Node.js 22 LTS, instala con `npm ci` y ejecuta `npm test`.

Después de publicar el repositorio, abre la pestaña **Actions** en GitHub para consultar cada ejecución. Entra en una ejecución y en el trabajo **pruebas** para guardar tus propias evidencias de los pasos exitosos o fallidos.

## Publicar en GitHub

Si tienes GitHub CLI instalado y autenticado, ejecuta desde esta carpeta:

```bash
gh auth status
gh repo create registro-productos-ci --public --source=. --remote=origin --push
git push -u origin prueba-error-ci
```

Sin GitHub CLI, crea en <https://github.com/new> un repositorio vacío llamado `registro-productos-ci` (sin README, licencia ni `.gitignore`) y después ejecuta, reemplazando `TU-USUARIO`:

```bash
git remote add origin https://github.com/TU-USUARIO/registro-productos-ci.git
git push -u origin main
git push -u origin prueba-error-ci
```

La rama `prueba-error-ci` conserva en su historial un commit con una prueba deliberadamente incorrecta y otro commit que la corrige. Para provocar una ejecución fallida en GitHub Actions como evidencia, publica primero el commit de fallo; después publica la corrección.


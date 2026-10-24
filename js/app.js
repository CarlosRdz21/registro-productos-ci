(function () {
  'use strict';

  const CLAVE_ALMACENAMIENTO = 'registro-productos';
  const formulario = document.querySelector('#producto-form');
  const campoId = document.querySelector('#producto-id');
  const campoNombre = document.querySelector('#nombre');
  const campoCategoria = document.querySelector('#categoria');
  const campoPrecio = document.querySelector('#precio');
  const campoExistencias = document.querySelector('#existencias');
  const campoBusqueda = document.querySelector('#busqueda');
  const lista = document.querySelector('#lista-productos');
  const listaVacia = document.querySelector('#lista-vacia');
  const mensaje = document.querySelector('#mensaje');
  const tituloFormulario = document.querySelector('#titulo-formulario');
  const botonCancelar = document.querySelector('#cancelar-edicion');

  let productos = cargarProductos();

  function cargarProductos() {
    try {
      const datos = JSON.parse(localStorage.getItem(CLAVE_ALMACENAMIENTO) || '[]');
      return Array.isArray(datos) ? datos : [];
    } catch {
      mostrarMensaje('No fue posible leer los datos guardados.', 'danger');
      return [];
    }
  }

  function guardarProductos() {
    localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(productos));
  }

  function crearCelda(texto) {
    const celda = document.createElement('td');
    celda.textContent = texto;
    return celda;
  }

  function crearBoton(texto, clase, accion, id) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = `btn btn-sm ${clase}`;
    boton.textContent = texto;
    boton.dataset.accion = accion;
    boton.dataset.id = id;
    return boton;
  }

  function renderizarProductos() {
    const resultados = Productos.buscarProductos(productos, campoBusqueda.value);
    lista.replaceChildren();

    resultados.forEach((producto) => {
      const fila = document.createElement('tr');
      fila.append(
        crearCelda(producto.nombre),
        crearCelda(producto.categoria),
        crearCelda(
          producto.precio.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }),
        ),
        crearCelda(String(producto.existencias)),
      );

      const acciones = document.createElement('td');
      acciones.className = 'acciones text-end';
      acciones.append(
        crearBoton('Editar', 'btn-outline-primary me-2', 'editar', producto.id),
        crearBoton('Eliminar', 'btn-outline-danger', 'eliminar', producto.id),
      );
      fila.append(acciones);
      lista.append(fila);
    });

    listaVacia.textContent = productos.length === 0
      ? 'Aún no hay productos registrados.'
      : 'No hay productos que coincidan con la búsqueda.';
    listaVacia.classList.toggle('d-none', resultados.length > 0);
  }

  function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = `alert alert-${tipo}`;
  }

  function limpiarFormulario() {
    formulario.reset();
    formulario.classList.remove('was-validated');
    campoId.value = '';
    tituloFormulario.textContent = 'Registrar producto';
    botonCancelar.classList.add('d-none');
    campoNombre.focus();
  }

  function leerFormulario() {
    return {
      nombre: campoNombre.value,
      categoria: campoCategoria.value,
      precio: campoPrecio.value,
      existencias: campoExistencias.value,
    };
  }

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    formulario.classList.add('was-validated');

    try {
      const id = campoId.value;
      if (id) {
        productos = Productos.actualizarProducto(productos, id, leerFormulario());
        mostrarMensaje('Producto actualizado correctamente.', 'success');
      } else {
        const nuevoId = crypto.randomUUID();
        productos = Productos.agregarProducto(productos, leerFormulario(), nuevoId);
        mostrarMensaje('Producto registrado correctamente.', 'success');
      }

      guardarProductos();
      limpiarFormulario();
      renderizarProductos();
    } catch (error) {
      mostrarMensaje(error.message, 'danger');
    }
  });

  lista.addEventListener('click', (evento) => {
    const boton = evento.target.closest('button[data-accion]');
    if (!boton) return;

    const producto = productos.find((elemento) => elemento.id === boton.dataset.id);
    if (!producto) return;

    if (boton.dataset.accion === 'editar') {
      campoId.value = producto.id;
      campoNombre.value = producto.nombre;
      campoCategoria.value = producto.categoria;
      campoPrecio.value = producto.precio;
      campoExistencias.value = producto.existencias;
      tituloFormulario.textContent = 'Editar producto';
      botonCancelar.classList.remove('d-none');
      campoNombre.focus();
      return;
    }

    if (boton.dataset.accion === 'eliminar' && window.confirm(`¿Eliminar ${producto.nombre}?`)) {
      productos = Productos.eliminarProducto(productos, producto.id);
      guardarProductos();
      mostrarMensaje('Producto eliminado correctamente.', 'success');
      if (campoId.value === producto.id) limpiarFormulario();
      renderizarProductos();
    }
  });

  campoBusqueda.addEventListener('input', renderizarProductos);
  botonCancelar.addEventListener('click', limpiarFormulario);
  renderizarProductos();
})();


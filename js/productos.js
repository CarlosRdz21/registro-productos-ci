(function (globalScope) {
  'use strict';

  function textoValido(valor) {
    return typeof valor === 'string' && valor.trim().length > 0;
  }

  function validarProducto(datos) {
    if (!datos || !textoValido(datos.nombre)) {
      throw new TypeError('El nombre es obligatorio.');
    }

    if (!textoValido(datos.categoria)) {
      throw new TypeError('La categoría es obligatoria.');
    }

    const precio = Number(datos.precio);
    if (!Number.isFinite(precio) || precio < 0) {
      throw new TypeError('El precio debe ser un número mayor o igual a cero.');
    }

    const existencias = Number(datos.existencias);
    if (!Number.isInteger(existencias) || existencias < 0) {
      throw new TypeError('Las existencias deben ser un número entero mayor o igual a cero.');
    }

    return {
      nombre: datos.nombre.trim(),
      categoria: datos.categoria.trim(),
      precio,
      existencias,
    };
  }

  function agregarProducto(productos, datos, id) {
    const producto = validarProducto(datos);
    return [...productos, { id, ...producto }];
  }

  function actualizarProducto(productos, id, datos) {
    const indice = productos.findIndex((producto) => producto.id === id);
    if (indice === -1) {
      throw new RangeError('No se encontró el producto que se desea editar.');
    }

    const productoActualizado = { id, ...validarProducto(datos) };
    return productos.map((producto) => (producto.id === id ? productoActualizado : producto));
  }

  function eliminarProducto(productos, id) {
    return productos.filter((producto) => producto.id !== id);
  }

  function normalizarTexto(texto) {
    return String(texto)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('es');
  }

  function buscarProductos(productos, termino) {
    const consulta = normalizarTexto(termino).trim();
    if (!consulta) {
      return [...productos];
    }

    return productos.filter((producto) => {
      const nombre = normalizarTexto(producto.nombre);
      const categoria = normalizarTexto(producto.categoria);
      return nombre.includes(consulta) || categoria.includes(consulta);
    });
  }

  const api = {
    actualizarProducto,
    agregarProducto,
    buscarProductos,
    eliminarProducto,
    validarProducto,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    globalScope.Productos = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);


'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  actualizarProducto,
  agregarProducto,
  buscarProductos,
  eliminarProducto,
  validarProducto,
} = require('../js/productos.js');

const inventario = [
  { id: '1', nombre: 'Café molido', categoria: 'Alimentos', precio: 95.5, existencias: 8 },
  { id: '2', nombre: 'Teclado', categoria: 'Electrónica', precio: 450, existencias: 3 },
];

test('acepta y normaliza los datos válidos de un producto', () => {
  const resultado = validarProducto({
    nombre: '  Cuaderno  ',
    categoria: ' Papelería ',
    precio: '35.50',
    existencias: '12',
  });

  assert.deepEqual(resultado, {
    nombre: 'Cuaderno',
    categoria: 'Papelería',
    precio: 36,
    existencias: 12,
  });
});

test('rechaza un nombre vacío', () => {
  assert.throws(
    () => validarProducto({ nombre: ' ', categoria: 'Hogar', precio: 10, existencias: 1 }),
    /nombre es obligatorio/i,
  );
});

test('rechaza precios negativos', () => {
  assert.throws(
    () => validarProducto({ nombre: 'Vaso', categoria: 'Hogar', precio: -1, existencias: 1 }),
    /precio debe ser un número mayor o igual a cero/i,
  );
});

test('rechaza existencias negativas o decimales', () => {
  const base = { nombre: 'Vaso', categoria: 'Hogar', precio: 20 };
  assert.throws(() => validarProducto({ ...base, existencias: -1 }), /existencias/);
  assert.throws(() => validarProducto({ ...base, existencias: 1.5 }), /existencias/);
});

test('agrega un producto sin modificar el arreglo original', () => {
  const original = [];
  const resultado = agregarProducto(
    original,
    { nombre: 'Lápiz', categoria: 'Papelería', precio: 8, existencias: 20 },
    'nuevo-id',
  );

  assert.equal(original.length, 0);
  assert.equal(resultado.length, 1);
  assert.equal(resultado[0].id, 'nuevo-id');
});

test('busca por nombre sin distinguir mayúsculas ni acentos', () => {
  const resultado = buscarProductos(inventario, 'CAFE');
  assert.deepEqual(resultado.map((producto) => producto.id), ['1']);
});

test('busca por categoría', () => {
  const resultado = buscarProductos(inventario, 'electro');
  assert.deepEqual(resultado.map((producto) => producto.id), ['2']);
});

test('actualiza el producto indicado', () => {
  const resultado = actualizarProducto(inventario, '2', {
    nombre: 'Teclado mecánico',
    categoria: 'Electrónica',
    precio: 900,
    existencias: 2,
  });

  assert.equal(resultado[1].nombre, 'Teclado mecánico');
  assert.equal(inventario[1].nombre, 'Teclado');
});

test('elimina el producto indicado sin modificar el arreglo original', () => {
  const resultado = eliminarProducto(inventario, '1');
  assert.deepEqual(resultado.map((producto) => producto.id), ['2']);
  assert.equal(inventario.length, 2);
});


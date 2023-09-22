const socket = io();

// Escuchar eventos del servidor
socket.on('productos', (productos) => {
  updateProductList(productos);
});

// Función para actualizar la lista de productos en la interfaz de usuario
function updateProductList(productos) {
  const productList = document.getElementById('productList');
  productList.innerHTML = '';

  productos.forEach((producto) => {
      const listItem = document.createElement('li');
      listItem.textContent = `${producto.nombre} - ${producto.descripcion} - $${producto.precio}`;

      const eliminarButton = document.createElement('button');
      eliminarButton.className = 'eliminarProducto';
      eliminarButton.dataset.id = producto.id;
      eliminarButton.textContent = 'Eliminar';

      listItem.appendChild(eliminarButton);
      productList.appendChild(listItem);
  });
}

// Manejar el envío de un nuevo producto desde el formulario
const agregarProductoForm = document.getElementById('agregarProductoForm');
agregarProductoForm.addEventListener('submit', (event) => {
  // Evitar que se realice la acción por defecto del formulario (recargar la página)
  event.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const descripcion = document.getElementById('descripcion').value;
  const precio = parseFloat(document.getElementById('precio').value);

  // Enviar el nuevo producto al servidor a través de WebSocket
  socket.emit('nuevoProducto', { nombre, descripcion, precio });

  // Limpiar los campos del formulario después de enviar
  document.getElementById('nombre').value = '';
  document.getElementById('descripcion').value = '';
  document.getElementById('precio').value = '';
});

// Manejar el clic en el botón "Eliminar" para eliminar un producto
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('eliminarProducto')) {
    const productoId = e.target.dataset.id;

    // Enviar el ID del producto a eliminar al servidor a través de WebSocket
    socket.emit('eliminarProducto', productoId);
  }
});

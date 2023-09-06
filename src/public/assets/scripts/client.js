// Conectar al servidor a través de WebSocket
const socket = io();

// Escuchar eventos del servidor

// Cuando se recibe la lista de productos del servidor
socket.on('productos', (productos) => {
  // Actualizar la lista de productos en la interfaz de usuario
  updateProductList(productos);
});

// Manejar el envío de un nuevo producto desde el formulario
const agregarProductoForm = document.getElementById('agregarProductoForm');
agregarProductoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const descripcion = document.getElementById('descripcion').value; // Nueva línea para descripción
  const precio = parseFloat(document.getElementById('precio').value);

  // Enviar el nuevo producto al servidor a través de WebSocket
  socket.emit('nuevoProducto', { nombre, descripcion, precio });
});

// Manejar el clic en el botón "Eliminar" para eliminar un producto
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('eliminarProducto')) {
    const productoId = e.target.dataset.id;

    // Enviar el ID del producto a eliminar al servidor a través de WebSocket
    socket.emit('eliminarProducto', productoId);
  }
});

// Función para actualizar la lista de productos en la interfaz de usuario
function updateProductList(productos) {
  // Actualiza la lista de productos en la interfaz de usuario (por ejemplo, utilizando DOM manipulation)
  const productList = document.getElementById('productList');
  productList.innerHTML = ''; // Limpia la lista antes de actualizar

  productos.forEach((producto) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<strong>${producto.nombre}</strong> - ${producto.descripcion} - $${producto.precio}`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.className = 'eliminarProducto';
    deleteButton.dataset.id = producto.id;

    listItem.appendChild(deleteButton);
    productList.appendChild(listItem);
  });
}


const socket = io();


socket.on('productos', (productos) => {

  updateProductList(productos);
});


function updateProductList(productos) {
  const productList = document.getElementById('productList');
  productList.innerHTML = '';

  productos.forEach((producto) => {
      const listItem = document.createElement('li');
      listItem.textContent = `${producto.nombre} -
       ${producto.descripcion} - 
       $${producto.precio}`;

      const eliminarButton = document.createElement('button');
      eliminarButton.className = 'eliminarProducto';
      eliminarButton.dataset.id = producto.id;
      eliminarButton.textContent = 'Eliminar';

      listItem.appendChild(eliminarButton);
      productList.appendChild(listItem);
  });
}



const agregarProductoForm = document.getElementById('agregarProductoForm');
agregarProductoForm.addEventListener('submit', () => {

  event.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const descripcion = document.getElementById('descripcion').value;
  const precio = parseFloat(document.getElementById('precio').value);


  socket.emit('nuevoProducto', { nombre, descripcion, precio });

  document.getElementById('nombre').value = '';
  document.getElementById('descripcion').value = '';
  document.getElementById('precio').value = '';
});

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('eliminarProducto')) {
    const productoId = e.target.dataset.id;


    socket.emit('eliminarProducto', productoId);
  }
});



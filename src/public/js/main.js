document.addEventListener('DOMContentLoaded', () => {
    // Obtener el ID del carrito de alguna manera (puede ser a través del DOM o de otra fuente)
    const cartId = obtenerIdDelCarrito(); // Reemplaza esto con tu método para obtener el ID del carrito
    const cid = 1; // ID del carrito

  
    // Event listener para el botón "Agregar al carrito"
    document.addEventListener('click', async (event) => {
      if (event.target.classList.contains('add-to-cart')) {
        const productId = event.target.getAttribute('data-product-id');
  
        try {
          const response = await fetch(`/carts/${cid}/products/${productId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          if (response.ok) {
            console.log('Producto agregado al carrito con éxito');
            alert('Producto agregado al carrito');
          } else {
            console.error('Error al agregar el producto al carrito');
            alert('Error al agregar el producto al carrito');
          }
        } catch (error) {
          console.error('Error de red al agregar el producto al carrito:', error);
        }
      }
    });
  
    function obtenerIdDelCarrito() {
        const cartElement = document.querySelector('.carts');
        if (cartElement) {
          return cartElement.dataset.cartId;
        }
        return null;
      }
      
  });
  
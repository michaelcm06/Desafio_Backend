import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const getCartById = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id).populate('products.product');
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
};

const createCart = async (req, res) => {
  try {
    const cart = new Cart();
    await cart.save();
    res.json({ status: 'success', message: 'Carrito creado exitosamente', cart });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ _id: req.params.id });
    console.log('carrito',req.params.id);
    console.log('producto',req.params.pid);

    if (!cart) {
      return res.json({ status: 'error', message: 'Carrito no encontrado' });
    }

    const product = await Product.findById(req.params.pid);

    if (!product) {
      return res.json({ status: 'error', message: 'Producto no encontrado' });
    }

    // Resto del código para agregar el producto al carrito...

    await cart.save();
    console.log('carrito',cart);

    res.json({ status: 'success', message: 'Producto agregado al carrito' });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
};



const deleteProductFromCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);

    const productIndex = cart.products.findIndex(
      item => item._id.equals(req.params.pid)
    );

    if (productIndex !== -1) {
      cart.products.splice(productIndex, 1);
      await cart.save();
      return res.json({ status: 'success', message: 'Producto eliminado del carrito' });
    } else {
      return res.json({ status: 'error', message: 'Producto no encontrado en el carrito' });
    }
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    cart.products = req.body.products;
    await cart.save();
    res.json({ status: 'success', message: 'Carrito actualizado' });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
};

const updateProductQuantity = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);

    const productIndex = cart.products.findIndex(
      item => item._id.equals(req.params.pid)
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity = req.body.quantity;
      await cart.save();
      return res.json({ status: 'success', message: 'Cantidad de producto actualizada' });
    } else {
      return res.json({ status: 'error', message: 'Producto no encontrado en el carrito' });
    }
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
};

const deleteAllProductsFromCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    cart.products = [];
    await cart.save();
    res.json({ status: 'success', message: 'Todos los productos eliminados del carrito' });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
};

export {
  getCartById,
  addToCart,
  deleteProductFromCart,
  updateCart,
  updateProductQuantity,
  deleteAllProductsFromCart,
  createCart,
};

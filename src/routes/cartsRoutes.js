import express from 'express';
import {
  getCartById,
  addToCart,
  deleteProductFromCart,
  updateCart,
  updateProductQuantity,
  deleteAllProductsFromCart,
  createCart,
} from '../controllers/cartsController.js';

const router = express.Router();

router.get('/:cid', getCartById);
router.post('/:cid/products/:pid', addToCart);
router.post('/', createCart); 
router.delete('/:cid/products/:pid', deleteProductFromCart);
router.put('/:cid', updateCart);
router.put('/:cid/products/:pid', updateProductQuantity);
router.delete('/:cid', deleteAllProductsFromCart);

export default router;

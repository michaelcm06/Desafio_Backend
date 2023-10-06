import express from 'express';
import { getProducts, getProductById ,createProduct } from '../controllers/productsController.js';
import Product from'../models/Product.js';

const router = express.Router();

// Obtener productos paginados
router.get('/', getProducts);

// Obtener un producto por su ID
router.get('/:productId', getProductById);

router.post('/create', createProduct);

export default router;

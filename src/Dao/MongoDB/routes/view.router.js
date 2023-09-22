import { Router } from "express";
import Product from "../Model/products.modelo.js";

export const router = Router();

router.get('/home', async (req, res) => {
    try {
        const productos = await Product.find();
        res.render('home', { productos });
    } catch (error) {
        res.status(500).json({ error: 'Error inesperado', detalle: error.message });
    }
});

router.get('/realTimeProducts', async (req, res) => {
    try {
        const productos = await Product.find();
        res.render('realTimeProducts', { productos });
    } catch (error) {
        res.status(500).json({ error: 'Error inesperado', detalle: error.message });
    }
});

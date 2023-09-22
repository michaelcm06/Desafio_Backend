import express from 'express';
import Message from '../../MongoDB/Model/messages.modelo.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const mensajes = await Message.find();
        res.status(200).json({ mensajes });
    } catch (error) {
        res.status(500).json({ error: 'Error inesperado', detalle: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevoMensaje = new Message(req.body);
        await nuevoMensaje.save();
        res.status(201).json({ mensaje: 'Mensaje guardado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error inesperado', detalle: error.message });
    }
});

export default router;

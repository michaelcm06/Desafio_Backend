import { Router } from 'express';
import crypto from 'crypto'
import  {modeloUsuarios}  from '../models/usuarios.models.js';
export const router=Router()


router.post('/registro', async (req, res) => {
    let { nombre, email, password } = req.body

    if (!nombre || !email || !password) {
        return res.redirect('/registro?error=Complete email, nombre, y contraseña')
    }

    let existe = await modeloUsuarios.findOne({ email })
    if (existe) {
        return res.redirect('/registro?error='+`Usuario ya está registrado: ${email}`)

    }
    let role = 'usuario'; // Por defecto, el rol es "usuario"
    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        role = 'admin'; // Asignar el rol de administrador
    }

    password = crypto.createHmac('sha256', 'palabraSecreta').update(password).digest('base64')

    
  await modeloUsuarios.create({
        nombre, email, password, role
    })

    res.redirect(`/login?usuarioCreado=${email}`)
});

router.post('/login', async (req, res) => {
    let { email, password } = req.body

    if (!email || !password) {
        return res.redirect('/login?error=Faltan datos')
     }

    password = crypto.createHmac('sha256', 'palabraSecreta').update(password).digest('base64')

    let usuario = await modeloUsuarios.findOne({ email, password })
    if (!usuario) {
        return res.redirect('/login?error=credenciales incorrectas')
    }

    req.session.usuario = {
        nombre: usuario.nombre,
        email: usuario.email,
        role: usuario.role 
    }

    res.redirect('/products');
});


router.get('/logout',(req,res)=>{

    req.session.destroy(e=>console.log(e))

    res.redirect('/login?mensaje=logout correcto...!!!')

});
import express from 'express';

const router = express.Router();

const auth=(req, res, next)=>{
  if(req.session.usuario){
    return res.redirect('/products')
      
  }else{
    next()
  }
}


router.get('/',(req,res)=>{

  let verLogin=true
  if(req.session.usuario){
      verLogin=false
  }


  res.status(200).render('index',{
      verLogin
  })
})

router.get('/registro',(req,res)=>{

  let error=false
  let errorDetalle=''
  if(req.query.error){
      error=true
      errorDetalle=req.query.error
  }

  res.status(200).render('registro',{
      verLogin:true,
      error, errorDetalle
  })
})

router.get('/login',auth,(req,res)=>{

  let error=false
  let errorDetalle=''
  if(req.query.error){
      error=true
      errorDetalle=req.query.error
  }

  let usuarioCreado=false
  let usuarioCreadoDetalle=''
  if(req.query.usuarioCreado){
      usuarioCreado=true
      usuarioCreadoDetalle=req.query.usuarioCreado
  }

  res.status(200).render('login',{
      verLogin:true,
      usuarioCreado, usuarioCreadoDetalle,
      error, errorDetalle
  })
})
router.get('/perfil',(req,res)=>{

  res.status(200).render('perfil',{
      verLogin:false,
      usuario: req.session.usuario
  })
})



// Ruta para mostrar un producto específico
router.get('/products/:productId', (req, res) => {
  const productId = req.params.productId;
  
  const producto = productosDB.find(producto => producto.id === parseInt(productId));

  if (producto) {
    res.render('productDetail', { producto });
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

// Ruta para mostrar un carrito específico
router.get('/carts/:id', (req, res) => {
  const cartId = req.params.id;
  res.setHeader('Content-Type', 'text/html');
  res.render('cartDetail', { cartId });
});


export default router;


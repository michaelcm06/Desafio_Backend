import path from 'path';
import express from 'express';
import {engine} from 'express-handlebars';
import {Server} from 'socket.io';
import conectarDB from './conexionDB.js'; // Importa la función de conexión
import messagesRouter from '../MongoDB/routes/messages.router.js'; // Importa el router de mensajes
import Message from '../../Dao/MongoDB/Model/messages.modelo.js';
import Product from '../../Dao/MongoDB/Model/products.modelo.js';
import {router as vistasRouter} from '../MongoDB/routes/view.router.js';
import Cart from '../../Dao/MongoDB/Model/carts.modelo.js';
import {fileURLToPath} from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;


const PORT = 3000;

const app = express();

let nextProductId = 1; // Inicializa el contador de IDs en 1

let listaDeProductos = [];

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '/public')));


//CHAT

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).render('chat');
});

//PRODUCTOS 

app.get('/home', async (req, res) => {
  try {
      listaDeProductos = await Product.find();
      res.render('home', {
          productos: listaDeProductos
      });
  } catch (error) {
      console.error('Error al cargar los productos desde la base de datos:', error);
      res.status(500).send('Error interno del servidor');
  }
});

app.get('/realTimeProducts', async (req, res) => {
  try {
      listaDeProductos = await Product.find();
      res.render('realTimeProducts', {
          productos: listaDeProductos
      });
  } catch (error) {
      console.error('Error al cargar los productos desde la base de datos:', error);
      res.status(500).send('Error interno del servidor');
  }
});

//CARGAR PRODUCTOS

// Rutas
app.use('/home', vistasRouter);

// Funciones para interactuar con la base de datos
async function cargarProductosDesdeDB() {
  try {
      listaDeProductos = await Product.find();
  } catch (error) {
      console.error('Error al cargar los productos desde la base de datos:', error);
  }
}

async function guardarProductoEnDB(nuevoProducto) {
  try {
    const product = new Product(nuevoProducto);
    await product.save();
  } catch (error) {
    console.error('Error al guardar el producto en la base de datos:', error);
  }
}

async function eliminarProductoEnDB(productoId) {
  try {
    await Product.findByIdAndDelete(productoId);
  } catch (error) {
    console.error('Error al eliminar el producto en la base de datos:', error);
  }
}

//CONECTAR DB
conectarDB();

// Rutas de mensajes

app.use('/messages', messagesRouter);


const server = app.listen(PORT, () => {
  console.log(`Server escuchando en puerto ${PORT}`);
});


let mensajes = [{
  emisor: 'Server',
  mensaje: 'Bienvenido al chat del curso Backend...!!!'
}];

let usuarios = [];

const io = new Server(server);

//CONECTAR SERVER

io.on('connection', socket => {
  console.log(`Se ha conectado un cliente con id ${socket.id}`);

  //MESSAGE

  socket.on('id', nombre => {
    console.log(nombre);

    usuarios.push({
      id: socket.id,
      nombre
    });

    socket.emit('bienvenida', mensajes);

    socket.broadcast.emit('nuevoUsuario', nombre);

  });

  socket.on('nuevoMensaje', async (mensaje) => {
    try {
      const nuevoMensaje = new Message(mensaje);
      await nuevoMensaje.save();
      io.emit('llegoMensaje', nuevoMensaje);
    } catch (error) {
      console.error('Error al guardar el mensaje en MongoDB:', error);
    }
  });


  //PRODUCTOS

  // Emitir la lista de productos al cliente cuando se conecta


  // Emitir la lista de productos al cliente cuando se conecta
  cargarProductosDesdeDB();

  socket.on('nuevoProducto', async (nuevoProducto) => {
    await guardarProductoEnDB(nuevoProducto);
    cargarProductosDesdeDB(); // Recargar la lista de productos después de agregar uno nuevo
    io.emit('productos', listaDeProductos);
  });

  socket.on('eliminarProducto', async (productoId) => {
    await eliminarProductoEnDB(productoId);
    cargarProductosDesdeDB(); // Recargar la lista de productos después de eliminar uno
    io.emit('productos', listaDeProductos);
  });

  //DESCONECTAR 

  socket.on('disconnect', () => {
    console.log(`se desconecto el cliente con id ${socket.id}`);
    let indice = usuarios.findIndex(usuario => usuario.id === socket.id);
    let usuario = usuarios[indice];
    io.emit('usuarioDesconectado', usuario);
    console.log(usuario);
    usuarios.splice(indice, 1);
  });
});

export { cargarProductosDesdeDB, guardarProductoEnDB, eliminarProductoEnDB };

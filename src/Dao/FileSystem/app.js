import __dirname from './utils.js';
import path from 'path';
import express from 'express';
import {engine} from 'express-handlebars';
import {router as vistasRouter} from './routes/view.router.js';
import {Server} from 'socket.io';
import fs from 'fs/promises';

const PORT = 3000;

const app = express();

let nextProductId = 1; // Inicializa el contador de IDs en 1

let listaDeProductos = [];


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
    res.render('home', {
        productos: listaDeProductos
    });
});

app.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts', {
        productos: listaDeProductos
    });
});

app.use('/', vistasRouter);

async function cargarProductosDesdeJSON() {
    try {
      const data = await fs.readFile('productos.json', 'utf-8');
      listaDeProductos = JSON.parse(data);
    } catch (error) {
      console.error('Error al leer el archivo productos.json:', error);
    }
  }
  
  async function guardarProductosEnJSON() {
    try {
      await fs.writeFile('productos.json', JSON.stringify(listaDeProductos), 'utf-8');
    } catch (error) {
      console.error('Error al escribir el archivo productos.json:', error);
    }
  }

const serverExpress = app.listen(PORT, () => {
    console.log(`Server escuchando en puerto ${PORT}`);

});
cargarProductosDesdeJSON();

const serverSocket = new Server(serverExpress);

serverSocket.on('connection', (socket) => {
    console.log(`Se ha conectado un cliente con id ${socket.id}`);

    // Emitir la lista de productos al cliente cuando se conecta
    cargarProductosDesdeJSON();

    socket.on('nuevoProducto', async (nuevoProducto) => {
        nuevoProducto.id = generateUniqueId("");
        listaDeProductos.push(nuevoProducto);
        serverSocket.emit('productos', listaDeProductos);
        await guardarProductosEnJSON();
      });

      socket.on('eliminarProducto', async (productoId) => {
        listaDeProductos = listaDeProductos.filter((producto) => producto.id !== productoId);
        serverSocket.emit('productos', listaDeProductos);
        await guardarProductosEnJSON();
      });

    // Manejar la desconexión del cliente
    socket.on('disconnect', () => {
        console.log(`Cliente desconectado con ID: ${socket.id}`);
    });
});

function generateUniqueId() {
    return `"${nextProductId++}"`; // Retorna el ID como una cadena con comillas dobles
}



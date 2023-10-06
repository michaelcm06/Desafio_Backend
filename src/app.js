import express from 'express';
import path from 'path';
import {engine} from 'express-handlebars';
import productsRoutes from './routes/productsRoutes.js';
import cartsRoutes from './routes/cartsRoutes.js';
import viewsRoutes from './routes/viewsRoutes.js';
import conectarDB from './conexionDB.js'; 
import {fileURLToPath} from 'url';
import { dirname } from 'path';
import session from 'express-session'
import ConnectMongo from 'connect-mongo'
import { router as sessionsRouter } from './routes/sessions.router.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;


const app = express();

// Configuración del motor de plantillas Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '/public')));


app.use(session({
  secret:'claveSecreta',
  resave:true, saveUninitialized:true,
  store: ConnectMongo.create({
      mongoUrl:'mongodb+srv://Michaelcm2000:Coder123@cluster0.arcaq42.mongodb.net/?retryWrites=true&w=majority&dbName=Tienda',
      ttl: 3600
  })
}))

// Rutas
app.use('/products', productsRoutes);
app.use('/sessions', sessionsRouter);
app.use('/carts', cartsRoutes);
app.use('/', viewsRoutes);

app.get('/carts', (req, res) => {
  res.render('carts'); 
});



// Puerto de escucha
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Conexión a la base de datos MongoDB
conectarDB();

import __dirname from './utils.js';
import path from 'path';
import express from 'express';
import {engine} from 'express-handlebars';
import { router as vistasRouter } from './routes/view.router.js';
import {Server} from 'socket.io'

const PORT=3000;

const app=express();

const listaDeProductos = [
    { id: 1, nombre: 'Producto 1', descripcion: 'Descripción del Producto 1', precio: 10.99 },
    { id: 2, nombre: 'Producto 2', descripcion: 'Descripción del Producto 2', precio: 19.99 },
    { id: 3, nombre: 'Producto 3', descripcion: 'Descripción del Producto 3', precio: 5.99 },
  ];


  app.engine('handlebars', engine());
  app.set('view engine', 'handlebars');
  app.set('views', path.join(__dirname,'/views'));
  
  app.use(express.json());
  app.use(express.urlencoded({extended:true}));
  
  app.use(express.static(path.join(__dirname,'/public')));
  
  app.get('/',(req,res)=>{
      
      res.setHeader('Content-Type','application/json');
      res.status(200).json(listaDeProductos);
  });
  
  app.get('/realTimeProducts',(req,res)=>{
      

  });
  
  app.use('/',vistasRouter)
  
  const serverExpress=app.listen(PORT,()=>{
      console.log(`Server escuchando en puerto ${PORT}`);
  });
  
  const serverSocket=new Server(serverExpress)
  
  serverSocket.on('connection',socket=>{
      console.log(`Se ha conectado un cliente con id ${socket.id}`)
  
  })


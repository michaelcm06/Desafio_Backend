import mongoose from 'mongoose';

const conectarDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://Michaelcm2000:Coder123@cluster0.arcaq42.mongodb.net/?retryWrites=true&w=majority', {
            dbName: 'Tienda',
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Base de datos conectada');
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
    }
}

export default conectarDB;
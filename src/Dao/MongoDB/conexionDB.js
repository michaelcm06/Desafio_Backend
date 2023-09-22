import mongoose from 'mongoose';

const conectarDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://Michaelcm2000:Coder123@cluster0.arcaq42.mongodb.net/?retryWrites=true&w=majority&dbName=messages', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('DB Conectada');
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
    }
}

export default conectarDB;

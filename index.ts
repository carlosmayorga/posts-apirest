import Server from './classes/server';
import userRoutes from './routes/usuario';
import postRoutes from './routes/post';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import fileupload from 'express-fileupload';
import cors from 'cors';
import { compareSync } from 'bcrypt';

const server = new Server();


// Middleware: Body Parser
server.app.use(bodyParser.urlencoded({extended:true}));
server.app.use(bodyParser.json());

// FileUpload
server.app.use(fileupload());

// Configurar CORSS
server.app.use(cors({origin: true, credentials: true}));

// Rutas de mi app
server.app.use('/user', userRoutes);
server.app.use('/post', postRoutes);

// Conectar DB
mongoose.connect('mongodb://localhost:27017/fotosgram', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, (error) => {
    
    if(error) throw error;
    console.log('Base de datos online');
});

// Levantar servidor Express
server.start(() => {
    console.log(`Servidor corriendo en puerto ${server.port}`);
});
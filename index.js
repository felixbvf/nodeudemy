//ES6
import express from 'express';
import morgan from 'morgan'; //middleware morgan permite ver las peticiones desde el navegador
import cors from 'cors'; //middleware cors permite conexiones a nuestro servidor desde otras clientes
import path from 'path'; //te da l direccion del proyecto
import mongoose from 'mongoose';
import router from './routes'; //importando rutas

//conexion a mongodb
mongoose.Promise = global.Promise;
const dbUrl = 'mongodb://admin:123@localhost:27017/dbsistema';
mongoose.connect(dbUrl, { useCreateIndex:true,useUnifiedTopology: true, useNewUrlParser: true })
    .then(mongoose => console.log('Conectado a la BD en el puerto 27017'))
    .catch(err => console.log(err));

const app = express();
app.use(morgan('dev'));  //modo dev morgan
app.use(cors());

app.use(express.json()); 
app.use(express.urlencoded({ extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api',router);












app.set('port', process.env.PORT || 3004);
app.listen(3003, () => {
    console.log('Server on port 3003');
    console.log(path.join(__dirname, 'public')); //probando path
});
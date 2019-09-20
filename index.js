//ES6
import express from 'express';
import morgan from 'morgan'; //middleware morgan permite ver las peticiones desde el navegador
import cors from 'cors'; //middleware cors permite conexiones a nuestro servidor desde otras clientes
import path from 'path'; //te da l direccion del proyecto



const app = express();
app.use(morgan('dev'));  //modo dev morgan
app.use(cors());

app.use(express.json()); 
app.use(express.urlencoded({ extended:true}));
app.use(express.static(path.join(__dirname, 'public')));


app.listen(3003, () => {
    console.log('Server on port 3003');
    console.log(path.join(__dirname, 'public')); //probando path
});
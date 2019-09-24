import models from '../models';
import bcrypt from 'bcryptjs';
import token from '../services/token';

export default {
    add: async (req, res, next) => {
        try {
            req.body.password = await bcrypt.hash(req.body.password,10); //encryptar password
            const reg = await models.Usuario.create(req.body);
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error al crear'
            });
            next(e);
        }
    },
    query: async (req, res, next) => {
        try {
            const reg = await models.Usuario.findOne({_id:req.query._id})
            if (!reg){
                res.status(404).send({
                    message: 'El registro no existe'
                });
            } else {
                res.status(200).json(reg);
            }
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error'
            });
            next(e);
        }
    },
    list: async (req,res,next) => {
        try {
            let valor = req.query.valor;
            const reg = await models.Usuario.find({});  //Busca toda la lista
            //const reg = await models.Usuario.find({},{createdAt:0,descripcion:0});  //busca toda la lista pero no te muestra createdAt y descripcion
            //const reg = await models.Usuario.find({},{nombre:1});  //Muestra solo el nombre
            //const reg = await models.Usuario.find({},{createdAt:0}).sort({'nombre': -1});  //Ordenar por nombre  descendente
            //const reg = await models.Usuario.find({},{createdAt:0}).sort({'nombre': 1});  //Ordenar por nombre  ascendente
            //const reg = await models.Usuario.find({'nombre':new RegExp(valor, 'i')},{createdAt:0}).sort({'createdAt': -1});  //Busca por el valor del parametro en el campo nombre y Ordenar por createdAt descendente
            //const reg = await models.Usuario.find({$or:[{'nombre':new RegExp(valor, 'i')},{'descripcion':new RegExp(valor, 'i')}]},{createdAt:0}).sort({'createdAt': -1});  //Busca por el valor del parametro en el campo nombre o descripcion y Ordenar por createdAt descendente
            res.status(200).json(reg);

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error'
            });
            next(e);
        }
    },
    update: async (req,res,next) => {
        try {
            let pas = req.body.password;
            const reg0 = await models.Usuario.findOne({_id:req.body._id});
            if (pas != reg0.password){ // si password que nos envia es diferente  de la BD entonces se encripta
                req.body.password = await bcrypt.hash(req.body.password,10);
            }
            const reg = await models.Usuario.findByIdAndUpdate({_id:req.body._id},{rol: req.body.rol, nombre:req.body.nombre,tipo_documento: req.body.tipo_documento, num_documento: req.body.num_documento, direccion: req.body.direccion, telefono: req.body.telefono, email: req.body.email, password: req.body.password })
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error'
            });
            next(e);
        }
    },
    remove: async (req,res,next) => {
        try {
            const reg =await models.Usuario.findByIdAndDelete({_id:req.body._id});
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error'
            });
            next(e);
        }
    },
    activate: async (req,res,next) => {
        try {
            const reg = await models.Usuario.findByIdAndUpdate({_id:req.body._id}, {estado:1});
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error'
            });
            next(e);
        }
    },
    deactivate: async (req,res,next) => {
        try {
            const reg = await models.Usuario.findByIdAndUpdate({_id:req.body._id}, {estado:0});
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error'
            });
            next(e);
        }
    },
    login: async (req,res,next) => {
        try {
            let user = await models.Usuario.findOne({email: req.body.email, estado: 1});
            if(user){
                //Existe un usuario con ese email
                let match = await bcrypt.compare(req.body.password, user.password);
                if (match){
                     //res.json('Password correcto');
                     let tokenReturn = await token.encode(user._id);
                     res.status(200).json({user,tokenReturn});
                } else {
                    res.status(404).send({
                        message: 'Password Incorrecto'
                    });
                }
            } else {
                res.status(404).send({
                    message: 'El usuario no existe'
                });
            }
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrio un error'
            });
            next(e);
        }
    }


}
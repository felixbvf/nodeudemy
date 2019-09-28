import jwt from 'jsonwebtoken';
import models from '../models';

async function checkToken(token) { // apartir de un token válido que ya expiro vuelve a generar otro token
    let __id = null;
    try {
        const {_id} = await jwt.decode(token);
        __id = _id;
    } catch (e) {
        return false;
    }
    const user = await models.Usuario.findOne({_id: __id, estado: 1});
    if(user){
        const token = jwt.sign({_id: __id}, 'clavesecretaparagenerartoken', {expiresIn: '1d'});
        return {token, rol:user.rol};
    } else {
        return false;
    }
}


export default {
    encode: async (_id,rol,email) => {    //codifica token
        const token = jwt.sign({_id: _id,rol:rol,email:email},'clavesecretaparagenerartoken',{expiresIn: '1d'})
        return token;
    },
    decode: async (token) => {  //decodifica token
        try {
            const {_id} = await jwt.verify(token, 'clavesecretaparagenerartoken');
            const user = await models.Usuario.findOne({_id, estado: 1});
            if(user){
                return user;
            } else {
                return false;
            }
        } catch (e) {
            const newToken = await checkToken(token);
            return newToken;
        }
    }
}
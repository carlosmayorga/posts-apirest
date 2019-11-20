import { Router, Request, Response } from "express";
import { Usuario } from "../models/usuario.model";
import bcrypt from 'bcrypt';
import Token from "../classes/token";
import { verifyToken } from "../middlewares/authentication";

const userRoutes = Router();

// Login
userRoutes.post('/login', (req: Request, res: Response) => {

    const body = req.body;

    Usuario.findOne({email: body.email}, (err, userDB) => {

        if (err) throw err;

        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario/Contraseña no son correctos'
            });
        }
        if (userDB.validatePassword(body.password)) {

            const userToken = Token.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });

            return res.json({
                ok: true,
                token: userToken
            });
        }
        return res.json({
            ok: false,
            mensaje: 'Usuario/Contraseña no son correctos'
        });

    });

});

// Create new User
userRoutes.post('/create', (req: Request, res: Response) => {

    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    };

    Usuario.create(user)
    .then(userDB => {
        const userToken = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });

        return res.json({
            ok: true,
            user: userToken
        });
    })
    .catch(err => {
        res.json({
            ok: false,
            err
        });
    });

});


userRoutes.post('/update', verifyToken, (req: any, res: Response) => {

    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email : req.body.email  || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar
    }

    Usuario.findByIdAndUpdate(req.usuario._id, user, {new: true}, 
        (err, userDB) => {
            if(err) throw err;

            if(!userDB){
                return res.json({
                    ok: false,
                    mensaje: 'Usuario no existe'
                });
            }

            const userToken = Token.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });

            return res.json({
                ok: true,
                token: userToken
            });
    });

});

// Obtener info y estado del usuario
userRoutes.get('/', verifyToken, (req:any, res: Response) => {

    const usuario = req.usuario;

    res.json({
        ok:true,
        usuario
    });

});

export default userRoutes;
import {Response, NextFunction} from 'express';
import Token from '../classes/token';

//TO DO: Use Request type in req
export const verifyToken = (req: any, res: Response, next: NextFunction) => {

    const userToken = req.get('x-token') || '';

    Token.verifyToken(userToken)
    .then((decoded: any) => {
        req.usuario = decoded.usuario;
        next();
    })
    .catch( err => {
        res.json({
            ok: false,
            mensaje: 'Token incorrecto'
        });
    })

}
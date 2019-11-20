import { Router, Response } from "express";
import {verifyToken} from '../middlewares/authentication';
import { Post } from "../models/post.model";
import { FileUpload } from "../interfaces/file-upload";
import FileSystem from "../classes/file-system";

const postRoutes = Router();
const fileSystem = new FileSystem();

// Obtener listado de post
postRoutes.get('/', verifyToken, async (req: any, res: Response) => {

    // Parametro opcional y si no llega asigna el valor 1
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip * 10;

    const post = await Post.find()
                           .sort({_id: -1})
                           .skip(skip)
                           .limit(10)
                           .populate('usuario','-password')
                           .exec();
    res.json({
        ok: true,
        pagina,
        post
    });

});



// Crear post
postRoutes.post('/', verifyToken, (req: any, res: Response) => {

    const body = req.body;
    body.usuario = req.usuario._id;

    const imagenes = fileSystem.moveImagesTempToPosts(req.usuario._id);
    body.imgs = imagenes;

    Post.create(body).then( async postDB => {
        await postDB.populate('usuario', '-password').execPopulate();

        res.json({
            ok: true,
            post: postDB
        });
    }).catch(err => {
        res.json(err);
    });

});


// Servicio para subir archivos
postRoutes.post('/upload', verifyToken, async (req: any, res: Response) => {

    if(!req.files){
        return res.status(400).json({
            ok: false,
            mensaje: 'Error no llego la imagen'
        });
    }

    const file: FileUpload = req.files.image;

    if(!file){
        return res.status(400).json({
            ok: false,
            mensaje: 'Error al buscar imagen en files.image'
        });
    }

    if (!file.mimetype.includes('image')){
        return res.status(400).json({
            ok: false,
            mensaje: 'Error, el parametro es image'
        });
    }

    await fileSystem.saveTemporalImage(file, req.usuario._id);

    res.json({
        ok: true,
        file: file.mimetype
    });

});

// Servicio para buscar una imagen
postRoutes.get('/imagen/:userid/:img', (req: any, res:Response) => {

    const userId = req.params.userid;
    const img = req.params.img;

    const pathImg = fileSystem.getImgUrl(userId,img);

    res.sendFile(pathImg);
});


export default postRoutes;
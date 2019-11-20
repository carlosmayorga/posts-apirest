import { FileUpload } from "../interfaces/file-upload";
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export default class FileSystem {

    constructor() {};

    saveTemporalImage( file: FileUpload, userId: string) {
        
        return new Promise((resolve, reject) => {

            // Crear carpetas
            const path = this.createUserDir(userId);
    
            // Nombre de la imagen
            const imageName = this.generateUniqueName(file.name);
            console.log('Nuevo nombre de imagen --> ' +imageName);
    
            // Mover imagen a la carpeta
            file.mv(`${path}/${imageName}`, (err: any) => {
                if(err){
                    reject(err);
                } else {
                    resolve();
                }
            });

        }); 
    }

    moveImagesTempToPosts(userId: string) {
        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathPost = path.resolve(__dirname, '../uploads/', userId, 'posts');

        if(!fs.existsSync(pathTemp)){
            return[];
        }
        if(!fs.existsSync(pathPost)){
            fs.mkdirSync(pathPost);
        }

        const tempImages = this.getImagesFromTemp(userId);
        tempImages.forEach(image => {
            fs.renameSync(`${pathTemp}/${image}`, `${pathPost}/${image}`);
        });

        return tempImages;

    }

    getImgUrl(userId: string, img: string) {
        const imgPath = path.resolve(__dirname, '../uploads', userId,'posts',img );

        const exists = fs.existsSync(imgPath);
        if (!exists) {
            return path.resolve(__dirname,'../assets/400x250.jpg');
        }
        return imgPath;
    }

    private generateUniqueName(originalName: string) {
        const imgName = originalName.split('.');
        const extension = imgName[imgName.length - 1];
        const uniqueId = uniqid();

        return `${uniqueId}.${extension}`;
    }

    private createUserDir(userId: string) {
        
        const userPath = path.resolve(__dirname, '../uploads/', userId);
        const userTempPath = userPath + '/temp';
        console.log('Path para uploads --> '+userPath);
        const existe = fs.existsSync(userPath);
        if (!existe) {
            fs.mkdirSync(userPath);
            fs.mkdirSync(userTempPath);
        }

        return userTempPath;
    }
    
    private getImagesFromTemp(userId: string) {
        const tempPath = path.resolve(__dirname, '../uploads/', userId, 'temp');
        return fs.readdirSync(tempPath) || [];
    }

}
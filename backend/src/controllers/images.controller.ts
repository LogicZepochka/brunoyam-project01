import { Request, Response } from "express";
import CreateLogger, { LogLevel } from "../etc/logger";
import path from 'path';
import fs from 'fs';
var mime = require('mime-types')

const log = CreateLogger("ImageController")

export default class ImagesController {

    constructor() {
        log("ImageController is created",LogLevel.Debug)
    }

    async sendFile(req: Request, res: Response) {
        
        try {
            let { id } = req.params
            const normalizedPath = path.normalize(id).replace(/^(\.\.[\/\\])+/, '');
            const imagePath = path.join(process.cwd(), 'uploads', normalizedPath);
            if(!fs.existsSync(imagePath)) {
                res.status(404).send('Image not found');
                return
            }
            const readStream = fs.createReadStream(imagePath);
            const mimeType = mime.lookup(imagePath);
            const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedMimes.includes(mimeType)) {
                return res.status(400).send('Invalid file type');
            }
            if(!mimeType) {
                log(`mimeType for '${imagePath}' is null`,LogLevel.Warning);
                res.status(404).send('Image not found');
                return
            }
            res.set('Content-Type', mimeType);
            readStream.pipe(res);

            readStream.on('error', (err) => {
                log(`Stream error:, ${err}`,LogLevel.Error);
                res.status(404).send('Image not found');
            });
        }
        catch(e) {
            log(`${e}`,LogLevel.Error)
            res.status(404).send('Image not found');
            return
        }
    }
}
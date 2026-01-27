import * as path from "path";
import FileExtensions from "./FileExtensions";
import * as fs from "fs";
import { v4 } from 'uuid';
import { promisify } from 'util';


export async function UploadImageUtil(file: any ): Promise<string> {
    if( !file ) {
        throw new Error('File majburiy maydon');
    }
    const ext = path.extname(file.originalname);

    if( !FileExtensions.imageExtensions.includes(ext) ) {
        throw new Error('Rasm yuklashingiz kerak');
    }

    if( file.size > 20 * 1024 * 1024  ) {
        throw new Error('Rasm hajmi juda katta');
    }

    const newFileName = v4()+ ext;

    const uploadPath = path.join(__dirname, '..','..', process.env.IMAGES_FOLDER_NAME , newFileName);
    const writeFile = promisify(fs.writeFile);
    await writeFile(uploadPath, file.buffer);

    return newFileName;
}
import * as path from "path";
import FileExtensions from "./FileExtensions";
import * as fs from "fs";
import { v4 } from 'uuid';
import { promisify } from 'util';
import {RequirementError} from "../core";


export class FileService {
   static async uploadImage(file: any ): Promise<string> {
        if( !file ) {
            throw new RequirementError('Rasm');
        }
        const ext = path.extname(file.originalname);

        if( !FileExtensions.imageExtensions.includes(ext) ) {
            throw new RequirementError('', 'Faqat rasmlar ruxsat berilgan');
        }

        if( file.size > 20 * 1024 * 1024  ) {
            throw new RequirementError('', 'Rasm hajmi juda katta');
        }

        const newFileName = v4()+ ext;

        const uploadPath = path.join(__dirname, '..','..', process.env.IMAGES_FOLDER_NAME , newFileName);
        const writeFile = promisify(fs.writeFile);
        await writeFile(uploadPath, file.buffer);

        return newFileName;
    }

    static async deleteImage(fileName: string ): Promise<boolean> {
        const filePath =path.join(__dirname, '..','..', process.env.IMAGES_FOLDER_NAME , fileName);
        let deleted = false;
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.log('Fayl topilmadi, o‘chirish shart emas');
            }

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log("File o'chirishda xatolik: ", err)
                } else {
                    console.log('Fayl muvaffaqiyatli o‘chirildi');
                    deleted = true;
                }
            });
        });
        return deleted;
    }
}


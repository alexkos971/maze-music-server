import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from "fs";
import * as path from "path"; 
import * as uuid from "uuid";

export type FileType = 'image' | 'audio';

@Injectable()
export class FilesService {
    
    private acceptable_files = {
        'audio': ['wav', 'mp3', 'flac'],
        'image': ['png', 'jpg', 'webp', 'svg']
    }

    private file_path = path.resolve(__dirname, '..', 'static');

    async saveFile(file: Express.Multer.File, type: FileType) : Promise<string> {
        try {
            if (!file) {
                throw new HttpException(`no_file`, HttpStatus.NO_CONTENT)   
            }
            
            let file_ext = file.originalname.split('.').pop();
            
            if (!this.acceptable_files[type].find(el => el == file_ext)) {
                throw new HttpException(`not_acceptable_file`, HttpStatus.NOT_ACCEPTABLE)   
            }

            let file_name = uuid.v4() + '.' + file_ext;

            if (!fs.existsSync(this.file_path)) {
                fs.mkdirSync(this.file_path, { recursive: true })
            }

            fs.writeFileSync(path.join(this.file_path, file_name), file.buffer);
            return file_name;

        } catch(e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
        }   
    }

    async removeFile(file_name : string): Promise<string> {
        try {
            if (!file_name) {
                throw new HttpException(`no_file`, HttpStatus.NO_CONTENT)
            }
            
            await fs.unlink(path.join(this.file_path, file_name), (err) => {
                if (err) {
                    throw new HttpException(`delete_error`, HttpStatus.INTERNAL_SERVER_ERROR)
                }
            });
            
            return file_name;
        } 
        catch(e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)            
        }
    }

    async replaceFile(file_name : string, file: Express.Multer.File, type: FileType): Promise<string> {
        try {
            await this.removeFile(file_name);

            let newFile = await this.saveFile(file, type);            
            return newFile;
        } 
        catch(e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)            
        }
    }
}

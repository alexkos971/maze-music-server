import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import * as admin from "firebase-admin";
import { ref, getStorage, deleteObject } from "firebase/storage";
import * as path from "path"; 
import * as uuid from "uuid";

export type FileType = 'image' | 'audio';

@Injectable()
export class FirebaseService {
    private readonly storage: admin.storage.Storage;

    private acceptable_files = {
        'audio': ['wav', 'mp3', 'flac'],
        'image': ['png', 'jpg', 'webp', 'svg']
    }
    
    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(path.resolve(__dirname, "../..", 'firebase-service-account.json')), 
            storageBucket: `gs://${process.env.FIREBASE_STORAGE_BUCKET}`
        });
        this.storage = admin.storage();   
    }

    getStorageInstance() : admin.storage.Storage {
        return this.storage;
    }

    getPublicUrl(file_name: string, type: FileType) : string {
        const storage = this.getStorageInstance();
        const bucket = storage.bucket()

        const file_url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(type + '/' + file_name)}?alt=media&token=${file_name}`;
        return file_url;
    }
    
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

            const storage = this.getStorageInstance();
            const bucket = storage.bucket()
            
            let fileUpload = bucket.file(`${type}/${file_name}`);        

            const stream = fileUpload.createWriteStream({
                metadata: {
                    contentType: file.mimetype
                }
            });

            return new Promise((resolve, reject) => {
                stream.on('error', err => {
                    reject(err);
                });

                stream.on('finish', () => {
                    resolve(file_name);
                });

                stream.end(file.buffer);
            })
        }
        catch(e) {
            throw new HttpException(e.message, e.status);
        }
    } 

    async removeFile(file_name: string, type: FileType) : Promise<string> {
        try {
            if (!file_name) {
                throw new HttpException(`no_file`, HttpStatus.NO_CONTENT)
            }
            
            const storage = this.getStorageInstance();
            const bucket = storage.bucket()
            
            let fileUpload = bucket.file(`${type}/${file_name}`);
            await fileUpload.delete();        
            return file_name;
        } 
        catch(e) {
            throw new HttpException(e.message, e.status)            
        }
    }

    async replaceFile(file_name : string,  file: Express.Multer.File, type: FileType): Promise<string> {
        try {
            await this.removeFile(file_name, type);

            let newFile = await this.saveFile(file, type);            
            return newFile;
        } 
        catch(e) {
            throw new HttpException(e.message, e.status)            
        }
    }
}


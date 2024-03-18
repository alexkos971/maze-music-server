import { HttpException, Injectable, HttpStatus } from "@nestjs/common";
import { User, UserDocument } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { FilesService } from "src/files/files.service";
import { Model } from "mongoose";

type GetUserOptions = {
    withPassword?: boolean
} | undefined;

@Injectable()
export class UsersService {
    constructor ( 
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private fileService: FilesService
    ) {}
    
    async createUser(userDto: CreateUserDto) {
        const newUser = await new this.userModel({
            ...userDto, 
            followers: 0,
            listenings: 0,
            playlists: [],
            albums: [],
            tracks: [],
            savedPlaylists: [],
            savedAlbums: [],
            savedTracks: [],
        });

        await newUser.save();
    
        let user = newUser.toObject();
        delete user.password;
        return user;
    }

    async updateUser(email : string, body: any, avatar: Express.Multer.File) {
        let user = await this.userModel.findOne({email: email});
        
        if (!user) {
            throw new HttpException('not_found', HttpStatus.NOT_FOUND);
        }

        if (avatar) {
            let newAvatar = user.avatar
                ? await this.fileService.replaceFile(user.avatar, avatar, 'image')                
                : await this.fileService.saveFile(avatar, 'image');
            
            if (newAvatar) {
                user.avatar = newAvatar;
            }
        }

        for (let key in body) {

            if (key == 'password' || key == 'email' || key == 'id') {
                continue;
            }

            if (
                (key == 'full_name' || key == 'description') 
                && typeof body[key] == 'string'
                && body[key].length !== 0
            ) {
                user[key] = body[key];
            }
        }
        
        await user.save();


        let sendUser = user.toObject();
        delete sendUser.password;
        return sendUser;
        
    }
 
    async getUsers() {
        return 'users';
    }

    async getUserBy(props, options : GetUserOptions  = {
        withPassword : false
    }) {
        let findUser = await this.userModel.findOne(props);
        
        if (!findUser) {
            return null;
        }

        let user = findUser.toObject();

        if (!options.withPassword) {
            delete user.password
        }
        
        return user;
    }
}
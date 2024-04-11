import { HttpException, Injectable, HttpStatus } from "@nestjs/common";
import { User, UserDocument } from "./schemas/user.schema";
import { SignUpUserDto } from "./dto/sign-up-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { FilesService } from "src/files/files.service";
import { Model, ObjectId } from "mongoose";

type GetUserOptions = {
    withPassword?: boolean,
    detail?: boolean,
    isProfile?: boolean
} | undefined;

@Injectable()
export class UsersService {
    constructor ( 
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private fileService: FilesService
    ) {}
    
    async createUser(userDto) {
        const newUser = await new this.userModel({
            ...userDto
        });

        await newUser.save();
    
        const { password, ...result } = newUser.toObject();

        return result;
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

            if (key == 'avatar' && body[key] == "null") {
                await this.fileService.removeFile(user.avatar);
                user.avatar = null;
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

        let {password, ...result} = user.toObject();
        return result;
        
    }
 
    async getUsers() {
        return await this.userModel.find({}, {
            password: 0,
            saved_tracks: 0,
            saved_playlists: 0,
            saved_artists: 0,
            saved_albums: 0
        });
    }

    async getUserBy(props, options : GetUserOptions  = {
        withPassword : false,
        detail: false,
        isProfile: false
    }) {
        try {
            let projection = { password: 0, saved_tracks: 0, saved_playlists: 0, saved_artists: 0, saved_albums: 0 };

            if (options.withPassword) {
                delete projection.password; 
            }
            
            if (options.isProfile) {
                delete projection.saved_albums;             
                delete projection.saved_artists;             
                delete projection.saved_playlists;             
                delete projection.saved_tracks;             
            }

            let user = await this.userModel.findOne(props, projection);        
            
            return user;
        }
        catch(e) {
            throw new HttpException(e, HttpStatus.BAD_REQUEST);
        }
    }

    async followUser(userId: ObjectId, followId: string) {
        try {
            let followUser = await this.userModel.findById(followId);
            
            if (!followUser) {
                throw new HttpException('no_follow_user', HttpStatus.BAD_REQUEST);
            }
            
            let user = await this.userModel.findById(userId);        
            let isSaved = user.saved_artists.map(user=>user.toString()).includes(followId);

            followUser.followers = isSaved ? followUser.followers - 1 : followUser.followers + 1;        
            await followUser.save();

            await this.userModel.findByIdAndUpdate(userId, {
                [isSaved ? "$pull" : "$push"]: {
                    saved_artists: followId
                }
            });

            return {
                followed: !isSaved
            };

        } catch(e) {
            console.log(e);
            throw new HttpException(e, HttpStatus.BAD_REQUEST)
        }
    }
}
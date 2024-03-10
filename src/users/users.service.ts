import { HttpException, Injectable, HttpStatus } from "@nestjs/common";
import { ObjectId } from "mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

type GetUserOptions = {
    withPassword?: boolean
} | undefined;

@Injectable()
export class UsersService {
    constructor ( @InjectModel(User.name) private userModel: Model<UserDocument>) {}
    
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
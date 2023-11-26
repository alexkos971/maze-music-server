import { Injectable } from "@nestjs/common";
import { User, UserDocument } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

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

        return newUser.save();
    }
 
    async getUsers() {
        return 'users';
    }

    async getUserBy(props) {
        const user = await this.userModel.findOne(props);
        return user;
    }
}
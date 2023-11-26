import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt/dist";
import { UsersService } from "src/users/users.service";
import { User } from "src/users/schemas/user.schema";

@Injectable()
export class AuthService {
    constructor (
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async register(userDto: CreateUserDto) {        
        
        if ( !userDto.email ) {
            throw new HttpException('email_is_required', HttpStatus.BAD_REQUEST);
        }  
        
        // User is exist
        const candidate = await this.usersService.getUserBy({email: userDto.email});
        if (candidate) {
            throw new HttpException('user_is_exist', HttpStatus.BAD_REQUEST);
        }

        if ( !userDto.password ) {
            throw new HttpException('passsword_is_required', HttpStatus.BAD_REQUEST);
        }

        if ( !userDto.name ) {
            throw new HttpException('name_is_required', HttpStatus.BAD_REQUEST);
        }

        const hashedPassword = await bcrypt.hash(userDto.password, 12);

        const newUser = await this.usersService.createUser({ ...userDto, password: hashedPassword });
        
        return this.generateToken(newUser);
    }

    async generateToken(user: User) {
        const payload = {email: user.email, id: user.id};

        return {
            token: this.jwtService.sign(payload)
        }
    }
}

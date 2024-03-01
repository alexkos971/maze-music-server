import { Injectable, HttpException, HttpStatus, UnauthorizedException } from "@nestjs/common";
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

    async signUp(userDto: CreateUserDto) {        
        // User is exist
        const candidate = await this.usersService.getUserBy({email: userDto.email});
        if (candidate) {
            throw new HttpException('user_is_exist', HttpStatus.BAD_REQUEST);
        }

        const hashedPassword = await bcrypt.hash(userDto.password, 12);

        const newUser = await this.usersService.createUser({ ...userDto, password: hashedPassword });
        
        return await this.generateToken(newUser);
    }

    async signIn(email: string, password: string) {
        const user = await this.validateUser(email, password);
        return await this.generateToken(user); 
    }

    async generateToken(user: User) {
        const payload = {email: user.email, id: user.id};

        return {
            token: this.jwtService.sign(payload)
        }
    }

    async validateUser(email: string, password: string) {
        if (!email || !password) {
            throw new UnauthorizedException({ statusCode: 401, message: 'Email or password is empty'});
        }

        const user = await this.usersService.getUserBy({email: email});

        if (!user) {
            throw new UnauthorizedException({ statusCode: 401, message: 'Email not found'});
        }

        const isPasswordEquals = await bcrypt.compare(password, user.password);
        
        if (!isPasswordEquals) {
            throw new UnauthorizedException({ statusCode: 401, message: 'Password incorrect' });
        }

        return user;
    }
}

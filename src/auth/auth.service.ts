import { Injectable, HttpException, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { SignUpUserDto } from "../users/dto/sign-up-user.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt/dist";
import { UsersService } from "src/users/users.service";
// import { MailService } from "src/mail/mail.service";
import { FilesService } from "src/files/files.service";

@Injectable()
export class AuthService {
    constructor (
        private usersService: UsersService,
        private jwtService: JwtService,
        // private mailService: MailService,
        private fileService: FilesService
    ) {}

    async signUp(body: SignUpUserDto, avatar: Express.Multer.File | null) {        
        try {
            // User is exist
            const candidate = await this.usersService.getUserBy({email: body.email});
            if (candidate) {
                throw new HttpException('user_is_exist', HttpStatus.BAD_REQUEST);
            }
    
            if (!body.password || body.password.length < 8) {
                throw new HttpException('password_wrong', HttpStatus.BAD_REQUEST);
            }
    
            const hashedPassword = await bcrypt.hash(body.password, 12);
    
            let avatar_path = avatar ? await this.fileService.saveFile(avatar, 'image') : null;
    
            let newUser = await this.usersService.createUser({ 
                ...body, 
                password: hashedPassword,
                avatar: avatar_path
            });        
    
            return {
                token: this.generateToken(newUser),
                user: newUser
            };
        }
        catch(e) {
            console.log('Auth.Service - 46', e);
            throw new HttpException('server_error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async signIn(email: string, password: string) {
        const user = await this.validateUser(email, password);

        return {
            token: this.generateToken(user),
            user: user
        };
    }

    generateToken(user) {
        const payload = { email: user.email, userId: user._id };
        return this.jwtService.sign(payload);
    }

    async validateUser(email: string, password: string) {
        if (!email || !password) {
            throw new UnauthorizedException({ statusCode: 401, message: 'Email or password is empty'});
        }

        const user = await this.usersService.getUserBy({'email': email}, { 
            withPassword: true
        });

        if (!user) {
            throw new UnauthorizedException({ statusCode: 401, message: 'Email not found'});
        }

        const isPasswordEquals = await bcrypt.compare(password, user.password);
        
        if (!isPasswordEquals) {
            throw new UnauthorizedException({ statusCode: 401, message: 'Password incorrect' });
        }

        delete user.password;

        return user;
    }
}

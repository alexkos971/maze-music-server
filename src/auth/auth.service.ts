import { Injectable, HttpException, HttpStatus, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt/dist";
import { UsersService } from "src/users/users.service";
// import { MailService } from "src/mail/mail.service";
import { OAuth2Client } from "google-auth-library";

import { SignUpUserDto, SignUpGoogleDto } from "./dto/sign-up-user.dto";
import { SignInUserDto } from "src/auth/dto/sign-in-user.dto";

@Injectable()
export class AuthService {
    private client: OAuth2Client;

    constructor (
        private usersService: UsersService,
        private jwtService: JwtService,
        // private mailService: MailService
    ) {
        this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    generateToken(user) {
        const payload = { email: user.email, userId: user._id };
        return this.jwtService.sign(payload);
    }

    async signUp(body: SignUpUserDto, avatar: Express.Multer.File | null) {        
        try {
            // User is exist
            const candidate = await this.usersService.getUserBy({email: body.email});
            if (candidate) {
                throw new HttpException('user_is_exist', HttpStatus.BAD_REQUEST);
            }
    
            if (!body.password || body.password.length < 8) {
                throw new HttpException('short_password', HttpStatus.BAD_REQUEST);
            }
           

            let hashedPassword = await bcrypt.hash(body.password, 12);             
    
            let { confirm_password, ...userData } = body;

            let newUser = await this.usersService.createUser({
                data: {
                    ...userData,
                    password: hashedPassword
                }, 
                avatar
            });        

            return {
                token: this.generateToken(newUser),
                user: newUser
            };
        }
        catch(e) {
            console.log(e);
            throw new HttpException(e.message, e.status);
        }
    }

    async signIn(body : SignInUserDto) {
        try {
            let { email, password } = body;

            if (!email || !password) {
                throw new HttpException('email_or_password_is_empty', HttpStatus.BAD_REQUEST);
            }

            const user = await this.usersService.getUserBy({'email': email}, { 
                withPassword: true
            });

            if (!user) {
                throw new HttpException('user_not_exist', HttpStatus.BAD_REQUEST);
            }

            const isPasswordEquals = await bcrypt.compare(password, user.password);
            
            if (!isPasswordEquals) {
                if ( user?.google_id?.length ) {
                    throw new HttpException('registered_with_google', HttpStatus.BAD_REQUEST);
                } else {
                    throw new HttpException('incorrect_password', HttpStatus.BAD_REQUEST);
                }
            }

            return {
                token: this.generateToken(user),
                user: user
            };
        }
        catch(e) {
            console.log(e);
            throw new HttpException(e.message, e.status);
        }
    }

    async verifyGoogleToken(token: string) {
        try {
            const ticket = await this.client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            
            const payload = ticket.getPayload();
            
            if (!payload ) {
                // 'Token is invalid'
                throw new HttpException('server_error', HttpStatus.BAD_REQUEST);
            }

            return {
                google_id: payload.sub,
                email: payload.email,
                full_name: payload.name,
                avatar: payload.picture
            };

        } catch(e) {
            console.log('/auth/auth.service/verifyGoogleToken', e);
            throw new HttpException(e.message, e.status);
        } 
    }

    async signInGoogle(token: string) {
        try {
            if (!token) {
                throw new HttpException('server_error', HttpStatus.BAD_REQUEST);
            }
            
            const verifiedUser = await this.verifyGoogleToken(token);                
            
            const user = await this.usersService.getUserBy({ 'email': verifiedUser.email});
            
            if (!user) {
                throw new HttpException('user_not_exist', HttpStatus.BAD_REQUEST);
            }

            return {
                token: this.generateToken(user),
                user: user
            };
        }
        catch(e) {
            throw new HttpException(e.message, e.status);
        }
    }

    async signUpGoogle(body: SignUpGoogleDto, avatar: Express.Multer.File | null) {
        try {

            if (!body.token) {
                // 'Token is empty'
                throw new HttpException('server_error',HttpStatus.BAD_REQUEST);
            }

            const verifiedUser = await this.verifyGoogleToken(body.token);                 

            // User is exist
            const candidate = await this.usersService.getUserBy({email: verifiedUser.email});
            if (candidate) {
                throw new HttpException('user_is_exist', HttpStatus.BAD_REQUEST);
            }

            let randomPassword = Math.random().toString(36).slice(-8);
            let hashedPassword = await bcrypt.hash(randomPassword, 12);
            
            let { token, ...userData } = body;

            let data = {
                ...userData,
                email: verifiedUser.email,
                full_name: verifiedUser.full_name,
                google_id: verifiedUser.google_id,
                password: hashedPassword
            }
            
            let newUser = await this.usersService.createUser({
                data, 
                avatar
            });        

            return {
                token: this.generateToken(newUser),
                user: newUser
            };
        }
        catch(e) {
            console.log(e);
            throw new HttpException(e.message, e.status);
        }
    }
}

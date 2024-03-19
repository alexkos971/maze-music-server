import { Controller, Post, Body, UsePipes, Get, Res, UseGuards, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from "express"
import { FileInterceptor } from '@nestjs/platform-express';
import { SessionInfo } from './session-info.decorator';
import { AuthService } from './auth.service';
import { CookieService } from './cookie.service';
import { User } from 'src/users/schemas/user.schema';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { ValidationPipe } from '../pipes/validation.pipe';

import { SignUpUserDto } from 'src/users/dto/sign-up-user.dto';
import { SignInUserDto } from 'src/users/dto/sign-in-user.dto';
import { GetSessionInfoDto } from 'src/users/dto/get-session-info.dto';
import { JwtAuthGuard } from './jwt.auth.guard';
import { UsersService } from 'src/users/users.service';

@ApiTags('Authorization')
@Controller('/api/auth')
export class AuthController {
    constructor ( 
        private authService: AuthService, 
        private cookieService: CookieService,
        private usersService: UsersService
    ) {}

    // Swagger
    @ApiOperation({ summary: 'User registration' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 200, type: User, description: 'Returns JWT-token'})
    
    // Settings
    @Post('/sign-up')
    @UsePipes(ValidationPipe)    
    @UseInterceptors(FileInterceptor('avatar'))
    async singUp(
        @Body() body: SignUpUserDto, 
        @UploadedFile() avatar,
        @Res({ passthrough: true }) res: Response 
    ) {
        const {user, token} = await this.authService.signUp(body, avatar);
        this.cookieService.setToken(res, token);                
        return user;
    }
    
    @ApiOperation({ summary: 'User login' })    
    @ApiResponse({ status: 200, type: User, description: 'Returns JWT-token'})
    @Post('/sign-in')
    async signIn( 
        @Body() body: SignInUserDto, 
        @Res({ passthrough: true }) res: Response
    ) {
        const {token, user} = await this.authService.signIn(body.email, body.password);

        this.cookieService.setToken(res, token); 
        return user;
    }


    @Post('/sign-out')
    @ApiOkResponse()
    @UseGuards(JwtAuthGuard)
    signOut(
        @Res({ passthrough: true }) res: Response
    ) {
        this.cookieService.removeToken(res)
    }
    
    @Get('/session')
    @ApiOkResponse({ type: GetSessionInfoDto })
    @UseGuards(JwtAuthGuard)
    async getSessionInfo(@SessionInfo() session: GetSessionInfoDto, res: Response) { 
        let user = await this.usersService.getUserBy({ 'email' : session.email});
    
        if (!user) {
            throw new HttpException('not_allowed', HttpStatus.NOT_FOUND);
        }

        return user;
    }

    // @Get('/verify-email')
    // @ApiOkResponse()
    // verifyEmail(@Param() param, res: Response ) {
    //     this.authService.verifyEmail(param.email);
    // }
}

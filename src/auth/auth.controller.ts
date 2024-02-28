import { Controller, Post, Body, UsePipes, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from "express"
import { SessionInfo } from './session-info.decorator';
import { AuthService } from './auth.service';
import { CookieService } from './cookie.service';
import { User } from 'src/users/schemas/user.schema';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '../pipes/validation.pipe';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SignInUserDto } from 'src/users/dto/sign-in-user.dto';
import { GetSessionInfoDto } from 'src/users/dto/get-session-info.dto';
import { JwtAuthGuard } from './jwt.auth.guard';

@ApiTags('Authorization')
@Controller('/api/auth')
export class AuthController {
    constructor(private authService: AuthService, private cookieService: CookieService) {}

    @ApiOperation({ summary: 'User registration' })
    @ApiResponse({ status: 200, type: User, description: 'Returns JWT-token'})
    @Post('/sign-up')
    @UsePipes(ValidationPipe)
    async singUp( 
        @Body() dto: CreateUserDto, 
        @Res({ passthrough: true }) res: Response 
    ) {
        const { token } = await this.authService.signUp(dto);
        this.cookieService.setToken(res, token);                
    }
    
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, type: User, description: 'Returns JWT-token'})
    @Post('/sign-in')
    async signIn( 
        @Body() body: SignInUserDto, 
        @Res({ passthrough: true }) res: Response
    ) {
        const { token } = await this.authService.signIn(body.email, body.password);
        this.cookieService.setToken(res, token); 
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
    getSessionInfo(@SessionInfo() session: GetSessionInfoDto) {
        return session;
    }
}

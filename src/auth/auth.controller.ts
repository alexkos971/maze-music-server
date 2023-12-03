import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/users/schemas/user.schema';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '../pipes/validation.pipe';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@ApiTags('Authorization')
@Controller('/api/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: 'User registration' })
    @ApiResponse({ status: 200, type: User, description: 'Returns JWT-token'})
    @Post('/register')
    @UsePipes(ValidationPipe)
    register( @Body() dto: CreateUserDto ) {
        return this.authService.register(dto);
    }
    
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, type: User, description: 'Returns JWT-token'})
    @Post('/login')
    login( @Body() dto ) {
        return this.authService.login(dto);
    }
}

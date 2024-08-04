import { Controller, Get, Put, UseGuards, Body, UseInterceptors, UploadedFile, Param, Response, HttpStatus } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "src/auth/jwt.auth.guard";
import { GetSessionInfoDto } from "../auth/dto/get-session-info.dto";
import { SessionInfo } from "src/auth/session-info.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetUserDto } from "./dto/get-user.dto";
import { FirebaseService } from "src/firebase/firebase.service";

@ApiTags('Users Endpoints')
@Controller('/api/users')
export class UsersController {
    constructor ( 
        private usersService: UsersService,
        private firebaseService: FirebaseService
        
    ) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAll() {
        return await this.usersService.getUsers();
    }            

    @Get('/profile')
    @UseGuards(JwtAuthGuard)
    async getProfile(@SessionInfo() session: GetSessionInfoDto) {
        try {
            console.log(this.firebaseService.getStorageInstance());

            return await this.usersService.getUserBy({ _id : session.userId}, {
                isProfile: true
            });
        } catch (e) {
            console.log(e);
        }
    }

    @Put('/update')
    @UseInterceptors(FileInterceptor('avatar'))
    @UseGuards(JwtAuthGuard)
    async updateUser(
        @SessionInfo() session: GetSessionInfoDto, 
        @Body() body: any,
        @UploadedFile() avatar: Express.Multer.File
    ) {
        return this.usersService.updateUser(session.email, body, avatar);
    }

    @Put('follow/:id')
    @UseGuards(JwtAuthGuard)
    async followUser(@SessionInfo() session: GetSessionInfoDto, @Param() param: any) {
        return this.usersService.followUser(session.userId, param.id);        
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get User By the Id' })
    @ApiResponse({ status: HttpStatus.OK, type: GetUserDto })
    @UseGuards(JwtAuthGuard)
    async getOne(@Param() params: Record<string, string> ) {
        return await this.usersService.getUserBy({ _id: params.id}, {
            withPassword: false,
            detail: true
        });
    }
}
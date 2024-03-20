import { Controller, Get, Put, UseGuards, Body, Session, UseInterceptors, UploadedFile, Param } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "src/auth/jwt.auth.guard";
import { GetSessionInfoDto } from "./dto/get-session-info.dto";
import { SessionInfo } from "src/auth/session-info.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Users')
@Controller('/api/users')
export class UsersController {
    constructor ( private usersService: UsersService ) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAll() {
        return await this.usersService.getUsers();
    }            

    @Get('/profile')
    @UseGuards(JwtAuthGuard)
    async getProfile(@SessionInfo() session: GetSessionInfoDto) {
        try {
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

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getOne(@Param() params: Record<string, string> ) {
        return await this.usersService.getUserBy({ _id: params.id}, {
            withPassword: false,
            detail: true
        });
    }
}
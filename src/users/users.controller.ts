import { Controller, Get, Post, UseGuards, UsePipes} from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "src/auth/jwt.auth.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { ValidationPipe } from "../pipes/validation.pipe";

@Controller('/api/users')
export class UsersController {
    constructor ( private usersService: UsersService ) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    getHello(): string {
        return `Hello - /api/users`;
    }

    @UsePipes(ValidationPipe)
    @Post('/create')
    createUser(userDto: CreateUserDto) {
        return this.usersService.createUser(userDto);
    }
    // @Get()
    // getAll(): string {
    //     return this.usersService.getUsers();
    // }

    // @Get(':id')
    // getOne(@Param() params: Record<string, string> ): string {
    //     return this.usersService.getUser(params['id']);
    // }
}
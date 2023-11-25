import { Controller, Get, Param } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
    constructor ( private usersService: UsersService ) {}

    @Get()
    getUsers(): string {
        return this.usersService.getUsers();
    }

    @Get(':id')
    getUserById(@Param() params: Record<string, string> ): string {
        return this.usersService.getUser(params['id']);
    }
}
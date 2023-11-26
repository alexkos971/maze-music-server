import { Controller, Get} from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller('/api/users')
export class UsersController {
    constructor ( private usersService: UsersService ) {}

    @Get()
    getHello(): string {
        return `Hello - /api/users`;
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
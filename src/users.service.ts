import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
    getUsers(): string {
        return 'users';
    }

    getUser( id: string ): string {
        return `user/:${id}`;
    }
}
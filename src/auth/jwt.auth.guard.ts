import { CanActivate, ExecutionContext, UnauthorizedException, Injectable } from "@nestjs/common";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { CookieService } from "./cookie.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor ( private jwtService: JwtService ) {}

    async canActivate( context: ExecutionContext ) {
        const req = context.switchToHttp().getRequest() as Request;

        try {
            const token = req.cookies[CookieService.tokenKey];

            if (!token) {
                throw new UnauthorizedException({ statusCode: 401, message: `Invalid Authorization: token is not set` });
            }

            const sessionInfo = await this.jwtService.verifyAsync(token);

            req['session'] = sessionInfo;
        } catch (e) {
            throw new UnauthorizedException({ statusCode: 501, message: `Unauthorized request - ${e}` });
        }

        return true;
    }
}
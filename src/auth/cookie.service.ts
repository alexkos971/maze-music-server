import { Injectable } from "@nestjs/common";
import { Response } from "express";

@Injectable()
export class CookieService {
    static tokenKey = 'token';

    setToken(res: Response, token: string) {
        res.cookie(CookieService.tokenKey, token, { 
            httpOnly: false, 
            maxAge: 24 * 60 * 60 * 1000,
            secure: true,
            sameSite: 'lax' 
        });
    }

    removeToken(res: Response) {
        res.clearCookie(CookieService.tokenKey);
    }
}
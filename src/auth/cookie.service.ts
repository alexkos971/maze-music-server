import { Injectable } from "@nestjs/common";
import { CookieOptions, Response } from "express";

@Injectable()
export class CookieService {
    static tokenKey = 'token';
    static cookieOptions : CookieOptions = { 
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,            
        secure: true,
        sameSite: "none" 
    };

    setToken(res: Response, token: string) {
        res.cookie(CookieService.tokenKey, token, CookieService.cookieOptions);
    }

    removeToken(res: Response) {
        res.clearCookie(CookieService.tokenKey, CookieService.cookieOptions);
    }
}
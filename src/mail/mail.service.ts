import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MailService {
    constructor (private mailService: MailerService) {}

    async sendEmailCode(user: string, code: string) {
        this.mailService.sendMail({
            to: user,
            subject: 'Maze Music - Confirm your email',
            template: './verify-email',
            context: {
                code: code
            }
        })
    }
}
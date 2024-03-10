import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { MailService } from "./mail.service";
import { join } from "path";
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: 'smtp.example.com',
                secure: false,
                auth: {
                    user: process.env.NODE_MAILER_USER,
                    pass: process.env.NODE_MAILER_PASSWORD,
                }
            },
            defaults: {
                from: '"No Reply" <noreply@example.com>',
            },  
            template: {
                dir: join(__dirname, 'templates'),
                adapter: new HandlebarsAdapter(),
                options: {
                  strict: true,
                },
            },
        })
    ],
    providers: [MailService],
    exports: [MailService]
})
export class MailModule {}
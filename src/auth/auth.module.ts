import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { MailModule } from 'src/mail/mail.module';
import { CookieService } from './cookie.service';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      global: true,
      signOptions: {
        expiresIn: '24h'
      }
    }),
    MailModule,
    FilesModule
  ],
  exports: [AuthService, JwtModule],
  controllers: [AuthController],
  providers: [AuthService, CookieService]
})
export class AuthModule {}

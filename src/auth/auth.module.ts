import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      global: true,
      signOptions: {
        expiresIn: '24h'
      }
    }),
    forwardRef(() => UsersModule)
  ],
  exports: [AuthService, JwtModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}

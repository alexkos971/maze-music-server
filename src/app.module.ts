import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TracksModule } from './tracks/tracks.module';
// import { MailModule } from './mail/mail.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from "path";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, 'static')
    }),
    MongooseModule.forRoot(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ewrgz.azure.mongodb.net/app?retryWrites=true&w=majority&appName=Cluster0`),
    // MailModule,
    AuthModule,
    UsersModule,
    FilesModule,
    TracksModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

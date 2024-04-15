import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TracksModule } from './tracks/tracks.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from "path";
// import { FirebaseService } from './firebase/firebase.service';
import { FirebaseModule } from './firebase/firebase.module';
import { PlaylistsModule } from './playlists/playlists.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '..', 'static')
    }),
    MongooseModule.forRoot(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ewrgz.azure.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=${process.env.DB_PROJECT_NAME}`),
    // MailModule,
    AuthModule,
    UsersModule,
    FilesModule,
    TracksModule,
    FirebaseModule,
    PlaylistsModule
  ],
  controllers: [],
  providers: [
    // FirebaseService
  ],
})
export class AppModule {}

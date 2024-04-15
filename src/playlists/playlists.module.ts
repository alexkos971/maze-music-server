import { Module } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Playlist, PlaylistSchema } from './schemas/playlist.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';

import { FilesModule } from 'src/files/files.module';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Playlist.name, schema: PlaylistSchema },
      { name: User.name, schema: UserSchema }
    ]),
    FilesModule,
    FirebaseModule
  ],
  providers: [PlaylistsService],
  controllers: [PlaylistsController]
})
export class PlaylistsModule {}

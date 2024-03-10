import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { Track } from 'src/track/schemas/track.schema';
import { Playlist } from 'src/playlist/schemas/playlist.schema';
import { Album } from 'src/playlist/schemas/album.schema';

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema()
export class User {
    
    @ApiProperty({ type: mongoose.Schema.Types.ObjectId, description: 'User ID'})
    @Prop()
    id: mongoose.Schema.Types.ObjectId;

    @ApiProperty({ required: true, description: 'User Name', example: 'John Doe' })
    @Prop({ required: true })
    full_name: string;
    
    @ApiProperty({ required: true, description: 'User Role', example: 'Listener' })
    @Prop({ required: true })
    role: string;
    
    @ApiProperty({ required: true, description: 'User Email', example: 'email@gmail.com' })
    @Prop({ required: true, unique: true })
    email: string;
    
    @ApiProperty({ required: true, description: 'User Password', example: '@p67/3@vT%' })
    @Prop({ required: true })
    password: string;

    @ApiProperty({description: 'Some user description', example: 'Some words about me'})
    @Prop()
    description: string | null;
    
    @ApiProperty({description: 'Count of user followers', example: 223444})
    @Prop()
    followers: number;   
    
    @ApiProperty({description: "Array of user playlist id's", example: [34234234, 235234532, 2345324]})
    @Prop({ type: [{type: mongoose.Schema.ObjectId, ref: 'Playlist'}] })
    playlists: Playlist[];
    
    @ApiProperty({description: "Array of user albums id's", example: [34234234, 235234532, 2345324]})
    @Prop({ type: [{type: mongoose.Schema.ObjectId, ref: 'Album'}] })
    albums: Album[];
    
    @ApiProperty({description: "Array of user tracks", example: [34234234, 235234532, 2345324]})
    @Prop({ type: [{type: mongoose.Schema.ObjectId, ref: 'Track'}] })
    tracks: Track[];
    
    @ApiProperty({description: "Users's avatar - path to file", example: 'http://example.com/static/647-4234-23.png'})
    @Prop()
    avatar: string;
    
    @ApiProperty({description: "Array of users's genres", example: ['Pop', 'Funk', 'Alternative']})
    @Prop()
    genres: string[];
    
    @ApiProperty({description: "Array of users's tracks", example: [3423233432, 45693278, 92647345]})
    @Prop({ type: [{type: mongoose.Schema.ObjectId, ref: 'Track' }] })
    savedTracks: Track[];
    
    @ApiProperty({description: "Array of users's saved playlists", example: [3423233432, 45693278, 92647345]})
    @Prop({ type: [{type: mongoose.Schema.ObjectId, ref: 'Playlist' }] })
    savedPlaylists: Playlist[];
    
    @ApiProperty({description: "Array of users's saved albums", example: [3423233432, 45693278, 92647345]})
    @Prop({ type: [{type: mongoose.Schema.ObjectId, ref: 'Album' }] })
    savedAlbums: Album[];
    
    @ApiProperty({description: "Array of users's saved artists", example: [3423233432, 45693278, 92647345]})
    @Prop({ type: [{type: mongoose.Schema.ObjectId, ref: 'User' }] })
    savedArtists: User[];    
    
    @ApiProperty({description: "Count of users's listenings every month", example: 3423233})
    @Prop()
    listenings: number;
    
}

export const UserSchema = SchemaFactory.createForClass(User);
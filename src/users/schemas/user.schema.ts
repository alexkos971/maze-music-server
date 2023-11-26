import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Track } from 'src/track/schemas/track.schema';
import { Playlist } from 'src/playlist/schemas/playlist.schema';
import { Album } from 'src/playlist/schemas/album.schema';

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema()
export class User {
    
    @Prop()
    id: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    name: string;
    
    @Prop({ required: true, unique: true })
    email: string;
    
    @Prop({ required: true })
    password: string;

    @Prop()
    description: string | null;
    
    @Prop()
    followers: number;   
     
    @Prop({ type: [{type: mongoose.Schema.ObjectId, ref: 'Playlist'}] })
    playlists: Playlist[];

    @Prop({ type: [{type: mongoose.Schema.ObjectId, ref: 'Album'}] })
    albums: Album[];
    
    @Prop({ type: [{type: mongoose.Schema.ObjectId, ref: 'Track'}] })
    tracks: Track[];

    @Prop()
    avatar: string;
    
    @Prop()
    genres: string[];

    @Prop({ type: [{type: mongoose.Schema.ObjectId, ref: 'Track' }] })
    savedTracks: Track[];

    @Prop({ type: [{type: mongoose.Schema.ObjectId, ref: 'Playlist' }] })
    savedPlaylists: Playlist[];

    @Prop({ type: [{type: mongoose.Schema.ObjectId, ref: 'Album' }] })
    savedAlbums: Album[];

    @Prop({ type: [{type: mongoose.Schema.ObjectId, ref: 'User' }] })
    savedArtists: User[];    

    @Prop()
    listenings: number;
    
}

export const UserSchema = SchemaFactory.createForClass(User);
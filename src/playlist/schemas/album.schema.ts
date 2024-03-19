import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Track } from 'src/tracks/schemas/track.schema';

export type AlbumDocument = mongoose.HydratedDocument<Album>;

@Schema()
export class Album {
    @Prop()
    id: string;
    
    @Prop()
    name: string;    
    
    @Prop()
    cover: string;
    
    @Prop({ type: { 
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
        name: { type: mongoose.Schema.Types.String, ref: 'User' } 
    }})
    artist: {
        id: User,
        name: User;
    };    
    
    @Prop({ type: mongoose.Schema.ObjectId, ref: 'Track' })
    tracks: Track[]
    
    @Prop()
    playedCount: number
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
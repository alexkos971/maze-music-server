import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { User } from 'src/users/schemas/user.schema';
export type PlaylistDocument = mongoose.HydratedDocument<Playlist>;

@Schema()
export class Playlist {
    @Prop()
    id: string;
    
    @Prop()
    name: string;    
    
    @Prop()
    cover: string;
    
    @Prop({ type: { 
        id: { type: mongoose.Schema.ObjectId, ref: 'User' }
    }})
    owner: {
        id: User,
        name: string;
    };         
    
    @Prop()
    playedCount: number
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);
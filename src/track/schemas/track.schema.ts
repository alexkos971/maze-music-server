import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type TrackDocument = HydratedDocument<Track>;

@Schema()
export class Track {
    @Prop()
    id: string;
    
    @Prop()
    name: string;
    
    @Prop()
    src: string;
    
    @Prop()
    cover: string;
    
    @Prop()
    artist: {
        id: string,
        name: string;
    };
    
    @Prop()
    album: null | {
        id: string,
        name: string;
    }
    
    @Prop()
    duration: number;
    
    @Prop()
    playedCount: number
}

export const TrackSchema = SchemaFactory.createForClass(Track);
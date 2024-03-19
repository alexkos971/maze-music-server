import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from "mongoose";
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type TrackDocument = HydratedDocument<Track>;

@Schema()
export class Track {
    @ApiProperty({ type: mongoose.Schema.Types.ObjectId, description: "Track's ID"})
    @Prop()
    id: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    name: string;
    
    @Prop({ required: true, unique: true })
    src: string;

    @Prop()
    genres: string[];
    
    @Prop({ required: true, unique: true })
    cover: string;
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    artist: mongoose.Schema.Types.ObjectId;
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Album' })
    album: null | mongoose.Schema.Types.ObjectId
    
    @Prop({ required: true, example: '2:42' })
    duration: string;
    
    @Prop()
    playedCount: number;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
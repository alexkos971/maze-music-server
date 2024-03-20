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

    @Prop({ type: Date, required: true, default: Date.now() })
    date: Date;
    
    @ApiProperty({ type: String, description: "Track's name"})
    @Prop({ required: true })
    name: string;
    
    @ApiProperty({ type: String, description: "Track's type (Single | Album)"})
    @Prop({ required: true })
    type: string;
    
    @ApiProperty({ type: String, description: "Track's src", example: 'ssd-45234rw-sdfadf3ef.wav'})
    @Prop({ required: true, unique: true })
    src: string;
    
    @ApiProperty({ type: Array, description: "Track's genres", example: ['Jazz', 'Funk']})
    @Prop([String])
    genres: string[];
    
    @ApiProperty({ type: String, description: "Track's cover", example: 'fdsfsdf-32sfds-2342-sdfsad.png'})
    @Prop({ required: false, unique: true })
    cover: string;
    
    @ApiProperty({ type: mongoose.Schema.Types.ObjectId, description: "Track's Artist ID"})
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    artist: mongoose.Schema.Types.ObjectId;
    
    @ApiProperty({ type: mongoose.Schema.Types.ObjectId, description: "Track's Album ID or null"})
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Album' })
    album: null | mongoose.Schema.Types.ObjectId
    
    @ApiProperty({ type: String, description: "Track's duration", example: '2:02'})
    @Prop({ required: true, example: '2:42' })
    duration: string;
    
    @ApiProperty({ type: String, description: "Track's played count", example: 103211})
    @Prop({ required: true, default: 0 })
    playedCount: number;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
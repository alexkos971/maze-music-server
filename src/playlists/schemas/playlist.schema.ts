import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';

import { Track } from "src/tracks/schemas/track.schema";
import { User } from "src/users/schemas/user.schema";

export type PlaylistDocument = mongoose.HydratedDocument<Playlist>;

@Schema()
export class Playlist {
    
    @ApiProperty({ type: mongoose.Schema.Types.ObjectId, description: 'Playlist ID'})
    @Prop()
    id: mongoose.Schema.Types.ObjectId;
    
    @Prop({ type: Date, required: true, default: Date.now() })
    @ApiProperty({ type: mongoose.Schema.Types.ObjectId, description: 'Playlist created date'})
    date: Date;

    @ApiProperty({ required: true, description: 'Playlist Name', example: 'Awesome tracks' })
    @Prop({ required: true })
    name: string;

    @ApiProperty({ required: false, description: 'Playlist descirption', example: 'There is cool tracks in this playlist' })
    @Prop({ required: false, default: null })
    description: string;
    
    @ApiProperty({ type: String, description: "Playlist cover", example: 'fdsfsdf-32sfds-2342-sdfsad.png'})
    @Prop({ required: false, unique: false })
    cover: string;

    @ApiProperty({ type: mongoose.Schema.Types.ObjectId, description: "Playlist Owner Id"})
    @Prop({ required: false, unique: false, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    owner: User;

    @ApiProperty({ type: Boolean, description: "Is the playlist public ?", example: false})
    @Prop({ required: false,  default: false })
    is_public: boolean;

    @ApiProperty({description: "Array of playlist tracks", example: [34234234, 235234532, 2345324]})
    @Prop({ type: [{type: mongoose.Schema.ObjectId, ref: 'Track'}], default: [] })
    tracks: Track[];
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);
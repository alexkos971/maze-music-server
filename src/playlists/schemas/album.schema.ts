import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';

import { Track } from "src/tracks/schemas/track.schema";
import { User } from "src/users/schemas/user.schema";

export type AlbumDocument = mongoose.HydratedDocument<Album>;

@Schema()
export class Album {
    
    @ApiProperty({ type: mongoose.Schema.Types.ObjectId, description: 'Album ID'})
    @Prop()
    id: mongoose.Schema.Types.ObjectId;
    
    @Prop({ type: Date, required: true, default: Date.now() })
    @ApiProperty({ type: mongoose.Schema.Types.ObjectId, description: 'Album created date'})
    date: Date;

    @ApiProperty({ required: true, description: 'Album Name', example: 'Awesome tracks' })
    @Prop({ required: true })
    name: string;

    @ApiProperty({ required: false, description: 'Album descirption', example: 'There is cool tracks in this album' })
    @Prop({ required: false, default: null })
    description: string;
    
    @ApiProperty({ type: String, description: "Album cover", example: 'fdsfsdf-32sfds-2342-sdfsad.png'})
    @Prop({ required: false, unique: false })
    cover: string;

    @ApiProperty({ type: mongoose.Schema.Types.ObjectId, description: "Album Author Id"})
    @Prop({ required: false, unique: false, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    author: User;

    @ApiProperty({description: "Array of album tracks", example: [34234234, 235234532, 2345324]})
    @Prop({ type: [{type: mongoose.Schema.ObjectId, ref: 'Track'}], default: [] })
    tracks: Track[];
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
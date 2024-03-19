import { IsString, IsArray } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import mongoose from "mongoose";

export class UploadTrackDto {

    @ApiProperty({ type: mongoose.Schema.Types.ObjectId, description: "Track's ID"})
    readonly userId: mongoose.Schema.Types.ObjectId

    @ApiProperty({ example: 'Cool Track' })
    @IsString({ message: 'Should be a string' })
    readonly name: string;
    
    @IsArray()
    @ApiProperty({ example: ['EDM', 'Jazz', 'Funk'] })
    readonly genres: string[];
    
    @ApiProperty({ example: '/static/yweriw-2345324-asdfad-4.png' })
    readonly cover: Express.Multer.File;
    
    @ApiProperty({ example: '/static/yweriw-2345324-asdfad-4.mp3' })
    readonly track: Express.Multer.File;
}
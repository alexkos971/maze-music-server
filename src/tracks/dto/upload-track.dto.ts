import { ApiProperty } from "@nestjs/swagger";
import mongoose from "mongoose";

export class UploadTrackDto {

    @ApiProperty({ example: "6612ee7cba2dcf83a81d2cce"})
    readonly userId: mongoose.Schema.Types.ObjectId

    @ApiProperty({ example: 'Cool Track' })
    readonly name: string;
    
    @ApiProperty({ example: ['EDM', 'Jazz', 'Funk'] })
    readonly genres: string[];
    
    @ApiProperty({ example: '/static/yweriw-2345324-asdfad-4.png' })
    readonly cover: Express.Multer.File;
    
    @ApiProperty({ example: '/static/yweriw-2345324-asdfad-4.mp3' })
    readonly track: Express.Multer.File;
}
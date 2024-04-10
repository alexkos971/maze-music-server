import { ApiProperty } from "@nestjs/swagger";
import * as mongoose from "mongoose"

export class GetTrackDto {
    @ApiProperty({ example: "6612ee7cba2dcf83a81d2cce" })
    readonly _id: mongoose.Schema.Types.ObjectId;

    @ApiProperty({ example: "2024-04-07T19:00:17.792Z" })
    readonly date: Date;

    @ApiProperty({ example: 'Single' })
    readonly type: "Single" | "Albums";
    
    @ApiProperty({ example: '/uploads/tracks/fgakhsdgf-526394-asdfad-34.webp' })
    readonly src: string;
    
    @ApiProperty({ example: ['Jazz', 'Indie'] })
    readonly genres: string[];

    @ApiProperty({ example: {
        _id: "6612ee7cba2dcf83a81d2cce",
        full_name: "John Doe",
        description: 'Some descriptions about artist',
        avatar: '/uploads/avatars/yweriw-2345324-asdfad-4.png'
    } })
    readonly artist: { full_name: string, avatar: string, description: null | string, _id: mongoose.Schema.Types.ObjectId};
    
    @ApiProperty({ example : {
        _id: "6612ee7cba2dcf83a81d2cce",
        name: "Cool ALbum",
        cover: '/uploads/avatars/yweriw-2345324-asdfad-4.png'
    }})
    readonly album: null | {
        _id: mongoose.Schema.Types.ObjectId,
        name: string,
        cover: string
    };
    
    @ApiProperty({ example: '/uploads/avatars/yweriw-2345324-asdfad-4.png' })
    readonly cover: string;

    @ApiProperty({ example: 12342523 })
    readonly duration: number;
    
    @ApiProperty({ example: 12342523 })
    readonly played_count: number;
    
    @ApiProperty({ example: 0 })
    readonly __v: number;
}
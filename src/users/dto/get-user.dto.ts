import { ApiProperty } from "@nestjs/swagger";
import * as mongoose from "mongoose"

export class GetUserDto {
    @ApiProperty({ example: "6612ee7cba2dcf83a81d2cce" })
    readonly _id: mongoose.Schema.Types.ObjectId;

    @ApiProperty({ example: "2024-04-07T19:00:17.792Z" })
    readonly date: Date;

    @ApiProperty({ example: 'John Doe' })
    readonly full_name: string;
    
    @ApiProperty({ example: 'Listener' })
    readonly role: "Listener" | "Artist";
    
    @ApiProperty({ example: 'test@mail.com' })
    readonly email: string;
    
    @ApiProperty()
    readonly description: string;
    
    @ApiProperty({ example: 12342523 })
    readonly followers: number;

    @ApiProperty({ example: 12342523 })
    readonly listenings: number;

    @ApiProperty({ example: ['6612ee7cba2dcf83a81d2cce'] })
    readonly playlists: mongoose.Schema.Types.ObjectId[];
    
    @ApiProperty({ example: ['6612ee7cba2dcf83a81d2cce'] })
    readonly albums: mongoose.Schema.Types.ObjectId[];
    
    @ApiProperty({ example: ['6612ee7cba2dcf83a81d2cce'] })
    readonly tracks: mongoose.Schema.Types.ObjectId[];
    
    @ApiProperty({ example: ['6612ee7cba2dcf83a81d2cce'] })
    readonly saved_playlists?: mongoose.Schema.Types.ObjectId[];
    
    @ApiProperty({ example: ['6612ee7cba2dcf83a81d2cce'] })
    readonly saved_albums?: mongoose.Schema.Types.ObjectId[];
    
    @ApiProperty({ example: ['6612ee7cba2dcf83a81d2cce'] })
    readonly saved_tracks?: mongoose.Schema.Types.ObjectId[];
    
    @ApiProperty({ example: ['6612ee7cba2dcf83a81d2cce'] })
    readonly saved_artists?: mongoose.Schema.Types.ObjectId[];
    
    @ApiProperty({ example: ['Jazz', 'Indie'] })
    readonly genres: string[];
    
    @ApiProperty({ example: '/uploads/avatars/yweriw-2345324-asdfad-4.png' })
    readonly avatar: string;
    
    @ApiProperty({ example: 0 })
    readonly __v: number;
}
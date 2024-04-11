import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdatePlaylistDto {
    @ApiProperty({ description: 'Playlist name', example: 'Cool Track' })
    @IsString()
    @IsOptional()
    readonly name: string;

    @ApiProperty({ description: 'Playlist descirption', example: 'There is cool tracks in this playlist' })
    @IsOptional()
    readonly description: string;
    
    @ApiProperty({ description: 'Playlist cover', example: '/static/yweriw-2345324-asdfad-4.png' })
    @IsOptional()    
    readonly cover: Express.Multer.File;
    
    @ApiProperty({ description: 'Is the playlist public', example: false })
    @IsBoolean()
    @IsOptional()
    readonly is_public: boolean;
}
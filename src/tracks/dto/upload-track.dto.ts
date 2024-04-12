import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UploadTrackDto {

    @ApiProperty({ example: 'Cool Track' })
    @IsString()
    readonly name: string;
    
    @ApiProperty({ example: 'EDM,Jazz,Funk' })
    @IsString()
    readonly genres: string;
    
    @ApiProperty({ example: '/static/yweriw-2345324-asdfad-4.png' })
    @IsOptional()
    readonly cover: Express.Multer.File;
    
    @ApiProperty({ example: '/static/yweriw-2345324-asdfad-4.mp3' })
    @IsOptional()
    readonly track: Express.Multer.File;
}
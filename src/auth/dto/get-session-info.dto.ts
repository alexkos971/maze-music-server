import { ApiProperty } from "@nestjs/swagger";
import mongoose from "mongoose";

export class GetSessionInfoDto {
    @ApiProperty({ example: 41341234213 })
    userId: mongoose.Schema.Types.ObjectId;

    @ApiProperty({ example: 'test@gmail.com' })
    email: string;

    @ApiProperty()
    iat: number;
    
    @ApiProperty()
    exp: number;
}
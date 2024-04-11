import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import * as mongoose from "mongoose";

export class AddOrRemoveFromPlaylistDto {
    @ApiProperty({ example: '6612ee7cba2dcf83a81d2cce', description: 'Id of track to remove/add' })
    // @IsString()
    @IsMongoId()
    readonly track_id: mongoose.Schema.Types.ObjectId;
}
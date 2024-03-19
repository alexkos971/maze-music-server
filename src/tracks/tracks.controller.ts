import { Controller, Post, UseGuards, Body, UploadedFile, UseInterceptors } from "@nestjs/common";
import { TracksService } from "./tracks.service";

import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Track } from "./schemas/track.schema";
import { JwtAuthGuard } from "src/auth/jwt.auth.guard";
import { SessionInfo } from "src/auth/session-info.decorator";
import { GetSessionInfoDto } from "src/users/dto/get-session-info.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";

@Controller('/api/tracks')
export class TracksController {
    constructor ( private tracksService: TracksService ) {}

    @ApiOperation({ summary: 'Track uploading' })    
    @ApiResponse({ status: 200, type: Track, description: 'Returns Track object'})
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileFieldsInterceptor([{ name: 'track', maxCount: 1 }, { name: 'cover', maxCount: 1 }]))
    @Post('/upload')
    uploadTrack(
        @SessionInfo() session: GetSessionInfoDto, 
        @Body() body: any,
        @UploadedFile() track: Express.Multer.File,
        @UploadedFile() cover: Express.Multer.File
    ) {
        console.log(session)
        return this.tracksService.uploadTrack({userId: session.userId, ...body, track, cover});
    }
}
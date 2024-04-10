import { Controller, Post, UseGuards, Body, UploadedFiles, UseInterceptors, Delete, Param, Response, HttpStatus, Get } from "@nestjs/common";
import { TracksService } from "./tracks.service";

import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Track } from "./schemas/track.schema";
import { JwtAuthGuard } from "src/auth/jwt.auth.guard";
import { SessionInfo } from "src/auth/session-info.decorator";
import { GetSessionInfoDto } from "src/auth/dto/get-session-info.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { UploadTrackDto } from "./dto/upload-track.dto";

@ApiTags('Tracks Endpoints')
@Controller('/api/tracks')
export class TracksController {
    constructor ( private tracksService: TracksService ) {}

    @ApiOperation({ summary: 'Get all tracks' })
    @ApiResponse({ status: 200, type: [Track], description: 'Returns All tracks objects'})
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() { 
        return this.tracksService.getAll();
    }

    @ApiOperation({ summary: 'Upload track' })    
    @ApiResponse({ status: 200, type: Track, description: 'Returns Track object'})
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'track', maxCount: 1 }, 
        { name: 'cover', maxCount: 1 }
    ]))
    @Post('/upload')
    async uploadTrack(
        @SessionInfo() session: GetSessionInfoDto, 
        @Body() body: UploadTrackDto,
        @UploadedFiles() files: {track?: Express.Multer.File[], cover?: Express.Multer.File[]}
    ) {
        return await this.tracksService.uploadTrack({
            ...body, 
            userId: session.userId, 
            track: files?.track?.length ? files?.track[0] : null, 
            cover: files?.cover?.length ? files?.cover[0] : null
        });
    }

    @ApiOperation({ summary: 'Delete track' })
    @ApiResponse({ status: 200, type: Track, description: 'Returns Track object'})
    @UseGuards(JwtAuthGuard)
    @Delete('/delete/:ID')
    async deleteTrack(@Param() param) {
        return await this.tracksService.deleteTrack(param.ID);
    }
}
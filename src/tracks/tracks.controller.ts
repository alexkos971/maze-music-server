import { Controller, Post, UseGuards, Body, UploadedFiles, UseInterceptors, Delete, Param, Response, HttpStatus, Get } from "@nestjs/common";
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
        @Body() body: any,
        @UploadedFiles() files: {track?: Express.Multer.File[], cover?: Express.Multer.File[]},
        @Response() res
    ) {
        let newTrack = await this.tracksService.uploadTrack({
            ...body, 
            userId: session.userId, 
            track: files?.track?.length ? files?.track[0] : null, 
            cover: files?.cover?.length ? files?.cover[0] : null
        });

        return res.status(HttpStatus.OK).json(newTrack);
    }

    @ApiOperation({ summary: 'Delete track' })
    @ApiResponse({ status: 200, type: Track, description: 'Returns Track object'})
    @UseGuards(JwtAuthGuard)
    @Delete('/delete/:ID')
    async deleteTrack(@Param() param, @Response() res) {
        const deletedTrack = await this.tracksService.deleteTrack(param.ID);
        return res.status(HttpStatus.OK).json(deletedTrack)
    }

    @ApiOperation({ summary: 'Get all tracks' })
    @ApiResponse({ status: 200, type: [Track], description: 'Returns All tracks objects'})
    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll(@Response() res) { 
        const tracks = await this.tracksService.getAll();
        return res.status(HttpStatus.OK).json(tracks);
    }
}
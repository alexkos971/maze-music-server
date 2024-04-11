import { Controller, Get, Post, Put, Param, Body, UseGuards, UseInterceptors, UploadedFile, UsePipes, Session, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { Playlist } from "./schemas/playlist.schema";
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { GetSessionInfoDto } from 'src/auth/dto/get-session-info.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { AddOrRemoveFromPlaylistDto } from './dto/add-or-remove-from-playlist.dto';

@ApiTags('Playlists Endpoints')
@Controller('/api/playlists')
export class PlaylistsController {
    constructor ( private playlistService: PlaylistsService) {}

    @ApiOperation({ summary: 'Get all paylists' })    
    @ApiResponse({ status: 200, type: [Playlist], description: 'Returns array of playlist object'})
    @Get('/')
    getAll() {
        return this.playlistService.getAll();
    }

    @ApiOperation({ summary: 'Get Paylist by ID' })    
    @ApiResponse({ status: 200, type: Playlist, description: 'Returns playlist object'})
    @Get('/:id')
    getById(@Param() params: any) {
        return this.playlistService.getPlaylist(params.id);
    }

    @ApiOperation({ summary: 'Create Playlist' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 200, type: Playlist, description: 'Returns new playlist object' })
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('cover'))
    @UsePipes(ValidationPipe)
    @Post('/create')
    createPlaylist(
        @SessionInfo() session: GetSessionInfoDto,
        @Body() body: CreatePlaylistDto,
        @UploadedFile() cover: Express.Multer.File
    ) {
        return this.playlistService.createPlaylist({
            ...body,
            cover,
            owner: session.userId,
        });
    }

    @ApiOperation({ summary: 'Update Playlist' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 200, type: Playlist, description: "Returns updated playlist object" })
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    @UseInterceptors(FileInterceptor('cover'))
    @Put('/:id/update')
    updatePlaylist(
        @Param() params: any,
        @SessionInfo() session: GetSessionInfoDto,
        @Body() body: UpdatePlaylistDto,
        @UploadedFile() cover: Express.Multer.File
    ) {
        return this.playlistService.updatePlaylist(params.id, session.userId, body, cover);
    }

    @ApiOperation({ summary: 'Save Playlist' })
    @ApiResponse({ status: 200, type: Playlist, description: "Returns saved playlist object" })
    @UseGuards(JwtAuthGuard)
    @Put('/:id/save')
    savePlaylist(
        @Param() params: any,
        @SessionInfo() session: GetSessionInfoDto
    ) {
        return this.playlistService.savePlaylist(params.id, session.userId);
    }
    
    @ApiOperation({ summary: 'Unsave Playlist' })
    @ApiResponse({ status: 200, type: Playlist, description: "Returns unsaved playlist object" })
    @UseGuards(JwtAuthGuard)
    @Put('/:id/unsave')
    unsavePlaylist(
        @Param() params: any,
        @SessionInfo() session: GetSessionInfoDto
    ) {
        return this.playlistService.unsavePlaylist(params.id, session.userId);
    }

    @ApiOperation({ summary: 'Adds track to playlist' })
    @ApiResponse({ status: 200, type: Playlist, description: "Returns updated playlist object" })
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    @Put('/:id/add-track')
    addToPlaylist(
        @Session() session: GetSessionInfoDto,
        @Param() params: Record<string, string>,
        @Body() body: AddOrRemoveFromPlaylistDto
    ) {
        return this.playlistService.addToPlaylist(params.id, session.userId, body.track_id);
    }

    @ApiOperation({ summary: 'Removes track to playlist' })
    @ApiResponse({ status: 200, type: Playlist, description: "Returns updated playlist object" })
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    @Put('/:id/remove-track')
    removeFromPlaylist(
        @Session() session: GetSessionInfoDto,
        @Param() params: Record<string, string>,
        @Body() body: AddOrRemoveFromPlaylistDto
    ) {
        return this.playlistService.removeFromPlaylist(params.id, session.userId, body.track_id);
    }

    @ApiOperation({ summary: 'Delete Playlist' })
    @ApiResponse({ status: 200, type: Playlist, description: "Returns deleted playlist object" })
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    @Delete('/:id/delete')
    deletePlaylist(
        @Param() params: any,
        @SessionInfo() session: GetSessionInfoDto
    ) {
        return this.playlistService.deletePlaylist(params.id, session.userId);
    }
}

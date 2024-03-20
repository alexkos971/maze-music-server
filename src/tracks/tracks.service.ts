import { Injectable, HttpStatus, HttpException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Track, TrackDocument } from "./schemas/track.schema";
import { UploadTrackDto } from "./dto/upload-track.dto";
import { FilesService } from "src/files/files.service";
import * as mm from "music-metadata";
import * as path from "path";
import { User, UserDocument } from "src/users/schemas/user.schema";

@Injectable()
export class TracksService {
    constructor (
        private fileService: FilesService,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    ) {}    

    async getDuration (src : string) : Promise<string> {
        if (!src) return null;

        let metadata = await mm.parseFile(src);

        if (metadata && metadata.format && metadata.format.duration && metadata.format.duration > 0) {
            let s = metadata.format.duration;
            return (s - (s %= 60)) / 60 + (10 < s ? ':' : ':0') + ~~(s);
        }

        return '0:00';
    }

    async uploadTrack(props : UploadTrackDto) {
        try {
            let { userId, genres, name, track, cover } = props;
    
            if (!track) throw new HttpException('no_track', HttpStatus.BAD_REQUEST);
                    
            if (!genres?.length) throw new HttpException('no_genres', HttpStatus.BAD_REQUEST);
            
            if (!name) throw new HttpException('no_name', HttpStatus.BAD_REQUEST);
    
            let trackSrc = await this.fileService.saveFile(track, 'audio');
            let duration = await this.getDuration(path.resolve(__dirname, '..', 'static', trackSrc));
            
            let coverSrc = cover ? await this.fileService.saveFile(cover, 'image') : null;
    
            let newTrack = await new this.trackModel({
                name,
                src: trackSrc,
                cover: coverSrc,
                duration: duration, 
                genres: genres,
                artist: userId,
                type: 'single',
                album: null,
                playedCount: 0
            });
    
            await newTrack.save();        
            // await newTrack.save(async (err, data) => {
            //     data.id
            // });        

            // let author = await this.userModel.findById(userId);
            // author.tracks.push(newTrack.id);
            // await author.save();

            return newTrack.toObject();
        }
        catch(e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
        }
        
    }

    async deleteTrack(trackId: string) {
        try {
            if (!trackId?.length) {
                throw new HttpException('bad_request', HttpStatus.BAD_REQUEST)
            }
    
            let track = await this.trackModel.findById(trackId);
    
            if (!track) {
                throw new NotFoundException('bad_request', {
                    cause: new Error(), 
                    description: 'Track not found'
                });
            }

            await this.fileService.removeFile(track.src);

            if (track.cover) {
                await this.fileService.removeFile(track.cover);
            }

            await this.userModel.updateOne({ id: track.artist }, {
                $pullAll: {
                    tracks: [{_id: trackId}],
                },
            });

            await this.trackModel.deleteOne({ _id: trackId });

            return track.toObject();
        } catch(e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }        
    }

    async getAll() {
        let tracks = await this.trackModel.find().populate({ path: 'artist', select: '_id full_name avatar description'});
        return tracks;
    }
}
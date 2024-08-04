import { Injectable, HttpStatus, HttpException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Track, TrackDocument } from "./schemas/track.schema";
import * as mm from "music-metadata-browser";
import { User, UserDocument } from "src/users/schemas/user.schema";
import { FirebaseService } from "src/firebase/firebase.service";

@Injectable()
export class TracksService {
    constructor (
        private firebaseService: FirebaseService,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    ) {}    

    async getDuration (src : string) : Promise<number> {
        if (!src) return null;

        let metadata = await mm.fetchFromUrl(src);

        if (metadata && metadata.format && metadata.format.duration && metadata.format.duration > 0) {
            let s = metadata.format.duration;
            return s;
        }

        return 0;
    }

    extendTrackUrl(track: TrackDocument) {        
        return {
            ...track.toObject(),
            cover: track.cover ? this.firebaseService.getPublicUrl(track.cover, 'image') : track.cover,
            src: this.firebaseService.getPublicUrl(track.src, 'audio')
        };
    }

    async getAll() {
        try {
            // Populate - extend field with giver params
            let tracks = await this.trackModel.find().populate({ path: 'artist', select: '_id full_name avatar description'});
        
            let trackWithFullPath = tracks.map(item => this.extendTrackUrl(item));

            return trackWithFullPath;
        }
        catch(e) {
            throw new HttpException(e.message, e.status);
        }
    }

    async getSavedTracks(userId) {
        try {
            let user = await this.userModel.findById(userId);
            if (!user) {
                throw new HttpException('user_not_found', HttpStatus.NOT_FOUND);
            }

            let tracks = await this.trackModel.find({
                '_id': { $in: user.saved_tracks }
            }).populate({ path: 'artist', select: '_id full_name avatar description'});

            return tracks.map(item => this.extendTrackUrl(item));

        } catch (e) {
            throw new HttpException(e.message, e.status);
        }
    }

    async uploadTrack(props) {
        try {
            let { userId, genres, name, track, cover } = props;
    
            if (!track) throw new HttpException('no_track', HttpStatus.BAD_REQUEST);
                    
            genres = genres.split(',');
            if (!genres?.length) throw new HttpException('no_genres', HttpStatus.BAD_REQUEST);
            
            if (!name) throw new HttpException('no_name', HttpStatus.BAD_REQUEST);
    
            let trackSrc = await this.firebaseService.saveFile(track, 'audio');

            const trackUrl = this.firebaseService.getPublicUrl(trackSrc, 'audio');

            let duration = await this.getDuration(trackUrl);
            
            let coverSrc = cover ? await this.firebaseService.saveFile(cover, 'image') : null;

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
    
            await newTrack.save()
                .then(async (track) => {
                     await this.userModel.findByIdAndUpdate(userId, {
                        $push: {
                            tracks: track._id
                        }
                    });
                    
                });                


            if (newTrack.cover) {
                newTrack.cover = this.firebaseService.getPublicUrl(newTrack.cover, 'image');
            }

            newTrack.src = trackUrl;

            return newTrack.toObject();
        }
        catch(e) {
            throw new HttpException(e.message, e.status)
        }
        
    }

    async saveTrack(id, userId) {
        try {
            let is_saved =  await this.userModel.findOneAndUpdate({
                _id: userId,
                'saved_tracks': { $ne: id }
            }, {
                $addToSet: { 
                    saved_tracks: id
                }
            });

            return {
                is_saved: Boolean(is_saved)
            }


        } catch (e) {
            throw new HttpException(e.message, e.status);
        }
    }

    async unsaveTrack(id, userId) {
        try {
            let is_saved =  await this.userModel.findOneAndUpdate({
                _id: userId,
            }, {
                $pull: { 
                    saved_tracks: id
                }
            });

            return {
                is_saved: !Boolean(is_saved)
            }

        } catch (e) {
            throw new HttpException(e.message, e.status);
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

            await this.firebaseService.removeFile(track.src, 'audio');

            if (track.cover) {
                await this.firebaseService.removeFile(track.cover, 'image');
            }

            await this.userModel.findByIdAndUpdate(track.artist, {
                $pull: {
                    tracks: trackId
                }
            });

            await this.trackModel.deleteOne({ _id: trackId });

            if (track.cover) {
                track.cover = this.firebaseService.getPublicUrl(track.cover, 'image');
            }
            track.src = this.firebaseService.getPublicUrl(track.src, 'audio');

            return track.toObject();
        } catch(e) {
            throw new HttpException(e.message, e.status);
        }        
    }
}
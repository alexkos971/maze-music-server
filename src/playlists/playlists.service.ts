import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Playlist, PlaylistDocument } from './schemas/playlist.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class PlaylistsService {
    constructor(
        @InjectModel(Playlist.name) private playlistModel: Model<PlaylistDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private firebaseService: FirebaseService     
    ) {}

    async getAll() {
        try {
            return await this.playlistModel.find();
        }
        catch(e) {
            throw new HttpException(e.message, e.status);   
        }
    }

    async getPlaylist(id, ownerId = undefined) {
        try {
            let playlist = await this.playlistModel.findById(id);
            
            if (!playlist) {
                throw new HttpException('playlist_not_found', HttpStatus.NOT_FOUND);
            }
            

            if (ownerId && playlist.owner != ownerId) {
                throw new HttpException('forbidden', HttpStatus.FORBIDDEN);
            }

            return playlist;
        }
        catch(e) {
            console.log(e);
            throw new HttpException(e.message, e.status);
        }
    }

    async createPlaylist(props) {
        try {
            let { name, cover, is_public, description, owner } = props;

            let cover_src = cover ? await this.firebaseService.saveFile(cover, 'image') : null;

            let newPlaylist = new this.playlistModel({
                name, 
                owner,
                is_public, 
                description,
                cover: cover_src, 
            });

            await newPlaylist.save();

            if (newPlaylist.cover) {
                newPlaylist.cover = this.firebaseService.getPublicUrl(newPlaylist.cover, 'image');
            }

            return newPlaylist;
        }

        catch(e) {
            console.log(e);
            throw new HttpException('server_error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updatePlaylist(id, userId, body, cover) {
        try {
            let playlist = await this.getPlaylist(id, userId);

            if (cover) {
            
                let newCover = playlist.cover
                    ? await this.firebaseService.replaceFile(playlist.cover, cover, 'image')                
                    : await this.firebaseService.saveFile(cover, 'image');
                
                if (newCover) {
                    playlist.cover = newCover;
                }
            }

            for (let key in body) {
    
                if (key == 'cover' && body[key] == "null") {
                    await this.firebaseService.removeFile(playlist.cover, 'image');
                    playlist.cover = null;
                }

                else {
                    playlist[key] = body[key];
                }
            }
            
            await playlist.save();
            
            if (playlist.cover) {
                playlist.cover = this.firebaseService.getPublicUrl(playlist.cover, 'image');
            }
            
            return playlist;
        }

        catch(e) {
            throw new HttpException(e.message, e.status);
        }
    }

    async savePlaylist(id, userId) {
        try {
            let is_saved =  await this.userModel.findOneAndUpdate({
                _id: userId,
                'saved_playlists': { $ne: id }
            }, {
                $addToSet: { 
                    saved_playlists: id
                }
            });

            return {
                is_saved: Boolean(is_saved)
            }


        } catch (e) {
            throw new HttpException(e.message, e.status);
        }
    }

    async unsavePlaylist(id, userId) {
        try {
            let is_unsaved =  await this.userModel.findOneAndUpdate({
                _id: userId,
            }, {
                $pull: { 
                    saved_playlists: id
                }
            });

            return {
                is_unsaved: Boolean(is_unsaved)
            }

        } catch (e) {
            throw new HttpException(e.message, e.status);
        }
    }

    async addToPlaylist(id, ownerId, track_id) {
        try {
            let is_added =  await this.playlistModel.findOneAndUpdate({
                _id: id,
                owner: ownerId,
                'tracks': { $ne: track_id }
            }, {
                $addToSet: { 
                    tracks: track_id
                }
            });

            return {
                is_added: Boolean(is_added)
            }
        }
        catch(e) {
            throw new HttpException(e.message, e.status);
        }
    }
    
    async removeFromPlaylist(id, ownerId, track_id) {
        try {
            let is_removed =  await this.playlistModel.findOneAndUpdate({
                _id: id,
                owner: ownerId
            }, {
                $pull: { 
                    tracks: track_id
                }
            });

            return {
                is_removed: Boolean(is_removed)
            }
        }
        catch(e) {
            throw new HttpException(e.message, e.status);
        }
    }

    async deletePlaylist(id, userId) {
        try {
            let playlist = await this.getPlaylist(id, userId);
    
            if (playlist.cover) {
                await this.firebaseService.removeFile(playlist.cover, 'image');
            }
    
            let deletedPlaylist = await this.playlistModel.deleteOne({_id: id, owner: userId});
            return deletedPlaylist;
        }
        catch(e) {
            throw new HttpException(e.message, e.status);
        }
    }
}

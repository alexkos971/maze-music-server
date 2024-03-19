import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Track, TrackDocument } from "./schemas/track.schema";
import { UploadTrackDto } from "./dto/upload-track.dto";


// @Injectable()
export class TracksService {
    constructor (
        @InjectModel(Track.name) private userModel: Model<TrackDocument>,
    ) {}

    async uploadTrack(props : UploadTrackDto) {
        let { userId, genres, name, track, cover } = props;
        console.log(userId, genres, name)
    }
}
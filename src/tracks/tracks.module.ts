import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Track, TrackSchema } from "./schemas/track.schema";
import { TracksService } from "./tracks.service";
import { TracksController } from "./tracks.controller";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Track.name, schema: TrackSchema}
        ]),
    ],
    providers: [TracksService],
    controllers: [TracksController]
})
export class TracksModule {}
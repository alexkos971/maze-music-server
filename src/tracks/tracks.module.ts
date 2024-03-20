import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Track, TrackSchema } from "./schemas/track.schema";
import { User, UserSchema } from "src/users/schemas/user.schema";
import { TracksService } from "./tracks.service";
import { TracksController } from "./tracks.controller";
import { FilesModule } from "src/files/files.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Track.name, schema: TrackSchema},
            {name: User.name, schema: UserSchema}
        ]),
        FilesModule
    ],
    providers: [TracksService],
    controllers: [TracksController]
})
export class TracksModule {}
import { Module, forwardRef } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { AuthModule } from "src/auth/auth.module";
import { FilesModule } from "src/files/files.module";

@Module({
    imports: [
        forwardRef(() => AuthModule),        
        MongooseModule.forFeature([
            {name: User.name, schema: UserSchema}
        ]),
        FilesModule
    ],
    exports: [UsersService],
    controllers: [ UsersController],
    providers: [UsersService]
})
export class UsersModule {}
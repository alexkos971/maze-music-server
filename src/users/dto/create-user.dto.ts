import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty()
    readonly name;

    @ApiProperty()
    readonly email;
    
    @ApiProperty()
    readonly password;
    
    @ApiProperty()
    readonly description;
    
    @ApiProperty()
    readonly genres;
    
    @ApiProperty()
    readonly avatar;
}
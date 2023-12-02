import { IsString, IsEmail, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty()
    @IsString({ message: 'Should be a string' })
    readonly name;
    
    @IsString({ message: 'Should be a string' })
    @ApiProperty()
    @IsEmail({}, { message: 'Email is not correct' })
    readonly email;
    
    @IsString({ message: 'Should be a string' })
    @Length(8, null, { message: 'Minimum characters length - 8 symbols' })
    @ApiProperty()
    readonly password;
    
    @IsString({ message: 'Should be a string' })
    @ApiProperty()
    readonly description;
    
    @ApiProperty()
    readonly genres;
    
    @ApiProperty()
    readonly avatar;
}
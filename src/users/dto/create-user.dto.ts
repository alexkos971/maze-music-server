import { IsString, IsEmail, Length, IsOptional, IsArray } from "class-validator";
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
    @Length(8, undefined, { message: 'Minimum characters length - 8 symbols' })
    @ApiProperty()
    readonly password;
    
    @IsString({ message: 'Should be a string' })
    @IsOptional()
    @ApiProperty()
    readonly description;
    
    @IsOptional()
    @IsArray()
    @ApiProperty()
    readonly genres;
    
    @IsOptional()
    @ApiProperty()
    readonly avatar;
}
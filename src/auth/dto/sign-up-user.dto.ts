import { IsString, IsEmail, Length, IsOptional, IsArray } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignUpUserDto {
    @ApiProperty({ example: 'Listener' })
    @IsString({ message: 'Should be a string' })
    readonly role: string;

    @ApiProperty()
    @IsString({ message: 'Should be a string' })
    readonly full_name: string;
    
    @IsString({ message: 'Should be a string' })
    @ApiProperty({ example: 'test@mail.com' })
    @IsEmail({}, { message: 'Email is not correct' })
    readonly email: string;
    
    @IsString({ message: 'Should be a string' })
    @Length(8, undefined, { message: 'Minimum characters length - 8 symbols' })
    @ApiProperty({ example: '1234qwer' })
    readonly password: string;

    @IsString({ message: 'Should be a string' })
    @Length(8, undefined, { message: 'Minimum characters length - 8 symbols' })
    @ApiProperty({ example: '1234qwer' })
    readonly confirm_password: string;
    
    @IsString({ message: 'Should be a string' })
    @IsOptional()
    @ApiProperty()
    readonly description: string;
    
    @IsOptional()
    @IsArray()
    @ApiProperty()
    readonly genres: string[];
}

export class SignUpGoogleDto {
    @ApiProperty({ example: 'Listener' })
    @IsString({ message: 'Should be a string' })
    readonly role: string;
    
    @IsString({ message: 'Should be a string' })
    @IsOptional()
    @ApiProperty()
    readonly description: string;

    @IsString({ message: 'Should be a string' })
    @ApiProperty({ example: 'yesdf9349fd.34573wte6tsfs', description: 'google access_token' })
    readonly token: string;
    
    @IsOptional()
    @IsArray()
    @ApiProperty()
    readonly genres: string[];
}
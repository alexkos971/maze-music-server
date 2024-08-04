import { IsString, IsEmail, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignInUserDto {
    @IsString({ message: 'Should be a string' })
    @ApiProperty({ example: 'test@mail.com' })
    @IsEmail({}, { message: 'Email is not correct' })
    readonly email: string;
    
    @IsString({ message: 'Should be a string' })
    @Length(8, undefined, { message: 'Minimum characters length - 8 symbols' })
    @ApiProperty({ example: '1234qwer' })
    readonly password: string;    
}
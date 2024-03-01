import { ApiProperty } from "@nestjs/swagger";

export class GetSessionInfoDto {
    @ApiProperty({ example: 41341234213 })
    id: number;

    @ApiProperty({ example: 'test@gmail.com' })
    email: string;

    @ApiProperty()
    iat: number;
    
    @ApiProperty()
    exp: number;
}
import { Injectable, PipeTransform, ArgumentMetadata, HttpStatus } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { ValidationException } from "../exceptions/validation.exception";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform (value: any, metadata: ArgumentMetadata ): Promise<any> {
        if (!value) {
            return;
        }

        const obj = plainToClass(metadata.metatype, value);
        const errors = await validate(obj);
        
        if (errors.length) {
            let messages = errors.map(err => {
                return `${err.property} - ${Object.values(err.constraints).join(', ')}`;
            });

            throw new ValidationException(messages, HttpStatus.BAD_REQUEST);
        }

        return value;
    }
}
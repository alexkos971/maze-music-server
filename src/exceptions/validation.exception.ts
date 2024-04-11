import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
    messages;
    
    constructor ( response: String[] | String, status: HttpStatus  ) {
        super(response, status); 
        this.messages = response;
    }
}
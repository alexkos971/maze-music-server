import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
    messages;
    
    constructor ( response: String[] | String  ) {
        super(response, HttpStatus.BAD_REQUEST); 
        this.messages = response;
    }

}
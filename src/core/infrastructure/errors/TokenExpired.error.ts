import { BaseError } from './Base.error';
import { ErrorCodeEnum } from '../index';

export class TokenExpiredError extends BaseError {
    constructor(message: string = 'Token expired') {
        super(
            message,
            {
                ru: 'Срок действия токена истек',
                uz: "Token muddati tugagan",
            },
            ErrorCodeEnum.TOKEN_EXPIRED_ERROR,
        );
    }
}

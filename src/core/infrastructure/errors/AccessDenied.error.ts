import {BaseError} from "./Base.error";
import { ErrorCodeEnum } from '../enums';

export class AccessDeniedError extends BaseError {
    constructor(message: string = 'Access Denied') {
        super(
            message,
            {
                ru: 'Доступ запрещен',
                uz: 'Ruxsat berilmadi',
            },
            ErrorCodeEnum.ACCESS_DENIED_ERROR,
        );
    }
}

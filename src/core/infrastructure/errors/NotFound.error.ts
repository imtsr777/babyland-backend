import { BaseError } from './Base.error';
import { ErrorCodeEnum } from '../enums';

export class NotFoundError extends BaseError {
    constructor(field: string) {
        super(
            `'${field}' not found`,
            {
                ru: `'${field}' не найдено`,
                uz: `'${field}' topilmadi`,
            },
            ErrorCodeEnum.NOT_FOUND_ERROR,
        );
    }
}

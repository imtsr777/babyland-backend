import {Response} from 'express';
import {ErrorCodeEnum, FailToMatchError, RequirementError} from "../core";

export function sendSuccess(data: any, res: Response, status = 200) {
    return res.status(status).send({
        error: null,
        data: data,
    });
}

export function sendError(error: any, res: Response, status = 500) {
    console.error('ERROR: ', error);
    switch (error.code) {
        case ErrorCodeEnum.REQUIREMENT_ERROR:
            status = 400;
            break;
        case ErrorCodeEnum.TOKEN_EXPIRED_ERROR:
        case ErrorCodeEnum.INVALID_TOKEN_ERROR:
        case ErrorCodeEnum.INCORRECT_PASSWORD_ERROR:
        case ErrorCodeEnum.TOKEN_NOT_PROVIDED_ERROR:
            status = 401;
            break;
        case ErrorCodeEnum.ACCESS_DENIED_ERROR:
            status = 403;
            break;
        case ErrorCodeEnum.NOT_FOUND_ERROR:
            status = 404;
            break;
        default:
            status = 500;
            break;
    }
    console.log(error);
    return res.status(status).send({
        code: error.code,
        message: error?.translates ? error.translates[res.lang] : error?.message,
        data: null,
    });
}

export function sendValidationError(error: any, res: Response, status = 422) {
    console.error('ERROR: ', error);
    const label = error?.details[0]?.context?.label;
    const type = error?.details[0]?.type;
    console.log(label);
    switch (type) {
        // TODO enter all JOI errors
        case 'any.required':
            error = new RequirementError(label);
            return res.status(status).send({
                code: error.code,
                message: error?.translates[res.lang],
                data: null,
            });
        default:
            error = new FailToMatchError(label);
            return res.status(status).send({
                code: error.code,
                message: error?.translates[res.lang],
                data: null,
            });
    }
}

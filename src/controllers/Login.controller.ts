import * as express from 'express';
import { sendError, sendSuccess, sendValidationError } from '../services';
import { IncorrectPasswordError, Token } from 'inhaus_core';
import { LoginParams } from '../defenitions';
import * as moment from 'moment';

export async function LoginController(req: express.Request, res: express.Response) {
    let params: LoginParams;
    try {
        params = await new LoginParams(req.body).validate();
    } catch (err) {
        return sendValidationError(err, res);
    }
    try {
        if (params.login !== process.env.LOGIN || params.password !== process.env.PASSWORD) {
            throw new IncorrectPasswordError('Login or password incorrect');
        }

        const jwtSecret = String(process.env.JWT_SECRET);
        const jwtExpirySeconds = Number(process.env.JWT_TOKEN_EXPIRE_SECONDS);
        const payload = { login: params.login };
        const accessToken = new Token(jwtSecret, jwtExpirySeconds, payload).sign();
        const expiresAt = moment().add(jwtExpirySeconds, 's').toDate();

        return sendSuccess(
            {
                accessToken: accessToken,
                expiresAt: expiresAt,
            },
            res,
        );
    } catch (error) {
        sendError(error, res);
    }
}

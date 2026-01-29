import * as Joi from 'joi';

export class LoginParams {
    /** Номер телефона */
    login: string;

    /** Хэш пароля */
    password: string;

    constructor(params: any) {
        if (params) {
            this.login = params?.login;
            this.password = params?.password;
        }
    }

    async validate() {
        return await LoginParamsSchema.validateAsync(this);
    }
}

export const LoginParamsSchema = Joi.object<LoginParams>({
    login: Joi.string().trim().required().max(50),
    password: Joi.string().trim().required().max(50),
});

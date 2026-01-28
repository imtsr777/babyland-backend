import * as Joi from 'joi';
import {TranslatesSchema} from "../../core";

export class UpdateArticleParams {
    /** Версия соглашения */
    title: TranslatesSchema;

    description: TranslatesSchema;

    constructor(params: any) {
        if (params) {
            this.title = params?.title;
            this.description = params?.description;
        }
    }

    async validate() {
        return await UpdateArticleParamsSchema.validateAsync(this);
    }
}

export const UpdateArticleParamsSchema = Joi.object<UpdateArticleParams>({
    title: Joi.object({
        uz: Joi.string().trim().required().max(50000),
        ru: Joi.string().trim().required().max(50000),
    }).required(),
    description: Joi.object({
        uz: Joi.string().trim().required().max(50000),
        ru: Joi.string().trim().required().max(50000),
    }).required(),
});

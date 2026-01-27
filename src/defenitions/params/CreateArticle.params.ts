import * as Joi from 'joi';
import {TranslatesSchema, ArticleSchema} from "../../core";

export class CreateArticleParams {
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
        return await CreateArticleParamsSchema.validateAsync(this);
    }
}

export const CreateArticleParamsSchema = Joi.object<CreateArticleParams>({
    title: Joi.object({
        uz: Joi.string().trim().required().max(50000),
        ru: Joi.string().trim().required().max(50000),
    }).required(),
    description: Joi.object({
        uz: Joi.string().trim().required().max(50000),
        ru: Joi.string().trim().required().max(50000),
    }).required(),
});

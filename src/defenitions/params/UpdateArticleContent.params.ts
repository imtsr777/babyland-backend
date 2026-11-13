import * as Joi from 'joi';
import { TranslatesSchema } from '../../core';

export class UpdateArticleContentParams {
    paragraph: TranslatesSchema;

    text: TranslatesSchema;

    order: number;

    constructor(params: any) {
        if (params) {
            this.paragraph = params?.paragraph;
            this.text = params?.text;
            this.order = params?.order;
        }
    }

    async validate() {
        return await UpdateArticleContentParamsSchema.validateAsync(this);
    }
}

export const UpdateArticleContentParamsSchema = Joi.object<UpdateArticleContentParams>({
    paragraph: Joi.object({
        uz: Joi.string().trim().required().max(50000),
        ru: Joi.string().trim().required().max(50000),
    }),
    text: Joi.object({
        uz: Joi.string().trim().required().max(50000),
        ru: Joi.string().trim().required().max(50000),
    }),
    order: Joi.number().min(0).max(1000).required(),
});

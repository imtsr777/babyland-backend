import * as Joi from 'joi';
import {TranslatesSchema, ArticleContentTypeEnum} from "../../core";

export class CreateArticleContentParams {

    paragraph: TranslatesSchema;

    text: TranslatesSchema;

    type: ArticleContentTypeEnum;

    order: number;

    constructor(params: any) {
        if (params) {
            this.paragraph = params?.paragraph;
            this.text = params?.text;
            this.type = params?.type;
            this.order = params?.order;
        }
    }

    async validate() {
        return await CreateArticleContentParamsSchema.validateAsync(this);
    }
}

export const CreateArticleContentParamsSchema = Joi.object<CreateArticleContentParams>({
    paragraph: Joi.object({
        uz: Joi.string().trim().required().max(50000),
        ru: Joi.string().trim().required().max(50000),
    }),
    text: Joi.object({
        uz: Joi.string().trim().required().max(50000),
        ru: Joi.string().trim().required().max(50000),
    }),
    type: Joi.valid(...Object.values(ArticleContentTypeEnum)).required(),
    order: Joi.number().required().min(0).max(1000).required(),
});

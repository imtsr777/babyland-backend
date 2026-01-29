import * as Joi from 'joi';
import {ArticleStatusEnum } from "../../core";

export class ChangeArticleStatusParams {
    /** Версия соглашения */
    status: ArticleStatusEnum;

    constructor(params: any) {
        if (params) {
            this.status = params?.status;
        }
    }

    async validate() {
        return await ChangeArticleStatusParamsSchema.validateAsync(this);
    }
}

export const ChangeArticleStatusParamsSchema = Joi.object<ChangeArticleStatusParams>({
    status: Joi.valid(ArticleStatusEnum.INACTIVE, ArticleStatusEnum.DELETED, ArticleStatusEnum.ACTIVE).required(),
});

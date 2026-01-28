import * as Joi from 'joi';
import {ArticleStatusEnum} from "../../core";

export class GetArticleListParams {
    page: number;

    size: number;

    status: string;

    constructor(params: any) {
        if (params) {
            this.page = params?.page;
            this.size = params?.size;
            this.status = params?.status;
        }
    }

    async validate() {
        return await GetArticleListParamsSchema.validateAsync(this);
    }
}

export const GetArticleListParamsSchema = Joi.object<GetArticleListParams>({
    page: Joi.number().max(999999999).empty(1).default(1),
    size: Joi.number().max(999999999).empty(10).default(10),
    status: Joi.valid(ArticleStatusEnum.ACTIVE, ArticleStatusEnum.INACTIVE),
});

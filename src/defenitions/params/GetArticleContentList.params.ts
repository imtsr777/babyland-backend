import * as Joi from 'joi';

export class GetArticleContentListParams {
    page: number;

    size: number;

    articleId: string;

    constructor(params: any) {
        if (params) {
            this.page = params?.page;
            this.size = params?.size;
            this.articleId = params?.articleId;
        }
    }

    async validate() {
        return await GetArticleContentListParamsSchema.validateAsync(this);
    }
}

export const GetArticleContentListParamsSchema = Joi.object<GetArticleContentListParams>({
    page: Joi.number().max(999999999).empty(1).default(1),
    size: Joi.number().max(999999999).empty(10).default(10),
    articleId: Joi.string().trim().required().pattern(new RegExp('^[0-9a-fA-F]{24}$')),
});

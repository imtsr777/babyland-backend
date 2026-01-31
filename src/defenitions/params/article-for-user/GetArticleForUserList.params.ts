import * as Joi from 'joi';

export class GetArticleForUserListParams {
  page: number;

  size: number;

  keyword: string;

  constructor(params: any) {
    if (params) {
      this.page = params?.page;
      this.size = params?.size;
      this.keyword = params?.keyword;
    }
  }

  async validate() {
    return await GetArticleForUserListParamsSchema.validateAsync(this);
  }
}

export const GetArticleForUserListParamsSchema = Joi.object<GetArticleForUserListParams>({
  page: Joi.number().max(999999999).empty(1).default(1),
  size: Joi.number().max(999999999).empty(10).default(10),
  keyword: Joi.string().max(500),
});

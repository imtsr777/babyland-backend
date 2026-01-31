import * as Joi from 'joi';
import { LanguageEnum } from '../../../core';

export class GetArticleForUserBySlugParams {
  slug: string;

  lang: LanguageEnum;

  constructor(params: any) {
    if (params) {
      this.slug = params?.slug;
      this.lang = params?.lang;
    }
  }

  async validate() {
    return await GetArticleForUserBySlugParamsSchema.validateAsync(this);
  }
}

export const GetArticleForUserBySlugParamsSchema = Joi.object<GetArticleForUserBySlugParams>({
  slug: Joi.string().max(500).required(),
  lang: Joi.string().valid(LanguageEnum.UZ, LanguageEnum.RU).required(),
});

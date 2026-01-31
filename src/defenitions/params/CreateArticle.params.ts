import * as Joi from 'joi';
import { TranslatesSchema } from '../../core';

export class CreateArticleParams {
  /** Версия соглашения */
  title: TranslatesSchema;

  description: TranslatesSchema;

  slug: TranslatesSchema;

  constructor(params: any) {
    if (params) {
      this.title = params?.title;
      this.description = params?.description;
      this.slug = params?.slug;
    }
  }

  async validate() {
    return await CreateArticleParamsSchema.validateAsync(this);
  }
}

export const CreateArticleParamsSchema = Joi.object<CreateArticleParams>({
  title: Joi.object({
    uz: Joi.string().trim().required().min(6).max(50000),
    ru: Joi.string().trim().required().min(6).max(50000),
  }).required(),
  description: Joi.object({
    uz: Joi.string().trim().required().max(50000),
    ru: Joi.string().trim().required().max(50000),
  }).required(),
  slug: Joi.object({
    uz: Joi.string().trim().min(5).max(70),
    ru: Joi.string().trim().min(5).max(70),
  }),
});

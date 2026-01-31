import * as Joi from 'joi';
import { LanguageEnum } from '../../../core';

export class CheckLanguageParams {
  lang: LanguageEnum;

  constructor(params: any) {
    if (params) {
      this.lang = params?.lang;
    }
  }

  async validate() {
    return await CheckLanguageParamsSchema.validateAsync(this);
  }
}

export const CheckLanguageParamsSchema = Joi.object<CheckLanguageParams>({
  lang: Joi.string().valid(LanguageEnum.UZ, LanguageEnum.RU).required(),
});

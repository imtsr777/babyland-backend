import { modelOptions, prop, Severity } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { ArticleStatusEnum } from '../../infrastructure';
import { TranslatesSchema } from './Translates.schema';

@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class ArticleSchema {
  /** ID */
  _id?: Types.ObjectId;

  @prop({ _id: false })
  title: TranslatesSchema;

  @prop({ _id: false })
  description: TranslatesSchema;

  @prop({ _id: false })
  slug: TranslatesSchema;

  @prop()
  image: string;

  @prop({ default: ArticleStatusEnum.INACTIVE })
  status: ArticleStatusEnum;

  /** Date of creation */
  updatedAt?: Date;

  /** Date of last update */
  createdAt?: Date;
}

import { modelOptions, prop, Severity, Ref } from '@typegoose/typegoose';
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

    @prop()
    title: TranslatesSchema;

    @prop()
    description: TranslatesSchema;


    @prop()
    image: string;

    @prop({ default: ArticleStatusEnum.INACTIVE })
    status: ArticleStatusEnum;

    /** Date of creation */
    updatedAt?: Date;

    /** Date of last update */
    createdAt?: Date;
}

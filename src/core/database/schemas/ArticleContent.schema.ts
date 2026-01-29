import { modelOptions, prop, Severity, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import {ArticleContentTypeEnum} from "../../infrastructure";
import {TranslatesSchema} from "./Translates.schema";

@modelOptions({
    options: {
        allowMixed: Severity.ALLOW,
    },
})
export class ArticleContentSchema {

    @prop()
    article: Types.ObjectId;

    @prop()
    order: number;

    @prop()
    image: string;

    @prop({ _id: false })
    paragraph: TranslatesSchema;

    @prop( { _id: false })
    text: TranslatesSchema;

    @prop()
    type: ArticleContentTypeEnum;

    /** ID */
    _id?: Types.ObjectId;

    /** Date of creation */
    updatedAt?: Date;

    /** Date of last update */
    createdAt?: Date;
}

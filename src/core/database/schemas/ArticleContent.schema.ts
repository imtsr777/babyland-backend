import { modelOptions, prop, Severity, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import {ArticleContentTypeEnum} from "../../infrastructure";

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

    @prop()
    paragraph: string;

    @prop()
    text: string;

    @prop()
    type: ArticleContentTypeEnum;

    /** ID */
    _id?: Types.ObjectId;

    /** Date of creation */
    updatedAt?: Date;

    /** Date of last update */
    createdAt?: Date;
}

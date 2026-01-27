import { getModelForClass, Severity } from '@typegoose/typegoose';
import { ArticleSchema } from '../schemas';

export const ArticleModel = getModelForClass(ArticleSchema, {
    schemaOptions: {
        collection: 'articles',
        timestamps: true,
        minimize: true,
        versionKey: false,
    },
    options: {
        allowMixed: Severity.ALLOW,
    },
});

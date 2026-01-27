import { getModelForClass, Severity } from '@typegoose/typegoose';
import { ArticleContentSchema } from '../schemas';

export const ArticleContentModel = getModelForClass(ArticleContentSchema, {
    schemaOptions: {
        collection: 'article_contents',
        timestamps: true,
        minimize: true,
        versionKey: false,
    },
    options: {
        allowMixed: Severity.ALLOW,
    },
});

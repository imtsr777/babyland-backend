import {ArticleEntity, ArticleStatusEnum, TranslatesSchema} from "../../core";

export class GetArticleResponse {
    id?: string;

    title?: TranslatesSchema;

    description?: TranslatesSchema;

    status?: ArticleStatusEnum;

    imagePath?: string;

    createdAt?: Date;

    constructor(article: ArticleEntity) {

        if (article && article instanceof ArticleEntity) {
            this.id = article.getId()?.toString();
            this.title = article.getTitle()?.convertToSchema();
            this.description = article.getDescription()?.convertToSchema();
            this.status = article.getStatus();
            this.imagePath = article?.getImage() ? (process.env.CDN_END_POINT + '/' + process.env.IMAGES_FOLDER_NAME + '/' + article?.getImage()) : null;
            this.createdAt = article.getCreatedAt();
        }
    }
}

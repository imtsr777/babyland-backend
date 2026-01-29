import {ArticleContentEntity, TranslatesSchema} from "../../core";

export class GetArticleContentResponse {
    id?: string;

    paragraph?: TranslatesSchema;

    text?: TranslatesSchema;

    imagePath?: string;

    order: number;

    constructor(articleContent: ArticleContentEntity) {

        if (articleContent && articleContent instanceof ArticleContentEntity) {
            this.id = articleContent.getId()?.toString();
            this.paragraph = articleContent.getParagraph()?.convertToSchema();
            this.text = articleContent.getText()?.convertToSchema();
            this.imagePath = articleContent?.getImage() ? (process.env.IMAGES_END_POINT + '/' + process.env.IMAGES_FOLDER_NAME + '/' + articleContent?.getImage()) : null;
            this.order = articleContent.getOrder() ?? 0;
        }
    }
}

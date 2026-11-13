import {ArticleContentEntity, ArticleContentTypeEnum, TranslatesSchema} from "../../core";

export class GetArticleContentResponse {
    id?: string;

    paragraph?: TranslatesSchema;

    text?: TranslatesSchema;

    html?: TranslatesSchema;

    imagePath?: string;

    order: number;

    type: ArticleContentTypeEnum;

    constructor(articleContent: ArticleContentEntity) {

        if (articleContent && articleContent instanceof ArticleContentEntity) {
            this.id = articleContent.getId()?.toString();
            this.paragraph = articleContent.getParagraph()?.convertToSchema();
            this.text = articleContent.getText()?.convertToSchema();
            this.html = articleContent.getHtml()?.convertToSchema();
            this.imagePath = articleContent?.getImage() ? (process.env.IMAGES_END_POINT + '/' + process.env.IMAGES_FOLDER_NAME + '/' + articleContent?.getImage()) : null;
            this.order = articleContent.getOrder() ?? 0;
            this.type = articleContent.getType();
        }
    }
}

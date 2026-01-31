import { ArticleContentEntity, ArticleContentTypeEnum, LanguageEnum } from '../../core';

export class GetArticleContentForUserResponse {
  paragraph?: string;

  text?: string;

  imagePath?: string;

  order: number;

  type: ArticleContentTypeEnum;

  constructor(articleContent: ArticleContentEntity, language: LanguageEnum) {
    if (articleContent && articleContent instanceof ArticleContentEntity) {
      this.paragraph = articleContent.getParagraph()?.getByLang(language);
      this.text = articleContent.getText()?.getByLang(language);
      this.type = articleContent?.getType();
      this.imagePath = articleContent?.getImage()
        ? process.env.IMAGES_END_POINT + '/' + process.env.IMAGES_FOLDER_NAME + '/' + articleContent?.getImage()
        : null;
      this.order = articleContent.getOrder() ?? 0;
    }
  }
}

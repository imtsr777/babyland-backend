import { ArticleEntity, ArticleStatusEnum, LanguageEnum } from '../../core';
import { GetArticleContentForUserResponse } from './GetArticleContentForUser.response';

export class GetArticleForUserResponse {
  id?: string;

  title?: string;

  description?: string;

  status?: ArticleStatusEnum;

  imagePath?: string;

  contents: Array<GetArticleContentForUserResponse>;

  slug: string;

  createdAt?: Date;

  constructor(article: ArticleEntity, language: LanguageEnum) {
    if (article && article instanceof ArticleEntity) {
      this.id = article.getId()?.toString();
      this.title = article.getTitle()?.getByLang(language);
      this.description = article.getTitle()?.getByLang(language);
      this.imagePath = article?.getImage() ? process.env.IMAGES_END_POINT + '/' + process.env.IMAGES_FOLDER_NAME + '/' + article?.getImage() : null;
      this.createdAt = article.getCreatedAt();
      this.slug = article?.getSlug()?.getByLang(language);
    }
  }
}

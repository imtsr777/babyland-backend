import * as express from 'express';
import { sendError, sendSuccess, sendValidationError } from '../../services';
import { GetArticleContentForUserResponse, GetArticleForUserBySlugParams, GetArticleForUserResponse } from '../../defenitions';
import { LanguageEnum, NotFoundError, Repository } from '../../core';

export async function GetArticleForUserBySlugController(req: express.Request, res: express.Response) {
  let params: GetArticleForUserBySlugParams;
  let response: GetArticleForUserResponse;
  try {
    params = await new GetArticleForUserBySlugParams(req.params).validate();
  } catch (err) {
    return sendValidationError(err, res);
  }
  try {
    let article = await Repository.Article().getBySlug(params.slug, params.lang);
    if (!article) {
      article = await Repository.Article().getBySlug(params.slug, params.lang === LanguageEnum.UZ ? LanguageEnum.RU : LanguageEnum.UZ);
    }
    if (!article) {
      throw new NotFoundError('Article');
    }

    const articleContents = await Repository.ArticleContent().list(
      {
        page: 1,
        size: 9999,
      },
      { article: article.getId() },
      { order: 1 },
    );
    response = new GetArticleForUserResponse(article, params.lang);

    response.contents = articleContents.map((obj) => new GetArticleContentForUserResponse(obj, params.lang));

    return sendSuccess(response, res);
  } catch (err) {
    return sendError(err, res);
  }
}

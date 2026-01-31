import * as express from 'express';
import { CreateArticleParams, GetArticleResponse } from '../../defenitions';
import { sendError, sendSuccess, sendValidationError } from '../../services';
import { ArticleEntity, ArticleModel, ArticleStatusEnum, Repository, TranslatesEntity } from '../../core';
import { FileService, TextFormatter } from '../../utils';

export async function CreateArticleController(req: express.Request, res: express.Response) {
  let params: CreateArticleParams;
  let response: GetArticleResponse;

  try {
    params = await new CreateArticleParams(req.body).validate();
  } catch (error) {
    return sendValidationError(error, res);
  }
  try {
    const uploadedImage = await FileService.uploadImage(req.file);

    const textFormatter = new TextFormatter();

    const slugTextUz = params?.slug?.uz ? params?.slug?.uz : params?.title?.uz;
    const slugTextRu = params?.slug?.ru ? params?.slug?.ru : params?.title?.ru;

    const slug = new TranslatesEntity().buildUz(textFormatter.generateSlug(slugTextUz)).buildRu(textFormatter.generateSlug(slugTextRu));

    const similarArticles = await ArticleModel.find({ $or: [{ 'slug.uz': slug.getUz() }, { 'slug.ru': slug.getRu() }] });

    if (similarArticles.length > 0) {
      const today = new Date().toISOString().slice(0, 10);
      slug.buildUz(slug.getUz() + '-' + today);
      slug.buildRu(slug.getRu() + '-' + today);
    }

    const articleToCreate = new ArticleEntity()
      .buildTitle(params.title)
      .buildDescription(params.description)
      .buildStatus(ArticleStatusEnum.INACTIVE)
      .buildImage(uploadedImage)
      .buildSlug(slug?.convertToSchema());

    const createdArticle = await Repository.Article().create(articleToCreate);
    response = new GetArticleResponse(createdArticle);
    return sendSuccess(response, res);
  } catch (error) {
    return sendError(error, res);
  }
}

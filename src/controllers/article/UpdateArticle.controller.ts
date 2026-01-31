import * as express from 'express';
import { GetArticleResponse, UpdateArticleParams, IdParams } from '../../defenitions';
import { sendError, sendSuccess, sendValidationError } from '../../services';
import { NotFoundError, Repository } from '../../core';
import { FileService } from '../../utils';
import { Types } from 'mongoose';

export async function UpdateArticleController(req: express.Request, res: express.Response) {
  let params: UpdateArticleParams;
  let idParams: IdParams;
  let response: GetArticleResponse;

  try {
    params = await new UpdateArticleParams(req.body).validate();
    idParams = await new IdParams(req.params).validate();
  } catch (error) {
    return sendValidationError(error, res);
  }

  try {
    const article = await Repository.Article().getById(new Types.ObjectId(idParams.id));
    if (!article) {
      throw new NotFoundError('Article');
    }

    let oldImage = article.getImage();

    if (req.file) {
      const uploadedImage = await FileService.uploadImage(req.file);
      await FileService.deleteImage(oldImage);
      oldImage = uploadedImage;
    }

    article.buildTitle(params.title).buildDescription(params.description).buildImage(oldImage);

    const updatedArticle = await Repository.Article().update(article);
    response = new GetArticleResponse(updatedArticle);
    return sendSuccess(response, res);
  } catch (error) {
    return sendError(error, res);
  }
}

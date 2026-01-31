import * as express from 'express';
import { GetArticleResponse, IdParams } from '../../defenitions';
import { sendError, sendSuccess, sendValidationError } from '../../services';
import { NotFoundError, Repository } from '../../core';
import { Types } from 'mongoose';

export async function GetArticleByIdController(req: express.Request, res: express.Response) {
  let idParams: IdParams;
  let response: GetArticleResponse;

  try {
    idParams = await new IdParams(req.params).validate();
  } catch (error) {
    return sendValidationError(error, res);
  }

  try {
    const article = await Repository.Article().getById(new Types.ObjectId(idParams.id));
    if (!article) {
      throw new NotFoundError('Article');
    }

    response = new GetArticleResponse(article);
    return sendSuccess(response, res);
  } catch (error) {
    return sendError(error, res);
  }
}

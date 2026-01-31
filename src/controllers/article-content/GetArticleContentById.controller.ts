import * as express from 'express';
import { GetArticleContentResponse, IdParams} from '../../defenitions';
import {sendError, sendSuccess, sendValidationError} from '../../services';
import {NotFoundError, Repository} from '../../core';
import {Types} from "mongoose";

export async function GetArticleContentByIdController(req: express.Request, res: express.Response) {
    let idParams: IdParams;
    let response: GetArticleContentResponse;

    try {
        idParams = await new IdParams(req.params).validate();
    } catch (error) {
        return sendValidationError(error, res);
    }

    try {

        const articleContent = await Repository.ArticleContent().getById(new Types.ObjectId(idParams.id));
        if( !articleContent ){
            throw new NotFoundError('Article content');
        }

        response = new GetArticleContentResponse(articleContent);
        return sendSuccess( response , res);
    } catch (error) {
        return sendError(error, res);
    }
}

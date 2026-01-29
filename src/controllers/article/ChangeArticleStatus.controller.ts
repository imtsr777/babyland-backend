import * as express from 'express';
import {ChangeArticleStatusParams, GetArticleResponse, IdParams} from '../../defenitions';
import {sendError, sendSuccess, sendValidationError} from '../../services';
import {ArticleStatusEnum, Repository} from '../../core';
import {Types} from "mongoose";

export async function ChangeArticleStatusController(req: express.Request, res: express.Response) {
    let params: ChangeArticleStatusParams;
    let idParams: IdParams;
    let response: GetArticleResponse;

    try {
        params = await new ChangeArticleStatusParams(req.body).validate();
        idParams = await new IdParams(req.params).validate();
    } catch (error) {
        return sendValidationError(error, res);
    }

    try {

        const article = await Repository.Article().getById(new Types.ObjectId(idParams.id));
        if( !article || article?.getStatus() === ArticleStatusEnum.DELETED){
            throw new Error("Article not found");
        }

        article.buildStatus(params.status);

        const updatedArticle = await Repository.Article().update(article);
        response = new GetArticleResponse(updatedArticle);
        return sendSuccess( response , res);
    } catch (error) {
        return sendError(error, res);
    }
}

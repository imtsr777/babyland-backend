import * as express from 'express';
import {CreateArticleParams, GetArticleResponse} from '../../defenitions';
import {sendError, sendSuccess, sendValidationError} from '../../services';
import {ArticleEntity, ArticleStatusEnum, Repository} from '../../core';
import { FileService } from "../../utils";

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

        const articleToCreate = new ArticleEntity()
            .buildTitle(params.title)
            .buildDescription(params.description)
            .buildStatus(ArticleStatusEnum.INACTIVE)
            .buildImage(uploadedImage);

        const createdArticle = await Repository.Article().create(articleToCreate);
        response = new GetArticleResponse(createdArticle);
        return sendSuccess( response , res);
    } catch (error) {
        return sendError(error, res);
    }
}

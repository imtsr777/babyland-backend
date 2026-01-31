import * as express from 'express';
import { IdParams} from '../../defenitions';
import {sendError, sendSuccess, sendValidationError} from '../../services';
import {ArticleContentTypeEnum, NotFoundError, Repository} from '../../core';
import {Types} from "mongoose";
import {FileService} from "../../utils";

export async function DeleteArticleContentController(req: express.Request, res: express.Response) {
    let idParams: IdParams;

    try {
        idParams = await new IdParams(req.params).validate();
    } catch (error) {
        return sendValidationError(error, res);
    }

    try {

        const articleContent = await Repository.ArticleContent().getById(new Types.ObjectId(idParams.id));
        if( !articleContent ){
            throw new NotFoundError("Article content");
        }

        if( articleContent.getType() === ArticleContentTypeEnum.IMAGE ){
            await FileService.deleteImage(articleContent.getImage());
        }

        await Repository.ArticleContent().delete(articleContent.getId());

        return sendSuccess( { success: true} , res);
    } catch (error) {
        return sendError(error, res);
    }
}

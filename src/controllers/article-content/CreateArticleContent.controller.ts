import * as express from 'express';
import {CreateArticleContentParams, GetArticleContentResponse, IdParams} from '../../defenitions';
import {sendError, sendSuccess, sendValidationError} from '../../services';
import {
    ArticleContentEntity,
    ArticleContentTypeEnum,
    ArticleStatusEnum,
    Repository,
    RequirementError
} from '../../core';
import {Types} from "mongoose";
import {FileService} from "../../utils";

export async function CreateArticleContentController(req: express.Request, res: express.Response) {
    let params: CreateArticleContentParams;
    let idParams: IdParams;
    let response: GetArticleContentResponse;

    try {
        params = await new CreateArticleContentParams(req.body).validate();
        idParams = await new IdParams(req.params).validate();
    } catch (error) {
        return sendValidationError(error, res);
    }
    try {
        const article = await Repository.Article().getById(new Types.ObjectId(idParams.id));
        if( !article || article.getStatus() === ArticleStatusEnum.DELETED ){
            throw new Error("Article not found");
        }
        const articleContentEntity = new ArticleContentEntity().buildType(params.type).buildArticle(article.getId()).buildOrder(params.order);
        switch (params.type){
            case ArticleContentTypeEnum.TEXT: {
                if( !params.text ){
                    throw new RequirementError('Text')
                }
                articleContentEntity.buildText(params.text);
                break;
            }
            case ArticleContentTypeEnum.PARAGRAPH: {
                if( !params.paragraph ){
                    throw new RequirementError('Paragraph')
                }
                articleContentEntity.buildParagraph(params.paragraph);
                break;
            }
            case ArticleContentTypeEnum.IMAGE: {
                const uploadedImage = await FileService.uploadImage(req.file);
                articleContentEntity.buildImage(uploadedImage);
                break;
            }
        }

        const createdArticleContent = await Repository.ArticleContent().create(articleContentEntity);
        response = new GetArticleContentResponse(createdArticleContent);
        return sendSuccess( response , res);
    } catch (error) {
        return sendError(error, res);
    }
}

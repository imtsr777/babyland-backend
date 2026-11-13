import * as express from 'express';
import { GetArticleContentResponse, IdParams, UpdateArticleContentParams } from '../../defenitions';
import { sendError, sendSuccess, sendValidationError } from '../../services';
import { ArticleContentTypeEnum, NotFoundError, Repository, RequirementError } from '../../core';
import { Types } from 'mongoose';
import { FileService } from '../../utils';

/** Updates a content block. The block type cannot change; only order and the type's own value (text / paragraph / image). */
export async function UpdateArticleContentController(req: express.Request, res: express.Response) {
    let params: UpdateArticleContentParams;
    let idParams: IdParams;
    let response: GetArticleContentResponse;

    try {
        params = await new UpdateArticleContentParams(req.body).validate();
        idParams = await new IdParams(req.params).validate();
    } catch (error) {
        return sendValidationError(error, res);
    }

    try {
        const articleContent = await Repository.ArticleContent().getById(new Types.ObjectId(idParams.id));
        if (!articleContent) {
            throw new NotFoundError('Article content');
        }

        articleContent.buildOrder(params.order);

        switch (articleContent.getType()) {
            case ArticleContentTypeEnum.TEXT: {
                if (!params.text) {
                    throw new RequirementError('Text');
                }
                articleContent.buildText(params.text);
                break;
            }
            case ArticleContentTypeEnum.PARAGRAPH: {
                if (!params.paragraph) {
                    throw new RequirementError('Paragraph');
                }
                articleContent.buildParagraph(params.paragraph);
                break;
            }
            case ArticleContentTypeEnum.IMAGE: {
                // New image is optional; keep the old one if no file was sent
                if (req.file) {
                    const oldImage = articleContent.getImage();
                    const uploadedImage = await FileService.uploadImage(req.file);
                    articleContent.buildImage(uploadedImage);
                    if (oldImage) {
                        await FileService.deleteImage(oldImage);
                    }
                }
                break;
            }
        }

        const updatedArticleContent = await Repository.ArticleContent().update(articleContent);
        response = new GetArticleContentResponse(updatedArticleContent);
        return sendSuccess(response, res);
    } catch (error) {
        return sendError(error, res);
    }
}

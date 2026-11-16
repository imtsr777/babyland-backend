import * as express from 'express';
import { GetArticleContentResponse, IdParams, UpdateArticleContentParams } from '../../defenitions';
import { sendError, sendSuccess, sendValidationError } from '../../services';
import { ArticleContentTypeEnum, NotFoundError, Repository, RequirementError } from '../../core';
import { Types } from 'mongoose';
import { FileService } from '../../utils';

/**
 * Updates a content block: order, value and (optionally) type.
 * When the type changes, the values of the old type are cleared:
 *  - text-like -> IMAGE: a new image file is required;
 *  - IMAGE -> text-like: the old image file is deleted after a successful save.
 */
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

        const oldType = articleContent.getType();
        const newType = params.type ?? oldType;
        const oldImage = articleContent.getImage();
        let imageToDelete: string = null;

        articleContent.buildOrder(params.order).buildType(newType);

        if (newType !== ArticleContentTypeEnum.IMAGE) {
            // Text-like types: only the new type's field keeps a value
            articleContent.buildText(null).buildParagraph(null).buildHtml(null);
            if (oldImage) {
                articleContent.buildImage(null);
                imageToDelete = oldImage;
            }
        }

        switch (newType) {
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
            case ArticleContentTypeEnum.HTML: {
                if (!params.html) {
                    throw new RequirementError('HTML');
                }
                articleContent.buildHtml(params.html);
                break;
            }
            case ArticleContentTypeEnum.IMAGE: {
                // Becoming an image (or an image without a file) requires an upload; otherwise it's optional
                if (!req.file && (oldType !== ArticleContentTypeEnum.IMAGE || !oldImage)) {
                    throw new RequirementError('Image');
                }
                if (req.file) {
                    const uploadedImage = await FileService.uploadImage(req.file);
                    articleContent.buildImage(uploadedImage);
                    imageToDelete = oldImage || null;
                }
                articleContent.buildText(null).buildParagraph(null).buildHtml(null);
                break;
            }
        }

        const updatedArticleContent = await Repository.ArticleContent().update(articleContent);

        // Delete the old file only after the DB update succeeded
        if (imageToDelete) {
            await FileService.deleteImage(imageToDelete);
        }

        response = new GetArticleContentResponse(updatedArticleContent);
        return sendSuccess(response, res);
    } catch (error) {
        return sendError(error, res);
    }
}

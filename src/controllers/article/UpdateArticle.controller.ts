import * as express from 'express';
import { GetArticleResponse, UpdateArticleParams, IdParams } from '../../defenitions';
import { sendError, sendSuccess, sendValidationError } from '../../services';
import { BaseError, ErrorCodeEnum, NotFoundError, Repository } from '../../core';
import { FileService, TextFormatter } from '../../utils';
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

    if (params.slug) {
      const textFormatter = new TextFormatter();
      const newUz = textFormatter.generateSlug(params.slug.uz);
      const newRu = textFormatter.generateSlug(params.slug.ru);

      if (newUz.length < 3 || newRu.length < 3) {
        throw new BaseError(
          'Slug is too short after formatting',
          { uz: "Slug juda qisqa (faqat lotin harflari, raqam va '-' qoladi)", ru: 'Slug слишком короткий' },
          ErrorCodeEnum.REQUIREMENT_ERROR,
        );
      }

      const current = article.getSlug();
      const currentUz = current?.getUz();
      const currentRu = current?.getRu();

      for (const candidate of new Set([newUz, newRu])) {
        if (candidate === currentUz || candidate === currentRu) continue;
        if (await Repository.Article().isSlugTaken(candidate, article.getId())) {
          throw new BaseError(
            `Slug '${candidate}' is already used`,
            { uz: `'${candidate}' slug boshqa maqolada band`, ru: `Slug '${candidate}' уже используется` },
            ErrorCodeEnum.REQUIREMENT_ERROR,
          );
        }
      }

      // Eski slug'larni redirect uchun saqlaymiz; yangi slug'lar ro'yxatdan chiqariladi
      const oldSlugs = new Set(article.getOldSlugs());
      [currentUz, currentRu].forEach((s) => s && oldSlugs.add(s));
      oldSlugs.delete(newUz);
      oldSlugs.delete(newRu);

      article.buildSlug({ uz: newUz, ru: newRu }).buildOldSlugs([...oldSlugs]);
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

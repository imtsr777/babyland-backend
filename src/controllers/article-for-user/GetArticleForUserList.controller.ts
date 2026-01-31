import * as express from 'express';
import { sendError, sendSuccess, sendValidationError } from '../../services';
import { FilterQuery } from 'mongoose';
import { CheckLanguageParams, GetArticleForUserListParams, GetArticleForUserResponse } from '../../defenitions';
import { ArticleStatusEnum, ListInterface } from '../../core';
import { getArticleListCase } from '../../usecases';
import { TextFormatter } from '../../utils';

export async function GetArticleForUserListController(req: express.Request, res: express.Response) {
  let response: ListInterface<GetArticleForUserResponse> = {
    meta: {
      count: 0,
      currentPage: 1,
      pages: 0,
    },
    items: [],
  };

  let params: GetArticleForUserListParams;
  let langParams: CheckLanguageParams;
  try {
    params = await new GetArticleForUserListParams(req.query).validate();
    langParams = await new CheckLanguageParams(req.params).validate();
  } catch (err) {
    return sendValidationError(err, res);
  }
  try {
    const filterQuery: FilterQuery<any> = { status: ArticleStatusEnum.ACTIVE, $or: [] };

    if (params?.keyword && params?.keyword?.length > 2) {
      const textFromatter = new TextFormatter();
      const isCirilic = textFromatter.isCyrillic(params.keyword);
      let orQueryParams;
      if (isCirilic) {
        orQueryParams = [{ 'title.ru': { $regex: params.keyword, $options: 'i' } }, { 'description.ru': { $regex: params.keyword, $options: 'i' } }];
      } else {
        orQueryParams = [{ 'title.uz': { $regex: params.keyword, $options: 'i' } }, { 'description.uz': { $regex: params.keyword, $options: 'i' } }];
      }

      filterQuery.$or = orQueryParams;
    }

    const getArticleListParams = {
      pagination: {
        size: params.size,
        page: params.page,
      },
      filter: filterQuery,
      sort: { createdAt: -1 },
    };

    const result = await getArticleListCase.execute(getArticleListParams);

    response.meta = result.meta;
    response.items = result.items.map((obj) => new GetArticleForUserResponse(obj, langParams.lang));

    return sendSuccess(response, res);
  } catch (err) {
    return sendError(err, res);
  }
}

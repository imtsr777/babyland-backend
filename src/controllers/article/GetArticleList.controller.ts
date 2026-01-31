import * as express from 'express';
import { sendError, sendSuccess, sendValidationError } from '../../services';
import { FilterQuery } from 'mongoose';
import { GetArticleListParams, GetArticleResponse } from '../../defenitions';
import { ArticleStatusEnum, ListInterface } from '../../core';
import { getArticleListCase } from '../../usecases';

export async function GetArticleListController(req: express.Request, res: express.Response) {
  let response: ListInterface<GetArticleResponse> = {
    meta: {
      count: 0,
      currentPage: 1,
      pages: 0,
    },
    items: [],
  };

  let params: GetArticleListParams;
  try {
    params = await new GetArticleListParams(req.query).validate();
  } catch (err) {
    return sendValidationError(err, res);
  }
  try {
    const filterQuery: FilterQuery<any> = { status: { $ne: ArticleStatusEnum.DELETED } };

    if (params.status) {
      filterQuery.status = params.status;
    }

    const getCountryListParams = {
      pagination: {
        size: params.size,
        page: params.page,
      },
      filter: filterQuery,
      sort: { createdAt: -1 },
    };

    const result = await getArticleListCase.execute(getCountryListParams);

    response.meta = result.meta;
    response.items = result.items.map((obj) => new GetArticleResponse(obj));

    return sendSuccess(response, res);
  } catch (err) {
    return sendError(err, res);
  }
}

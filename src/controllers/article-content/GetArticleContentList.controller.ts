import * as express from 'express';
import { sendError, sendSuccess, sendValidationError } from '../../services';
import {FilterQuery, Types} from 'mongoose';
import {
    GetArticleContentListParams,
    GetArticleContentResponse,
} from "../../defenitions";
import { ListInterface } from "../../core";
import {getArticleContentListCase} from "../../usecases";

export async function GetArticleContentListController(req: express.Request, res: express.Response) {
    let response: ListInterface<GetArticleContentResponse> = {
        meta: {
            count: 0,
            currentPage: 1,
            pages: 0,
        },
        items: [],
    };

    let params: GetArticleContentListParams;
    try {
        params = await new GetArticleContentListParams(req.query).validate();
    } catch (err) {
        return sendValidationError(err, res);
    }
    try {
        const filterQuery: FilterQuery<any> = { article: new Types.ObjectId(params.articleId)};

        const getArticleContentListParams = {
            pagination: {
                size: params.size,
                page: params.page,
            },
            filter: filterQuery,
            sort: { order: 1 },
        };

        const result = await getArticleContentListCase.execute(getArticleContentListParams);

        response.meta = result.meta;
        response.items = result.items.map(obj => new GetArticleContentResponse(obj));

        return sendSuccess(response, res);
    } catch (err) {
        return sendError(err, res);
    }
}

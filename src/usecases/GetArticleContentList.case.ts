import { Repository, BaseCaseInterface, BaseListParams, ListInterface, BaseCaseParamsInterface, ArticleContentEntity } from '../core';

export class GetArticleContentListCase implements BaseCaseInterface<BaseListParams, ListInterface<ArticleContentEntity>> {
    async execute(params: BaseCaseParamsInterface<BaseListParams>): Promise<ListInterface<ArticleContentEntity>> {
        const data: ListInterface<ArticleContentEntity> = {
            items: [],
            meta: {
                count: 0,
                currentPage: params.pagination.page,
                pages: 0,
            },
        };

        data.meta.count = await Repository.ArticleContent().countDocumentsByFilter(params.filter);
        data.meta.pages = Math.ceil(data.meta.count / params.pagination.size);
        if (data.meta.pages < params.pagination.page) {
            data.meta.currentPage = data.meta.pages;
        }
        data.items = await Repository.ArticleContent().list(params.pagination, params.filter, params.sort);

        return data;
    }
}

export const getArticleContentListCase: BaseCaseInterface<BaseListParams, ListInterface<ArticleContentEntity>> = new GetArticleContentListCase();

import { Repository, BaseCaseInterface, BaseListParams, ListInterface, BaseCaseParamsInterface, ArticleEntity } from '../core';

export class GetArticleListCase implements BaseCaseInterface<BaseListParams, ListInterface<ArticleEntity>> {
    async execute(params: BaseCaseParamsInterface<BaseListParams>): Promise<ListInterface<ArticleEntity>> {
        const data: ListInterface<ArticleEntity> = {
            items: [],
            meta: {
                count: 0,
                currentPage: params.pagination.page,
                pages: 0,
            },
        };

        data.meta.count = await Repository.Article().countDocumentsByFilter(params.filter);
        data.meta.pages = Math.ceil(data.meta.count / params.pagination.size);
        if (data.meta.pages < params.pagination.page) {
            data.meta.currentPage = data.meta.pages;
        }
        data.items = await Repository.Article().list(params.pagination, params.filter, params.sort);

        return data;
    }
}

export const getArticleListCase: BaseCaseInterface<BaseListParams, ListInterface<ArticleEntity>> = new GetArticleListCase();

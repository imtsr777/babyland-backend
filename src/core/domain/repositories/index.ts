import {ArticleRepositoryInterface} from "../../infrastructure";
import {ArticleRepository} from "./article";


class RepositoryClass {
protected _articleRepository: ArticleRepositoryInterface;

    Article(): ArticleRepositoryInterface {
        if (!this._articleRepository) this._articleRepository = new ArticleRepository();
        return this._articleRepository;
    }

}


export * from './base';
export * from './article';

export const Repository = new RepositoryClass();
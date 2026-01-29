import {ArticleContentRepositoryInterface, ArticleRepositoryInterface} from "../../infrastructure";
import {ArticleContentRepository, ArticleRepository} from "./article";


class RepositoryClass {
protected _articleRepository: ArticleRepositoryInterface;
protected _articleContentRepository: ArticleContentRepositoryInterface;


    Article(): ArticleRepositoryInterface {
        if (!this._articleRepository) this._articleRepository = new ArticleRepository();
        return this._articleRepository;
    }

    ArticleContent(): ArticleContentRepositoryInterface {
        if (!this._articleContentRepository) this._articleContentRepository = new ArticleContentRepository();
        return this._articleContentRepository;
    }

}


export * from './base';
export * from './article';

export const Repository = new RepositoryClass();
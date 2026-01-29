import { BaseCRUDRepositoryInterface } from './base';
import { FilterQuery, Types } from 'mongoose';
import {ArticleContentEntity} from "../../domain";
import {ArticleContentSchema} from "../../database";

export interface ArticleContentRepositoryInterface extends BaseCRUDRepositoryInterface<ArticleContentEntity> {
    countDocumentsByFilter(filter: FilterQuery<ArticleContentSchema>): Promise<number>;
    delete(_id: Types.ObjectId): Promise<void>;
}

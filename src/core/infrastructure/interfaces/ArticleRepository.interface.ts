import { BaseCRUDRepositoryInterface } from './base';
import { FilterQuery, Types } from 'mongoose';
import {ArticleEntity} from "../../domain";
import {ArticleSchema} from "../../database";

export interface ArticleRepositoryInterface extends BaseCRUDRepositoryInterface<ArticleEntity> {
    countDocumentsByFilter(filter: FilterQuery<ArticleSchema>): Promise<number>;
    delete(_id: Types.ObjectId): Promise<void>;
}

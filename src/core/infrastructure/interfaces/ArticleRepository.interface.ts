import { BaseCRUDRepositoryInterface } from './base';
import { FilterQuery, Types } from 'mongoose';
import {ArticleEntity} from "../../domain";
import {ArticleSchema} from "../../database";
import {LanguageEnum} from "../enums";

export interface ArticleRepositoryInterface extends BaseCRUDRepositoryInterface<ArticleEntity> {
    countDocumentsByFilter(filter: FilterQuery<ArticleSchema>): Promise<number>;
    delete(_id: Types.ObjectId): Promise<void>;
    getBySlug(slug: string, language: LanguageEnum ): Promise<ArticleEntity>;
    getByOldSlug(slug: string): Promise<ArticleEntity>;
    isSlugTaken(slug: string, excludeId?: Types.ObjectId): Promise<boolean>;
}

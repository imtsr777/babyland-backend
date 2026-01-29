import { BaseCRUDRepository } from '../base';
import { ArticleContentEntity } from '../../entities';
import {ArticleContentModel, ArticleContentSchema} from '../../../database';
import { PaginationInterface, ArticleContentRepositoryInterface } from '../../../infrastructure';
import { FilterQuery, Types } from 'mongoose';


export class ArticleContentRepository
    extends BaseCRUDRepository<ArticleContentEntity, ArticleContentSchema>
    implements ArticleContentRepositoryInterface
{
    async create(articleContent: ArticleContentEntity): Promise<ArticleContentEntity> {
        const articleToCreate: ArticleContentSchema = articleContent.convertToSchema();
        const created = await ArticleContentModel.create(articleToCreate);
        return new ArticleContentEntity().convertToEntity(created);
    }

    async update(_article: ArticleContentEntity): Promise<ArticleContentEntity> {
        console.log(_article)
        const requiredFields: string[] = ['_id'];
        this.checkRequiredFields(requiredFields, _article);

        const articleToUpdate: ArticleContentSchema = _article.convertToSchema();

        const updated = await ArticleContentModel.findOneAndUpdate(
            { _id: _article.getId() },
            { $set: articleToUpdate },
            { new: true },
        );

        return new ArticleContentEntity().convertToEntity(updated);
    }

    async getById(_id: Types.ObjectId): Promise<ArticleContentEntity> {
        const found = await ArticleContentModel.findOne({ _id });
        return new ArticleContentEntity().convertToEntity(found);
    }

    async list(
        pagination?: PaginationInterface,
        filter?: FilterQuery<ArticleContentSchema>,
        sort?: any,
    ): Promise<Array<ArticleContentEntity>> {
        const items = await ArticleContentModel.find(filter)
            .limit(pagination.size)
            .skip((pagination.page - 1) * pagination.size)
            .sort(sort);

        return this.multipleConverter(items, ArticleContentEntity);
    }

    async countDocumentsByFilter(filter: FilterQuery<ArticleContentSchema>): Promise<number> {
        return ArticleContentModel.countDocuments(filter);
    }

    async delete(_id: Types.ObjectId): Promise<void> {
        await ArticleContentModel.deleteOne({ _id });
    }
}

import { BaseCRUDRepository } from '../base';
import { ArticleEntity } from '../../entities';
import { ArticleModel, ArticleSchema } from '../../../database';
import { PaginationInterface, ArticleRepositoryInterface } from '../../../infrastructure';
import { FilterQuery, Types } from 'mongoose';


export class ArticleRepository
    extends BaseCRUDRepository<ArticleEntity, ArticleSchema>
    implements ArticleRepositoryInterface
{
    async create(_article: ArticleEntity): Promise<ArticleEntity> {
        const articleToCreate: ArticleSchema = _article.convertToSchema();
        const created = await ArticleModel.create(articleToCreate);
        return new ArticleEntity().convertToEntity(created);
    }

    async update(_article: ArticleEntity): Promise<ArticleEntity> {
        console.log(_article)
        const requiredFields: string[] = ['_id'];
        this.checkRequiredFields(requiredFields, _article);

        const articleToUpdate: ArticleSchema = _article.convertToSchema();

        const updated = await ArticleModel.findOneAndUpdate(
            { _id: _article.getId() },
            { $set: articleToUpdate },
            { new: true },
        );

        return new ArticleEntity().convertToEntity(updated);
    }

    async getById(_id: Types.ObjectId): Promise<ArticleEntity> {
        const found = await ArticleModel.findOne({ _id });
        return new ArticleEntity().convertToEntity(found);
    }

    async list(
        pagination?: PaginationInterface,
        filter?: FilterQuery<ArticleSchema>,
        sort?: any,
    ): Promise<Array<ArticleEntity>> {
        const items = await ArticleModel.find(filter)
            .limit(pagination.size)
            .skip((pagination.page - 1) * pagination.size)
            .sort(sort);

        return this.multipleConverter(items, ArticleEntity);
    }

    async countDocumentsByFilter(filter: FilterQuery<ArticleSchema>): Promise<number> {
        return ArticleModel.countDocuments(filter);
    }

    async delete(_id: Types.ObjectId): Promise<void> {
        await ArticleModel.deleteOne({ _id });
    }
}

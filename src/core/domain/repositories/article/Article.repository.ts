import { BaseCRUDRepository } from '../base';
import { ArticleEntity } from '../../entities';
import { ArticleModel, ArticleSchema } from '../../../database';
import { ArticleRepositoryInterface, LanguageEnum, PaginationInterface } from '../../../infrastructure';
import { FilterQuery, Types } from 'mongoose';

export class ArticleRepository extends BaseCRUDRepository<ArticleEntity, ArticleSchema> implements ArticleRepositoryInterface {
  async create(_article: ArticleEntity): Promise<ArticleEntity> {
    const articleToCreate: ArticleSchema = _article.convertToSchema();
    const created = await ArticleModel.create(articleToCreate);
    return new ArticleEntity().convertToEntity(created);
  }

  async update(_article: ArticleEntity): Promise<ArticleEntity> {
    const requiredFields: string[] = ['_id'];
    this.checkRequiredFields(requiredFields, _article);

    const articleToUpdate: ArticleSchema = _article.convertToSchema();

    const updated = await ArticleModel.findOneAndUpdate({ _id: _article.getId() }, { $set: articleToUpdate }, { new: true });

    return new ArticleEntity().convertToEntity(updated);
  }

  async getById(_id: Types.ObjectId): Promise<ArticleEntity> {
    const found = await ArticleModel.findOne({ _id });
    return new ArticleEntity().convertToEntity(found);
  }

  async list(pagination?: PaginationInterface, filter?: FilterQuery<ArticleSchema>, sort?: any): Promise<Array<ArticleEntity>> {
    const items = await ArticleModel.find(filter)
      .limit(pagination.size)
      .skip((pagination.page - 1) * pagination.size)
      .sort(sort);

    return this.multipleConverter(items, ArticleEntity);
  }

  async countDocumentsByFilter(filter: FilterQuery<ArticleSchema>): Promise<number> {
    return ArticleModel.countDocuments(filter);
  }

  async getBySlug(slug: string, language: LanguageEnum): Promise<ArticleEntity> {
    let filter: FilterQuery<any>;
    if (language === LanguageEnum.UZ) {
      filter = { 'slug.uz': slug };
    } else {
      filter = { 'slug.ru': slug };
    }

    const found = await ArticleModel.findOne(filter);
    return new ArticleEntity().convertToEntity(found);
  }

  async getByOldSlug(slug: string): Promise<ArticleEntity> {
    const found = await ArticleModel.findOne({ oldSlugs: slug });
    return new ArticleEntity().convertToEntity(found);
  }

  /** Slug boshqa maqolada (joriy yoki eski slug sifatida) band qilinganmi */
  async isSlugTaken(slug: string, excludeId?: Types.ObjectId): Promise<boolean> {
    const filter: FilterQuery<ArticleSchema> = {
      $or: [{ 'slug.uz': slug }, { 'slug.ru': slug }, { oldSlugs: slug }],
    };
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }
    return (await ArticleModel.countDocuments(filter)) > 0;
  }

  async delete(_id: Types.ObjectId): Promise<void> {
    await ArticleModel.deleteOne({ _id });
  }
}

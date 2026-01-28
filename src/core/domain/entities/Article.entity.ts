import {Types} from 'mongoose';
import {BaseEntityInterface, ArticleStatusEnum} from '../../infrastructure';
import {ArticleSchema, TranslatesSchema} from '../../database';
import {TranslatesEntity} from './Translates.entity';

export class ArticleEntity implements BaseEntityInterface<ArticleEntity, ArticleSchema> {
    protected _id?: Types.ObjectId;
    protected _title: TranslatesEntity;
    protected _description: TranslatesEntity;
    protected _image: string;
    protected _status: ArticleStatusEnum;
    protected _createdAt?: Date;
    protected _updatedAt?: Date;

    /** ================= BUILDERS ================= */

    buildId(id: Types.ObjectId): ArticleEntity {
        this._id = id;
        return this;
    }

    buildTitle(arg: TranslatesSchema): ArticleEntity {
        this._title = new TranslatesEntity().convertToEntity(arg);
        return this;
    }

    buildDescription(arg: TranslatesSchema): ArticleEntity {
        this._description = new TranslatesEntity().convertToEntity(arg);
        return this;
    }

    buildImage(image: string): ArticleEntity {
        this._image = image;
        return this;
    }

    buildStatus(status: ArticleStatusEnum): ArticleEntity {
        this._status = status;
        return this;
    }

    buildCreatedAt(date: Date): ArticleEntity {
        this._createdAt = date;
        return this;
    }

    buildUpdatedAt(date: Date): ArticleEntity {
        this._updatedAt = date;
        return this;
    }

    /** ================= GETTERS ================= */

    getId(): Types.ObjectId {
        return this._id;
    }

    getTitle(): TranslatesEntity {
        return this._title;
    }

    getDescription(): TranslatesEntity {
        return this._description;
    }

    getImage(): string {
        return this._image;
    }

    getStatus(): ArticleStatusEnum {
        return this._status;
    }

    getCreatedAt(): Date {
        return this._createdAt;
    }

    getUpdatedAt(): Date {
        return this._updatedAt;
    }

    /** ================= CONVERTERS ================= */

    convertToEntity(schema: ArticleSchema): ArticleEntity {
        return schema ? this
            .buildId(schema._id)
            .buildTitle(schema.title)
            .buildDescription(schema.description)
            .buildImage(schema.image)
            .buildStatus(schema.status)
            .buildCreatedAt(schema.createdAt)
            .buildUpdatedAt(schema.updatedAt) : null;
    }

    convertToSchema(): ArticleSchema {


        return this ? {
            _id: this.getId(),
            title: this.getTitle() ? this.getTitle().convertToSchema() : null,
            description: this.getDescription() ? this.getDescription()?.convertToSchema() : null,
            image: this.getImage(),
            status: this.getStatus(),
            createdAt: this.getCreatedAt(),
            updatedAt: this.getUpdatedAt(),
        } : null;
    }
}

import { Types } from 'mongoose';
import { BaseEntityInterface, ArticleContentTypeEnum } from '../../infrastructure';
import {ArticleContentSchema, TranslatesSchema} from '../../database';
import {TranslatesEntity} from "./Translates.entity";

export class ArticleContentEntity implements BaseEntityInterface<ArticleContentEntity, ArticleContentSchema> {
    protected _id?: Types.ObjectId;
    protected _article?: Types.ObjectId;
    protected _order: number;
    protected _image?: string;
    protected _paragraph?: TranslatesEntity;
    protected _text?: TranslatesEntity;
    protected _type: ArticleContentTypeEnum;
    protected _createdAt?: Date;
    protected _updatedAt?: Date;

    /** ================= BUILDERS ================= */

    buildId(id: Types.ObjectId): ArticleContentEntity {
        this._id = id;
        return this;
    }

    buildArticle(article: Types.ObjectId): ArticleContentEntity {
        this._article = article;
        return this;
    }

    buildOrder(order: number): ArticleContentEntity {
        this._order = order;
        return this;
    }

    buildImage(image: string): ArticleContentEntity {
        this._image = image;
        return this;
    }

    buildParagraph(arg: TranslatesSchema): ArticleContentEntity {
        this._paragraph = new TranslatesEntity().convertToEntity(arg);
        return this;
    }

    buildText(text: TranslatesSchema): ArticleContentEntity {
        this._text = new TranslatesEntity().convertToEntity(text);
        return this;
    }

    buildType(type: ArticleContentTypeEnum): ArticleContentEntity {
        this._type = type;
        return this;
    }

    buildCreatedAt(date: Date): ArticleContentEntity {
        this._createdAt = date;
        return this;
    }

    buildUpdatedAt(date: Date): ArticleContentEntity {
        this._updatedAt = date;
        return this;
    }

    /** ================= GETTERS ================= */

    getId(): Types.ObjectId {
        return this._id;
    }

    getArticle(): Types.ObjectId {
        return this._article;
    }

    getOrder(): number {
        return this._order;
    }

    getImage(): string {
        return this._image;
    }

    getParagraph(): TranslatesEntity {
        return this._paragraph;
    }

    getText(): TranslatesEntity {
        return this._text;
    }

    getType(): ArticleContentTypeEnum {
        return this._type;
    }

    getCreatedAt(): Date {
        return this._createdAt;
    }

    getUpdatedAt(): Date {
        return this._updatedAt;
    }

    /** ================= CONVERTERS ================= */

    convertToEntity(schema: ArticleContentSchema): ArticleContentEntity {
        if (!schema) return null;

        return this
            .buildId(schema._id)
            .buildArticle(schema.article)
            .buildOrder(schema.order)
            .buildImage(schema.image)
            .buildParagraph(schema.paragraph)
            .buildText(schema.text)
            .buildType(schema.type)
            .buildCreatedAt(schema.createdAt)
            .buildUpdatedAt(schema.updatedAt);
    }

    convertToSchema(): ArticleContentSchema {
        if (!this) return null;

        return {
            _id: this.getId(),
            article: this.getArticle(),
            order: this.getOrder(),
            image: this.getImage(),
            paragraph: this.getParagraph() ? this.getParagraph().convertToSchema() : null,
            text: this.getText() ? this.getText().convertToSchema() : null,
            type: this.getType(),
            createdAt: this.getCreatedAt(),
            updatedAt: this.getUpdatedAt(),
        };
    }
}

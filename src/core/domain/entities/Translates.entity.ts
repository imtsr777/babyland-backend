import { BaseEntityInterface, LanguageEnum } from '../../infrastructure';
import { TranslatesSchema } from '../../database';


export class TranslatesEntity implements BaseEntityInterface<TranslatesEntity, TranslatesSchema> {
    protected _uz: string;
    protected _ru: string;

    /** Builders */
    buildUz(uz: string): TranslatesEntity {
        this._uz = uz;
        return this;
    }

    buildRu(ru: string): TranslatesEntity {
        this._ru = ru;
        return this;
    }

    /** Getters */
    getUz(): string {
        return this._uz;
    }

    getRu(): string {
        return this._ru;
    }

    getByLang(lang: string = LanguageEnum.UZ): string {
        return this[`_${lang}`] ?? this[`_${LanguageEnum.UZ}`];
    }

    /** Conversion Methods */
    convertToEntity(arg: TranslatesSchema): TranslatesEntity {
        return arg
            ? this.buildUz(arg.uz)
                .buildRu(arg.ru)
            : null;
    }

    convertToSchema(): TranslatesSchema {
        return this
            ? {
                uz: this.getUz(),
                ru: this.getRu(),
            }
            : null;
    }
}

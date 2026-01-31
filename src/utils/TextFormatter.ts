

export class TextFormatter {
    // Simple translit map for Cyrillic → Latin
    private cyrillicMap = {
        'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i','й':'y',
        'к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f',
        'х':'x','ц':'ts','ч':'ch','ш':'sh','щ':'sch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya',
        'А':'A','Б':'B','В':'V','Г':'G','Д':'D','Е':'E','Ё':'Yo','Ж':'Zh','З':'Z','И':'I','Й':'Y',
        'К':'K','Л':'L','М':'M','Н':'N','О':'O','П':'P','Р':'R','С':'S','Т':'T','У':'U','Ф':'F',
        'Х':'X','Ц':'Ts','Ч':'Ch','Ш':'Sh','Щ':'Sch','Ъ':'','Ы':'Y','Ь':'','Э':'E','Ю':'Yu','Я':'Ya'
    };

    private translitCyrillic(str) {
        return str.split('').map(char => this.cyrillicMap[char] || char).join('');
    }

    generateSlug(title): string {
        let slug = this.translitCyrillic(title)          // Cyrillic → Latin
            .toLowerCase()               // kichik harf
            .trim()                      // bosh va oxirgi bo‘sh joy
            .replace(/[^a-z0-9\s-]/g, '') // maxsus belgilarni olib tashlash
            .replace(/\s+/g, '-')        // bo‘sh joy → tire
            .replace(/-+/g, '-');        // ketma-ket tire → bitta tire
        return slug;
    }

    isCyrillic(text) {
        // Kirill harflari diapazoni: \u0400 - \u04FF
        const cyrillicRegex = /[\u0400-\u04FF]/;
        return cyrillicRegex.test(text);
    }
}
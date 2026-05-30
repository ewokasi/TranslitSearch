import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const CYR_TO_LAT = {
    'й':'q','ц':'w','у':'e','к':'r','е':'t','н':'y','г':'u','ш':'i','щ':'o','з':'p','х':'[','ъ':']',
    'ф':'a','ы':'s','в':'d','а':'f','п':'g','р':'h','о':'j','л':'k','д':'l','ж':';','э':"'",
    'я':'z','ч':'x','с':'c','м':'v','и':'b','т':'n','ь':'m','б':',','ю':'.',
    'Й':'Q','Ц':'W','У':'E','К':'R','Е':'T','Н':'Y','Г':'U','Ш':'I','Щ':'O','З':'P',
    'Ф':'A','Ы':'S','В':'D','А':'F','П':'G','Р':'H','О':'J','Л':'K','Д':'L',
    'Я':'Z','Ч':'X','С':'C','М':'V','И':'B','Т':'N','Ь':'M',
};

function hasCyrillic(text) {
    return /[а-яА-Я]/.test(text);
}

function transliterate(text) {
    return [...text].map(c => CYR_TO_LAT[c] ?? c).join('');
}

export default class TranslitSearchExtension {
    enable() {
        this._searchResults = Main.overview.searchController._searchResults;
        this._originalSetTerms = this._searchResults.setTerms.bind(this._searchResults);

        const self = this;
        this._searchResults.setTerms = function (terms) {
            if (terms.length > 0 && terms.some(t => hasCyrillic(t)))
                terms = terms.map(t => transliterate(t));
            self._originalSetTerms(terms);
        };
    }

    disable() {
        if (this._searchResults && this._originalSetTerms)
            this._searchResults.setTerms = this._originalSetTerms;
        this._searchResults = null;
        this._originalSetTerms = null;
    }
}

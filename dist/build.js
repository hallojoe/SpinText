var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var SpinText;
(function (SpinText) {
    var StringBuilder = /** @class */ (function () {
        function StringBuilder(value) {
            if (value === void 0) { value = ""; }
            this._strings = new Array();
            this.append(value);
        }
        StringBuilder.prototype.append = function (value) {
            if (value)
                this._strings.push(value);
        };
        StringBuilder.prototype.clear = function () {
            this._strings = new Array();
        };
        StringBuilder.prototype.toString = function () {
            var result = this._strings.join("");
            return result;
        };
        return StringBuilder;
    }());
    SpinText.StringBuilder = StringBuilder;
})(SpinText || (SpinText = {}));
var SpinText;
(function (SpinText) {
    var Random = /** @class */ (function () {
        function Random(seed) {
            if (seed === void 0) { seed = -1; }
            this._seedStart = seed;
            if (this._seedStart <= 0)
                this._seedStart = Math.floor(Math.random() * 99999) + 11111;
            this._seed = this._seedStart;
        }
        Random.prototype.next = function (min, max) {
            if (min === void 0) { min = 0; }
            if (max === void 0) { max = 0; }
            this._seed = (this._seedStart * 9301 + 49297) % 233281; //changed 233280 to 233281 
            var rnd = this._seed / 233281; // changed 233280 to 233281 
            var result = min + rnd * (max - min + 1);
            return result;
        };
        Random.prototype.nextInt = function (min, max) {
            var result = Math.floor(this.next(min, max)); // changed round to floor
            return result;
        };
        return Random;
    }());
    SpinText.Random = Random;
})(SpinText || (SpinText = {}));
var SpinText;
(function (SpinText) {
    /// <summary>
    /// Simple helper that allow counting words within a string
    /// </summary>
    var TextHelper = /** @class */ (function () {
        function TextHelper() {
        }
        /// <summary>
        /// Counts number of words within a string
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        TextHelper.WordsCount = function (s) {
            s = s.trim();
            var pattern = "[" + this.escapeRegExp(this._seperators.join()) + "]";
            var values = s.split(new RegExp(pattern, "g"));
            var result = 0;
            for (var i = 0; i < values.length; i++)
                if (values[i].trim() !== '')
                    result += 1;
            return result;
        };
        TextHelper.escapeRegExp = function (s) {
            return s.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        };
        /// <summary>
        /// Word seperators
        /// </summary>
        TextHelper._seperators = [' ', ',', ';', '.', '!', '"', '(', ')', '?'];
        return TextHelper;
    }());
    SpinText.TextHelper = TextHelper;
})(SpinText || (SpinText = {}));
var SpinText;
(function (SpinText) {
    var ParserConfig = /** @class */ (function () {
        function ParserConfig(seed) {
            if (seed === void 0) { seed = -1; }
            this.opening = '{';
            this.closing = '}';
            this.delimiter = '|';
            this.seed = seed;
            this.random = new SpinText.Random(this.seed);
        }
        ParserConfig.prototype.reSeed = function () {
            this.random = new SpinText.Random();
        };
        return ParserConfig;
    }());
    SpinText.ParserConfig = ParserConfig;
})(SpinText || (SpinText = {}));
var SpinText;
(function (SpinText) {
    var ConcatenetedText = /** @class */ (function (_super) {
        __extends(ConcatenetedText, _super);
        function ConcatenetedText() {
            var _newTarget = this.constructor;
            var _this = _super.call(this) || this;
            Object.setPrototypeOf(_this, _newTarget.prototype);
            return _this;
        }
        ConcatenetedText.prototype.toString = function () {
            var sb = new SpinText.StringBuilder();
            this.forEach(function (tp) {
                sb.append(tp.toString());
            });
            return sb.toString();
        };
        ConcatenetedText.prototype.toStructuredString = function () {
            var sb = new SpinText.StringBuilder();
            this.forEach(function (tp) {
                sb.append(tp.toStructuredString());
            });
            return sb.toString();
        };
        ConcatenetedText.prototype.countVariants = function () {
            var res = 1;
            this.forEach(function (tp) {
                if (res <= 100000) // stop counting after reaching 100000
                    res = res * tp.countVariants();
            });
            return res;
        };
        ConcatenetedText.prototype.countMinWords = function () {
            var res = 0;
            this.forEach(function (tp) {
                res = res + tp.countMinWords();
            });
            return res;
        };
        ConcatenetedText.prototype.countMaxWords = function () {
            var res = 0;
            this.forEach(function (tp) {
                res = res + tp.countMaxWords();
            });
            return res;
        };
        return ConcatenetedText;
    }(Array));
    SpinText.ConcatenetedText = ConcatenetedText;
})(SpinText || (SpinText = {}));
var SpinText;
(function (SpinText) {
    var SimpleText = /** @class */ (function () {
        function SimpleText(text) {
            this._wordsCount = -1;
            this._text = text;
        }
        SimpleText.prototype.WordsCount = function () {
            return (this._wordsCount == -1) ? SpinText.TextHelper.WordsCount(this._text) : this._wordsCount;
        };
        SimpleText.prototype.toString = function () {
            return this._text;
        };
        SimpleText.prototype.toStructuredString = function () {
            return this._text;
        };
        SimpleText.prototype.countVariants = function () {
            return 1;
        };
        SimpleText.prototype.countMinWords = function () {
            return this.WordsCount();
        };
        SimpleText.prototype.countMaxWords = function () {
            return this.WordsCount();
        };
        SimpleText.Empty = function () {
            return new SimpleText("");
        };
        return SimpleText;
    }());
    SpinText.SimpleText = SimpleText;
})(SpinText || (SpinText = {}));
var SpinText;
(function (SpinText) {
    var AlternatedText = /** @class */ (function (_super) {
        __extends(AlternatedText, _super);
        function AlternatedText(rnd, level) {
            var _newTarget = this.constructor;
            if (level === void 0) { level = 0; }
            var _this = _super.call(this) || this;
            Object.setPrototypeOf(_this, _newTarget.prototype);
            _this._rnd = rnd != null ? rnd : new SpinText.Random(-1);
            _this._level = level;
            return _this;
        }
        AlternatedText.prototype.toString = function () {
            if (this.length === 0)
                return "";
            var chosedIdx = this._rnd.nextInt(0, this.length - 1);
            var result = this[chosedIdx].toString();
            return result;
        };
        AlternatedText.prototype.toStructuredString = function () {
            var sb = new SpinText.StringBuilder();
            var first = true;
            sb.append("{");
            this.forEach(function (el) {
                if (first)
                    first = false;
                else
                    sb.append("|");
                sb.append(el.toStructuredString());
            });
            sb.append("}");
            return sb.toString();
        };
        AlternatedText.prototype.countVariants = function () {
            var res = 0;
            this.forEach(function (tp) {
                if (res <= 100000) // stop counting after reaching 100000
                    res += tp.countVariants();
            });
            return res;
        };
        AlternatedText.prototype.countMinWords = function () {
            var counter = 0;
            this.forEach(function (tp) {
                var minWords = tp.countMinWords();
                if (counter === 0)
                    counter = minWords;
                if (minWords < counter && minWords > 0)
                    counter = minWords;
            });
            return counter;
        };
        AlternatedText.prototype.countMaxWords = function () {
            var counter = 0;
            this.forEach(function (tp) {
                var maxWords = tp.countMinWords();
                if (maxWords > counter)
                    counter = maxWords;
            });
            return counter;
        };
        return AlternatedText;
    }(Array));
    SpinText.AlternatedText = AlternatedText;
})(SpinText || (SpinText = {}));
var SpinText;
(function (SpinText) {
    var Engine = /** @class */ (function () {
        function Engine(text, config) {
            this._part = Engine.ParsePart(text, 0, text.length, config);
            this._cfg = config;
        }
        Engine.ParsePart = function (text, startIdx, endIdx, config) {
            if (config === void 0) { config = new SpinText.ParserConfig(-1); }
            if (config.seed <= 0)
                config.reSeed();
            var at = new SpinText.AlternatedText(config.random), ct = new SpinText.ConcatenetedText(), part = null;
            var balance = 0, // amount of unmatched opening brackets      
            i = 0, // index of current char      
            opnIdx = -1; // position of the opening bracket
            for (i = startIdx; i <= endIdx - 1; i++) {
                // opening
                // =======
                if (text[i] === config.opening) {
                    if (balance == 0) {
                        part = text.substr(startIdx, i - startIdx);
                        if (part !== null && part !== "")
                            ct.push(new SpinText.SimpleText(part));
                        startIdx = i + 1;
                        opnIdx = i;
                    }
                    balance += 1;
                }
                // delimiter
                // =========
                else if (text[i] === config.delimiter && balance === 0) {
                    part = text.substr(startIdx, i - startIdx);
                    ct.push(new SpinText.SimpleText(part)); // no check for empty string - by design
                    at.push(ct); // add to alternatives
                    ct = new SpinText.ConcatenetedText();
                    startIdx = i + 1;
                }
                // closing
                // =======
                else if (text[i] === config.closing) {
                    balance -= 1;
                    if (balance === 0) {
                        var innerPart = Engine.ParsePart(text, opnIdx + 1, i, config);
                        ct.push(innerPart);
                        opnIdx = -1;
                        startIdx = i + 1;
                    }
                    else if (balance < 0)
                        throw "Unexpected " + config.closing + " at position " + i.toString();
                }
            }
            // if positive balance then trow exception
            // =======================================
            if (balance > 0)
                throw config.opening + " at position " + opnIdx + " is unmatched";
            // get part
            // ========
            part = text.substr(startIdx, i - startIdx);
            // add part to ConcatenatedText
            // ============================
            if (part !== null && part !== "")
                ct.push(new SpinText.SimpleText(part));
            // were there alternatives ?
            // =========================
            if (at.length === 0)
                return ct; // return ConcatenatedText
            else
                at.push(ct); // push 
            // return
            // ======
            return at;
        };
        Engine.prototype.toString = function () {
            return this._part.toString();
        };
        Engine.prototype.toStructuredString = function () {
            return this._part.toStructuredString();
        };
        Engine.prototype.countVariants = function () {
            return this._part.countVariants();
        };
        Engine.prototype.countMinWords = function () {
            return this._part.countMinWords();
        };
        Engine.prototype.countMaxWords = function () {
            return this._part.countMaxWords();
        };
        Engine.Spin = function (text, config) {
            if (text === void 0) { text = ''; }
            if (config === void 0) { config = new SpinText.ParserConfig(-1); }
            if (text === '')
                text = "{This is|It's} {Spin|Spin-text|Spin text}. {Enjoy!| You love it!}";
            return new Engine(text, config).toString();
        };
        return Engine;
    }());
    SpinText.Engine = Engine;
})(SpinText || (SpinText = {}));
//# sourceMappingURL=build.js.map
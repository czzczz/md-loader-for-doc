"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = __importDefault(require("./parser"));
var cheerio_1 = __importDefault(require("cheerio"));
function renderVueTemplate(html) {
    var $ = cheerio_1.default.load(html, {
        decodeEntities: false,
        lowerCaseAttributeNames: false,
        lowerCaseTags: false,
    });
    $('style').remove();
    $('script').remove();
    var result = "<template><section class=\"markdown-body\">" + $.html() + "</section></template>\n";
    return result;
}
var load = function (source) {
    var _this = this;
    if (typeof source !== 'string')
        return source;
    this.cacheable();
    var parser = parser_1.default();
    var code = parser
        .render(source.replace(/@/g, 'at__'))
        .replace(/at__/g, '@')
        .replace(/\ssrc="(.*?)"/g, function (match, path) {
        // 相对路径引用的资源，解析为别名引用
        return " src=\"@" + (_this.context.slice(_this.context.lastIndexOf('src') + 3).replace(/\//g, '/') +
            '/' +
            decodeURIComponent(path)) + "\"";
    });
    // .replace(/&lt;slot[\s\S]*?&gt;&lt;\/slot&gt;/gi, v => {
    // 	// slot支持
    // 	return v
    // 		.replace(/_&/g, ' ')
    // 		.replace(/&quot;/g, '"')
    // 		.replace(/&lt;/g, '<')
    // 		.replace(/&gt;/g, '>')
    // 		.replace(/&amp;/g, '&');
    // });
    var ret = "\n        " + renderVueTemplate(code) + "\n    ";
    if (this.context.endsWith('notes'))
        console.log(code, ret);
    return "module.exports = " + ret;
};
exports.default = load;

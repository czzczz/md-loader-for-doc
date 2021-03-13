"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var markdown_it_1 = __importDefault(require("markdown-it"));
var highlight_js_1 = __importDefault(require("highlight.js"));
function collectAlias(lang) {
    // 处理语法别名
    switch (lang) {
        case 'vue':
            return 'html';
        case 'tsx':
            return 'ts';
        case 'jsx':
            return 'js';
        default:
            return lang;
    }
}
function codeBlockHightLight(str, lang, attrs) {
    lang = collectAlias(lang);
    if (lang === 'tsx')
        console.log(str);
    var l = lang && highlight_js_1.default.getLanguage(lang);
    if (!l)
        return str;
    else
        return highlight_js_1.default.highlight(lang, str, true).value;
}
exports.default = (function () {
    // 初始化markdownit
    var parser = new markdown_it_1.default('default', {
        html: false,
        highlight: codeBlockHightLight,
    });
    return parser;
});

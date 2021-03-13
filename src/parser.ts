import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

function collectAlias(lang: string) {
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

function codeBlockHightLight(str: string, lang: string, attrs: string) {
	lang = collectAlias(lang);
	if (lang === 'tsx') console.log(str);
	const l = lang && hljs.getLanguage(lang);
	if (!l) return str;
	else return hljs.highlight(lang, str, true).value;
}

export default () => {
	// 初始化markdownit
	const parser: MarkdownIt = new MarkdownIt('default', {
		html: false,
		highlight: codeBlockHightLight,
	});
	return parser;
};

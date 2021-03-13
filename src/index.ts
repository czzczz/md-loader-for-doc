import { loader } from 'webpack';
import initParser from './parser';
import cheerio from 'cheerio';

function renderVueTemplate(html: string) {
	const $ = cheerio.load(html, {
		decodeEntities: false,
		lowerCaseAttributeNames: false,
		lowerCaseTags: false,
	});
	$('style').remove();
	$('script').remove();
	const result = `<template><section class="markdown-body">` + $.html() + `</section></template>\n`;

	return result;
}

const load: loader.Loader = function (source) {
	if (typeof source !== 'string') return source;

	this.cacheable();

	const parser = initParser();

	const code = parser
		.render(source.replace(/@/g, 'at__'))
		.replace(/at__/g, '@')
		.replace(/\ssrc="(.*?)"/g, (match, path) => {
			// 相对路径引用的资源，解析为别名引用
			return ` src="@${
				this.context.slice(this.context.lastIndexOf('src') + 3).replace(/\//g, '/') +
				'/' +
				decodeURIComponent(path)
			}"`;
		})
		.replace(/&lt;slot[\s\S]*?&gt;&lt;\/slot&gt;/gi, v => {
			// slot支持
			return v
				.replace(/_&/g, ' ')
				.replace(/&quot;/g, '"')
				.replace(/&lt;/g, '<')
				.replace(/&gt;/g, '>')
				.replace(/&amp;/g, '&');
		});

	const ret: string = `
        ${renderVueTemplate(code)}
    `;

	if (this.context.endsWith('notes')) console.log(code, ret);

	return `module.exports = ${ret}`;
};

export default load;

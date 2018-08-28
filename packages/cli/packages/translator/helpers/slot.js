var path = require('path');
const jsx = require('../utils');
const generate = require('babel-generator').default;
const prettifyXml = require('prettify-xml');
const queue = require('../queue');
/**
 * 用于生成组件标签的innerHTML中对应的Fragment
 * @param {*} children 
 * @param {*} fragmentUid 
 * @param {*} modules 
 * @param {*} wxmlHelper 
 */
module.exports = function slotHelper(
    children,
    fragmentUid,
    modules,
    wxmlHelper
) {
    var template = jsx.createElement(
        'template',
        [jsx.createAttribute('name', fragmentUid)],
        children
    );
    var wxml = wxmlHelper(generate(template).code, modules).replace(/;$/, '');
    if (!modules.fragmentPath) {
        modules.fragmentPath =
            modules.sourcePath.split(`src${path.sep}pages`)[0] +
            `dist${path.sep}components${path.sep}Fragments${path.sep}`;
    }
    queue.wxml.push({
        type: 'wxml',
        path: modules.fragmentPath + fragmentUid + '.wxml',
        code: prettifyXml(wxml, {
            indent: 2
        })
    });
};

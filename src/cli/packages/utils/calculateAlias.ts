import * as path from 'path';
const cwd = process.cwd();
const nodeResolve = require('resolve');

const getDistPath = require('./getDistPath');
function fixPath (p: string) {
    p = p.replace(/\\/g, '/');
    return /^\w/.test(p) ? './' + p : p;
}
/**
 * 根据当前文件的绝对路径，以及它 import 模块的资源名，求出引用模块资源的相对路径。
 * 核心是求出import的模块绝对路径，然后 path.relative 走你。
 * @param {string} srcPath 当前文件绝对路径
 * @param {string} importerSource import或者@import的模块路径
 * @return {string} 引用的模块名的相对路径
 */
// import Cat from '@components/Cat/index';
// import Cat from '@PageIndex/Components/Cat/index;
// import a from './a';
// import b from '../b';
// import md5 from 'md5';
// @import url('@globalStyle/reset.css');
function calculateAlias(srcPath: string, importerSource: string, ignoredPaths?: Array<string|RegExp>): string {
    const aliasMap = require('./calculateAliasConfig')();
    if (ignoredPaths && ignoredPaths.find((p) => importerSource === p)) {
        return '';
    }
    if (!path.isAbsolute(srcPath)) {
        console.error(`计算alias中的 ${srcPath} 必须为绝对路径.`);
        process.exit(1);
    }

    if (path.isAbsolute(importerSource)) {
        let from = path.dirname(srcPath);
        let to = importerSource.replace(/\.js$/, '');
        from = getDistPath(from);
        to = getDistPath(to);
        return fixPath(path.relative(from, to));
    }

    let rsegments = importerSource.split('/');
    //import a from './a';
    //import b from '../b';
    if (/^\./.test(rsegments[0])) {
        return importerSource;
    }
    //import Cat from '@components/Cat/index';
    //import Cat from '@PageIndex/Components/Cat/index;
    //@import url('@globalStyle/reset.scss');
    if ( aliasMap[ rsegments[0] ] ) {
        let from = path.dirname(getDistPath(srcPath));
        //@common/b/c ==> userPath/project/source/common/a/b
        let to = importerSource.replace( 
            new RegExp(rsegments[0]),
            aliasMap[ rsegments[0] ]
        );
        to = getDistPath(to);
    
       
        return fixPath(path.relative(from, to));
    }

    //上面都没匹配到的，那就是 node_modules 模块了
    //import cookie from 'cookie';
    try {
        let from = path.dirname( getDistPath(srcPath));
        let to = nodeResolve.sync(importerSource, {
            basedir: cwd
        });
        to = getDistPath(to);
        return fixPath(path.relative(from, to));
    } catch (e) {
        // eslint-disable-next-line
        console.log(e);
        return;
    }
    
}
module.exports = calculateAlias;
export default calculateAlias;
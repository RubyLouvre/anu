const path = require('path');
const fs = require('fs-extra');
const R = require('ramda');

const intermediateDirectoryName =
  '__intermediate__directory__do__not__modify__';
const sourceDirectoryName = 'source';
const assetsDirectoryName = 'assets';
const outputDirectory = 'dist';
const production = process.env.NODE_ENV === 'production';
const rootDirectory = path.resolve(__dirname, '../../packages/h5Helpers/pageWrapper');

const resolveFromContext = R.curryN(2, path.resolve)(rootDirectory);

function resolveNanachiAlias(alias) {
    const resolved = {
        '@assets': resolveFromContext(`${intermediateDirectoryName}/assets`)
    };

    Object.keys(alias).forEach(function(k) {
        // NOTE
        // nanachi 定义的路径是相对于项目根目录的
        // 而在这应该是相对于 source 目录的
        // 因此需要去掉 source/ 前缀
        const nanachiAlias = alias[k].replace('source/', '');

        resolved[k] = resolveFromContext(
            `${intermediateDirectoryName}/${nanachiAlias}`
        );
    });

    return resolved;
}

function retrieveNanachiConfig() {
    const cwd = process.env.NANACHI_CWD || process.cwd();
    const resolveFromDirCwd = R.curryN(2, path.resolve)(cwd);
    const packageJSONPath = resolveFromDirCwd('package.json');
    const packageJson =
      fs.readJSONSync(packageJSONPath) ||
      new Error(`cannot find package.json in ${cwd}`);
    const { nanachi = {} } = packageJson;
    const { alias = {} } = nanachi;
    return resolveNanachiAlias(alias);
}

module.exports = {
    intermediateDirectoryName,
    sourceDirectoryName,
    assetsDirectoryName,
    outputDirectory,
    rootDirectory,
    production,
    retrieveNanachiConfig
};

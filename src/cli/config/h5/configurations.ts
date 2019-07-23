import * as path from 'path';
import { Alias } from '../../consts/alias';
import * as fs from 'fs-extra';
import R from 'ramda';

export const intermediateDirectoryName =
  '__intermediate__directory__do__not__modify__';
export const sourceDirectoryName = 'source';
export const assetsDirectoryName = 'assets';
export const outputDirectory = 'dist';
export const production = process.env.NODE_ENV === 'production';
export const rootDirectory = path.resolve(process.cwd(), 'dist');

const resolveFromContext = R.curryN(2, path.resolve)(rootDirectory);

function resolveNanachiAlias(alias: Alias) {
    const resolved: Alias = {
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

export function retrieveNanachiConfig() {
    const cwd = process.env.NANACHI_CWD || process.cwd();
    const resolveFromDirCwd = R.curryN(2, path.resolve)(cwd);
    const packageJSONPath = resolveFromDirCwd('package.json');
    let packageJson: any = {};
    try {
        packageJson = fs.readJSONSync(packageJSONPath)
    } catch (e) {

    }
    const { nanachi = {} } = packageJson;
    const { alias = {} } = nanachi;
    return resolveNanachiAlias(alias);
}


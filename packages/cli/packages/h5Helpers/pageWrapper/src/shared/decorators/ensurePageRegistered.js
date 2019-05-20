import { parse } from 'url';
import path from 'path';
import * as R from 'ramda';
import PagePath from '@shared/entities/PagePath';

// SPECIAL CASE
// 开发者可能以相对路径，如 ../../pages/index/index 调用
// 此时需要先对 url 正则化
// 否则会报找不到页面的错误
// 因为页面注册时的 pathname 都是 /pages 开头的
const resolveAsAbsolutePath = R.compose(
  PagePath.normalizeWithLeadingSlash,
  R.replace(/^([/.]*)(?=\/)/, '')
);

const retrieveCurrentPathname = R.compose(
  path.dirname,
  R.path(['lastPage', 'url', 'path'])
);

function ensureUrlExist(url) {
  if (!url) {
    throw new Error(`url provided is invalid, got ${url}, should be a string.`);
  }
}

export default function ensurePageRegistered(target, name, descriptor) {
  const fn = descriptor.value;

  descriptor.value = function(config) {
    let { url } = config;

    ensureUrlExist(url);

    const absoluteUrl = resolveAsAbsolutePath(url);
    const relativeUrl = path.resolve(retrieveCurrentPathname(this), url);
    const { pathname: absolutePathname } = parse(absoluteUrl);
    const { pathname: relativePathname } = parse(relativeUrl);

    switch (true) {
      case !!this.components[absolutePathname]:
        url = absoluteUrl;
        break;

      case !!this.components[relativePathname]:
        url = relativeUrl;
        break;

      default:
        throw new TypeError(
          `Invalid url \`${url}\`. Page for \`${
            parse(url).pathname
          }\` is not registered.`
        );
    }

    fn.call(this, { ...config, url });
  };

  return descriptor;
}

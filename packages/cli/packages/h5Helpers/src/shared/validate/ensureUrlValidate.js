import { parse } from 'url';
import { isNil } from 'ramda';

export default function(url) {
  const { pathname } = parse(url);

  if (isNil(pathname)) {
    throw new Error(
      `Provided url ${url} for register is not valid, ` +
        'make sure the provided url has a valid pathname, eg. `pages/foo/index`'
    );
  }

  return pathname;
}

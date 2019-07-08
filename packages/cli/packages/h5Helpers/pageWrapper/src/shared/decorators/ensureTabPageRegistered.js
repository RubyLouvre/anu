import { parse } from 'url';

export default function ensureTabPagRegistered(target, name, descriptor) {
  const fn = descriptor.value;

  descriptor.value = function({ pagePath: url }) {
    if (!url) {
      throw new Error(`url is not valid, got ${url}`);
    }

    function normalizeUrl(url) {
      if (url.charAt(0) !== '/') return '/' + url;
      return url;
    }

    url = normalizeUrl(url);

    const { pathname } = parse(url);
    const Comp = this.App.components[pathname];

    if (!Comp) {
      throw new TypeError(`Page for \`${pathname}\` is not registered.`);
    } else {
      fn.call(this, { url });
    }
  };

  return descriptor;
}

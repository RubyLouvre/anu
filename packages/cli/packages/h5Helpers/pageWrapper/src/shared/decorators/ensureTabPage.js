import { parse } from 'url';
import { pluck } from 'ramda';

export default function ensureTabPage(target, name, descriptor) {
  const fn = descriptor.value;

  descriptor.value = function({ url }) {
    const { pathname } = parse(url);
    const Comp = this.tabPage.components[pathname];

    if (!Comp) {
      throw new Error(
        `${url} is not a tab page, you can only call \`switchTab()\` with a tab page url` +
          `currently registered tab pages: ${pluck(
            'pagePath',
            this.tabPage.list
          ).join(', ')}.`
      );
    } else {
      fn.call(this, { url });
    }
  };

  return descriptor;
}

import { parse } from 'url';

export default function ensureTabPage(target, name, descriptor) {
  const fn = descriptor.value;

  descriptor.value = function(config) {
    let { url } = config;
    const { pathname } = parse(url);
    const Comp = this.tabPage.components[pathname];

    if (Comp) {
      throw new Error(
        `${url} is a tab page, you can only call \`reLaunch()\` with a non-tab page url.`
      );
    } else {
      fn.call(this, { ...config, url });
    }
  };

  return descriptor;
}

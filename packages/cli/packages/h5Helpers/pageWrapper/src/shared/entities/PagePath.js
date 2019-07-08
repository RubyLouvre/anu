import url from 'url';

class PagePath {
  constructor(pagePath) {
    this.originalPagePath = pagePath;
    this.parsed = url.parse(pagePath, true);
  }

  static normalizeWithLeadingSlash(pagePath) {
    if (pagePath.startsWith('/')) return pagePath;
    return `/${pagePath}`;
  }

  static normalizeWithoutLeadingSlash(pagePath) {
    if (pagePath.startsWith('/')) return pagePath.slice(1);
    return pagePath;
  }

  get pathnameWithLeadingSlash() {
    if (this.parsed.pathname.startsWith('/')) return this.parsed.pathname;
    return `/${this.parsed.pathname}`;
  }

  get pathnameWithoutLeadingSlash() {
    if (this.parsed.pathname.startsWith('/'))
      return this.parsed.pathname.slice(1);
    return this.parsed.pathname;
  }

  get query() {
    return this.parsed.query;
  }

  get hash() {
    return this.parsed.hash;
  }

  get search() {
    return this.parsed.search;
  }

  get path() {
    return this.parsed.path;
  }
}

export default PagePath;

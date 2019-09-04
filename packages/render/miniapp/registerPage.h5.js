export function registerPage(PageClass, path) {
    this.api.__pages[path] = PageClass
    return PageClass
}
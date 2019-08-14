let GlobalApp;

export function _getGlobalApp() {
    return GlobalApp;
}

export function registerAppRender(App) {
    GlobalApp = App;
}
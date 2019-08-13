let GlobalApp;

export function _getGlobalApp() {
    return GlobalApp;
}

export function registerApp(App) {
    GlobalApp = App;
}
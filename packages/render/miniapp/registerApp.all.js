let GlobalApp;

export function _getGlobalApp(app) {
    return GlobalApp || app.globalData._GlobalApp;
}

export function registerApp(app) {
    GlobalApp = app.constructor;
    return app;
}
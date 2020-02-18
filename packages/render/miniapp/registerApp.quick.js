let appMethods = {
    onLaunch: 'onCreate',
    onHide: 'onDestroy'
};
export function registerApp(demo, containProvider) {
    var app = {};
    // 将App构造函数存到全局中供mobx使用
    if (containProvider) {
        demo.globalData._GlobalApp = demo.constructor;
    }
    for (let name in demo){
        let value = demo[name];
        name = appMethods[name] || name;
        app[name] = value;
    }
    for (let name in demo.constructor){
        let value = demo.constructor[name];
        if ( !app[name]){
            app[name] = value;
        } else {
            throw 'app.js已经存在同名的静态属性与实例属性 '+name+' !';
        }
    }
    delete app.constructor;//有这属性会报错
    return app;
}
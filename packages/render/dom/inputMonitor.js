/**
通过对象监控实现非受控组件
 */
export let inputMonitor = {};
let rcheck = /checked|radio/;
let describe = {
    set: function (value) {
        let controllProp = rcheck.test(this.type) ? "checked" : "value";
        if (this.type === "textarea") {
            this.innerHTML = value;
        }
        if (!this._observing) {
            if (!this._setValue) {
                //defaultXXX只会同步一次_persistValue
                let parsedValue = (this[controllProp] = value);
                this._persistValue = Array.isArray(value) ? value : parsedValue;
                this._setValue = true;
            }
        } else {
            //如果用户私下改变defaultValue，那么_setValue会被抺掉
            this._setValue = value == null ? false : true;
        }
        this._defaultValue = value;
    },
    get: function () {
        return this._defaultValue;
    },
    configurable: true
};

inputMonitor.observe = function (dom, name) {
    try {
        if ("_persistValue" in dom) {
            dom._setValue = true;
        }
        Object.defineProperty(dom, name, describe);
    } catch (e) { /*fix */}
};
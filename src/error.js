
var errIntance, errObject, errMethod;
var catchHook = "componentDidCatch";
export function pushError(instance, hook, error){
    if (!errIntance) {
        errIntance = instance;
        errMethod = hook;
        errObject = error;
    }
}
export function captureError(instance, hook, args) {
    try {
        var fn = instance[hook];
        if (fn) {
            return fn.apply(instance, args);
        }
        return true;
    } catch (e) {
        if (!errIntance) {
            errIntance = instance;
            errMethod = hook;
            errObject = e;
        }
    }
}
function describeError(names){
    return errMethod + " occur error in " + names.map(function(componentName){
        return "<"+ componentName+" />";
    }).join(" created By ");
}

export function showError() {
    if (errIntance) {
        var instance = errIntance;
        errIntance = null;
        var names = [];
        var last = null;
        do {
            names.push(instance.updater.name);
            if (instance[catchHook]) {
                return instance[catchHook](errObject, {
                    componentStack: describeError(names)
                });
            }
            if(last === instance){
                names.pop();
                break;
            }
            last = instance;
        } while ((instance = instance.updater.vnode._owner));
        console.warn(describeError(names));
        console.error( errObject);
    }
}

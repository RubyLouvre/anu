var errIntance, errObject, errMethod;
var catchHook = "componentDidCatch";
export function pushError(instance, hook, error) {
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
function describeError(names) {
    return (
        errMethod +
        " occur error in " +
        names
            .map(function(componentName) {
                return "<" + componentName + " />";
            })
            .join(" created By ")
    );
}

export function showError() {
    if (errIntance) {
        var target = errIntance.updater.vnode,
            names = [],instance;
        errIntance = null; //这是全局的，不能加var,let
        do {
            var type = target.type;
            if (target.isTop) {
                break;
            } else if (target.vtype > 1) {
                //如果是实例
                names.push(type.displayName || type.name);
                instance = target.stateNode;
                if (instance[catchHook]) {
                    return instance[catchHook](errObject, {
                        componentStack: describeError(names)
                    });
                }
            } else if (target.vtype === 1) {
                names.push(type);
            }
        } while ((target = target.return));
        console.warn(describeError(names));
        throw errObject;
    }
}

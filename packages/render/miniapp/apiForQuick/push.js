const push = require('@service.push');
// 推送

export function getPushProvider() {
    return push.getProvider();
}

export function subscribe(obj) {
    return push.subscribe(obj);
}

export function unsubscribe(obj) {
    return push.unsubscribe(obj);
}

export function pushOn(obj) {
    return push.on(obj);
}

export function pushOff() {
    return push.off();
}


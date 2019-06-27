import {_getApp} from './utils'
export function getCurrentPages() {
    console.warn('getCurrentPages存在严重的平台差异性，不建议再使用');
    var globalData = _getApp().globalData;
    var c = globalData.__currentPages;
    if (!c || !c.length) {
        var router = require('@system.router');
        globalData.__currentPages = [router.getState()['path']];
    }
    return globalData.__currentPages;
}


import MobileDetect from 'mobile-detect';
import { handleSuccess, handleFail } from '../utils';

function getSystemInfo({
    success = () => {},
    fail = () => {},
    complete = () => {}
} = {}) {
    return new Promise(function(resolve, reject) {
        try {
            const md = new MobileDetect(
                navigator.userAgent || navigator.vendor || window.opera,
                window.screen.width
            );
            const res = {
                brand: md.mobile(),
                model: md.phone(),
                pixelRatio: '',
                screenWidth: window.screen.width,
                screenHeight: window.screen.height,
                windowWidth: window.screen.width,
                windowHeight: window.screen.height,
                statusBarHeight: '',
                language: navigator.language || '',
                version: md.version('Webkit'),
                system: md.os(),
                platform: md.os(),
                fontSizeSetting: '',
                SDKVersion: '',
                storage: '',
                currentBattery: '',
                app: '',
                benchmarkLevel: ''
            };
            handleSuccess(res, success, complete, resolve);
        } catch (e) {
            handleFail({ errMsg: e }, fail, complete, reject);
        }
    });
}

function getSystemInfoSync() {
    const md = new MobileDetect(
        navigator.userAgent || navigator.vendor || window.opera,
        window.screen.width
    );

    return {
        brand: md.mobile(),
        model: md.phone(),
        pixelRatio: '',
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        windowWidth: window.screen.width,
        windowHeight: window.screen.height,
        statusBarHeight: '',
        language: navigator.language || '',
        version: md.version('Webkit'),
        system: md.os(),
        platform: md.os(),
        fontSizeSetting: '',
        SDKVersion: '',
        storage: '',
        currentBattery: '',
        app: '',
        benchmarkLevel: ''
    };
}

export default {
    getSystemInfo,
    getSystemInfoSync
};

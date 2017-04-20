/**
 * browser side hooks for webdriver based event drive test
 */
let browser = {
    _stack: [] // tmp stack for browser[api]
};
let config = {
    port: 8848,
    host: '127.0.0.1'
};
let Connection;
// get browserId
let browserId = ((opener || parent).location.search || '').replace(/^\S+id=([0-9]+)\S*/g, (mat, id) => id);
let switchFrame = parent !== window;

let contextFrame = parent.document.getElementById('context');
contextFrame = contextFrame && contextFrame.nodeName === 'IFRAME' ? contextFrame : null;
let fullScreenStyle = { position: 'absolute', left: 0, top: 0, background: '#fff' },
    originalStyle = {};
if (contextFrame) {
    for (let pro in fullScreenStyle) {
        originalStyle[pro] = contextFrame.style[pro];
    }
}


function fullScreen(full = true) {
    if (!contextFrame) return;
    let tar = full ? fullScreenStyle : originalStyle;
    for (let pro in tar) {
        contextFrame.style[pro] = tar[pro];
    }
}
/**
 * send Command to server
 * @param {object} message
 */
let _runCommand = (actions) => {
    if (!contextFrame) return console.warn('webdriver driving test can\'t run in current tab', location.href);
    if (typeof actions !== 'function') return console.error('runCommand only receive function actions');
    actions(browser);
    Connection.emit('runCommand', {
        actions: browser._stack.splice(0),
        browserId,
        switchFrame
    });
};
let idCount = 0;
/**
 * parse browser.api(a, b, c) => ['api', [b, c]], so can be sent to the server and executed by the webdriver.
 * @private _toRunnable
 * @param {string} def api name
 * @param {any} args arguments
 */
function _toRunnable(def, ...args) {
    browser._stack.push([
        def,
        args.map((ele) => {
            if (ele instanceof Element) {
                // if no id, allocate one
                ele.id = ele.id || (ele.className && ele.className.split(' ')[0] || 'WebDriverID').replace(/\-/g, '_') + idCount++;
                return '#' + ele.id;
            } else if (typeof ele === 'function') {
                throw Error('can\'t use function ' + ele);
            } else {
                return ele;
            }
        })
    ]);
}

/**
 * load script async
 * @param {string} src
 * @return promise
 */
async function loadScript(src) {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    let rs, rj, timer;
    script.onload = () => {
        script.onload = null;
        clearTimeout(timer);
        rs();
    };
    let prom = new Promise((resolve, reject) => {
        rs = resolve;
        rj = reject;
    });
    script.src = src;
    document.head.appendChild(script);
    timer = setTimeout(() => rj('load ' + src + ' time out'), 10000);
    return prom;
}


let initialled, waitingPromise = Promise.resolve(),
    rs, rj;

async function wrapPromise(fn, wait = true) {
    return new Promise((resolve, reject) => {
        wait ? fn(resolve, reject) : resolve();
    });
}
export default {
    loadScript,
    config: (conf) => {
        config = {
            ...config,
            ...conf
        };
    },
    /**
     * run first in before()
     * @return promise
     */
    beforeHook: async() => {
        if (initialled) return;
        let { url, host, port } = config;
        if (!url) url = host + ':' + port;
        await loadScript('//' + url + '/socket.io/socket.io.js');
        // it's hard to share socket with karma
        // Connection = (opener || parent).karma.socket;
        Connection = io(url);
        Connection.on('runBack', (message) => {
            console.log('runBack', message);
            message && !message.status ? rs() : rj(message.status);
        });
        // whether there is contextFrame, wait
        waitingPromise = wrapPromise((resolve) => {
            Connection.on('ready', (message) => {
                let { supportedDefs = '' } = message;
                supportedDefs.split(' ').map((def) => {
                    browser[def] = function() {
                        _toRunnable(def, ...arguments);
                        return this;
                    };
                });
                console.log('ready', message);
                resolve();
            });
        });
        await waitingPromise;
        fullScreen();
        initialled = true;
    },
    runCommand: async(actions) => {
        if (!initialled) return console.error('ensure beforeHook has been called');
        await waitingPromise;
        waitingPromise = wrapPromise((resolve, reject) => {
            rs = resolve;
            rj = reject;
        }, contextFrame);
        _runCommand(actions);
        await waitingPromise;
    },
    /**
     * run last in after()
     * @return promise
     */
    afterHook: async() => {
        fullScreen(false);
    }
};
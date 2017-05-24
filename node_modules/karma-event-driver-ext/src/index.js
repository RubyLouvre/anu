const Server = require('karma').Server;
const path = require('path');

// browsers with driver
let browsers = [];

function getBrowserById(id) {
    return browsers.find((browser) => browser.id === id);
}

function sendBack(socket, message) {
    socket.emit('runBack', Object.assign({
        fromSever: true
    }, message));
}
let supportedDefs;

const cfg = require('karma').config;
const karmaConfig = cfg.parseConfig(path.resolve('./karma.conf.js'), {
    port: 9876,
    _singleRun: true // finished auto exit
});

let init = ({ onExit, port = 8848 } = {}) => {
    let server = new Server(karmaConfig, (exitCode) => {
        console.log('Karma has exited with ' + exitCode);
        onExit && onExit(exitCode);
        process.exit(exitCode);
    });
    server.start();

    // ever tried to share socketServer with Karma
    // let SocketSever = server._injector.get('socketServer');

    server.on('browser_register', (browser) => {
        // reload full page will trigger browser_register, then iframe#context will lose focus
        let { id } = browser;
        // seem a private api, axiBug
        // reference, never manipulate
        browsers = server._injector._instances.launcher._browsers;
        let driver = browsers[0].driver;
        // return all support api
        if (!supportedDefs) {
            for (let def in driver) {
                if (typeof driver[def] === 'function') {
                    // 收到驱动器的所有方法名，以便在浏览器构建一个同名的伪驱动器对象
                    supportedDefs = (supportedDefs ? supportedDefs + ' ' : '') + def;
                }
            }
        }
    });

    const io = require('socket.io')(port);

    io
        .on('connection', (socket) => {
            /*io*/
            // tell the request client connect ready
            socket.emit('ready', {
                t: +new Date(),
                supportedDefs
            });

            socket.on('runCommand', (msg) => {
                let { browserId, actions, switchFrame } = msg, browser;
                if (browserId) {
                    browser = getBrowserById(browserId);
                }
                if (!browser || !browser.driver) return sendBack(socket, {
                    status: 'can\'t find browser or browser.driver, ensure there is id=[valid karma browser id] in url'
                });
                let driver = browser.driver;
                let prom = Promise.resolve();
                if (actions.length) {
                    prom = driver.isExisting('#context').then((ext) => {
                        if (ext) {
                            if (switchFrame) return driver.frame('context').then(() => null, () => {
                                let info = 'can\'t switch to frame#context';
                                sendBack(socket, {
                                    status: info
                                });
                            });
                        } else if (!switchFrame) {
                            return driver.frameParent();
                        }
                        return true;
                    })
                    // run action chain
                    actions.forEach(([action, args]) => {
                        prom = prom.then(() => driver[action](...args).then(() => null, (e) => {
                            msg.status = e;
                            console.log('error', action, args, e);
                        }));
                    });
                }
                prom.then(() => sendBack(socket, msg), () => sendBack(socket, msg));
            });

            socket.on('disconnect', (info) => {
                console.log('disconnect:', info);
            });
        });

    return server;
};

export default {
    init
}

export {
    init
};

if (require.main === module) {
    init();
}
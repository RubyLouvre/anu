const Server = require('karma').Server;
const io = require('socket.io')(8848);

// browsers with driver
let browsers = {}
    //require('./httpserver') //.fork('./httpserver.js');

function sendBack(socket, message) {
    socket.emit('runBack', Object.assign({
        fromSever: true
    }, message));
}
let supportedDefs;
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
                browser = browsers[browserId];
            }
            if (!browser || !browser.driver) return sendBack(socket, {
                status: 'can\'t find browser or browser.driver, ensure there is id=[valid karma browser id] in url'
            });
            let driver = browser.driver;
            let prom;
            // switch to top first
            prom = driver.frameParent();
            // switch to frame if any actions defined
            prom = switchFrame && actions.length ? driver.frame('context').then(() => null, () => {
                let info = 'can\'t switch to frame#context';
                sendBack(socket, {
                    status: info
                });
            }) : prom;
            // run action chain
            // console.log(actions);
            actions.forEach(([action, args]) => {
                //执行前端传过来的所有命令
                prom = prom.then(() => driver[action](...args).then(() => null, (e) => {
                    msg.status = e;
                    console.log('error', e);
                }));
            });
            prom.then(() => sendBack(socket, msg), () => sendBack(socket, msg));
        });

        socket.on('disconnect', (info) => {
            console.log('disconnect:', info);
        });
    });

const cfg = require('karma').config;
const path = require('path');
const karmaConfig = cfg.parseConfig(path.resolve('./uitest.js'), {
    port: 9876,
    _singleRun: true // finished auto exit
});
let server = new Server(karmaConfig, (exitCode) => {
    console.log('Karma has exited with ' + exitCode);
    process.exit(exitCode);
});
server.start();

let SocketSever = server._injector.get('socketServer');

server.on('browser_register', (inst) => {
    // seem a private api, axibug
    var browserArr = server._injector._instances.launcher._browsers;
    browserArr.forEach(function(el) {
        browsers[el.id] = el
    })

    let driver = browserArr[0].driver;
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



server.on('browsers_ready', () => {});

server.on('browser_start', (inst, info) => {});

server.on('browser_complete', (inst, result) => {});

server.on('browser_change', (inst, result) => {});
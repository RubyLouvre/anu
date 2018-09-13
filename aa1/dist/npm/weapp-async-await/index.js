const Promise = require('./promise-polyfill/lib/index.js');
const regeneratorRuntime = require('./regenerator-runtime/runtime.js');
module.exports = {
    Promise: Promise,
    regeneratorRuntime: regeneratorRuntime
}
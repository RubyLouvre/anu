'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Fish;

var _ReactWX = require('../../ReactWX.js');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Component(_ReactWX2.default.registerComponent(Fish, 'Fish')); // eslint-disable-next-line
function Fish(props) {
    var h = _ReactWX2.default.createElement;

    return h('view', null, 'Fish[', props.id, ']:', props.content);
}
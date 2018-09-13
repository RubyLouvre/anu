'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

var _index = require('../Animal/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line
function Dog() {}

Dog = _ReactWX2.default.miniCreateClass(Dog, _index2.default, {
    componentWillMount: function () {
        // eslint-disable-next-line
        console.log('Dog componentWillMount');
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { style: _ReactWX2.default.collectStyle({ border: '1px solid #333' }, this.props, "style608") }, '\u540D\u5B57\uFF1A', this.state.name, ' \u5E74\u9F84\uFF1A', this.state.age, ' \u5C81', h('button', { catchTap: this.changeAge.bind(this), 'data-tap-uid': 'e848', 'data-class-uid': 'c590', 'data-instance-uid': this.props.instanceUid }, '\u6362\u4E00\u4E2A\u5E74\u9F84'));;
    },
    classUid: 'c590'
}, {});

exports.default = Dog;
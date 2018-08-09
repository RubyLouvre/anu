'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P(props) {
    const ROOT_PATH = '/pages/demo/form';
    this.state = {
        nv: [{
            url: `${ROOT_PATH}/button/index`,
            name: 'button'
        }, {
            url: `${ROOT_PATH}/checkbox/index`,
            name: 'checkbox'
        }, {
            url: `${ROOT_PATH}/input/index`,
            name: 'input'
        }]
    };
}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
    render: function () {
        return _ReactWX2.default.createElement('view', { 'class': 'container' },
        //issues, 渲染class上非state数据
        this.state.nv.map(function (item) {
            return _ReactWX2.default.createElement('view', null, _ReactWX2.default.createElement('navigator', { 'open-type': 'navigate', 'class': 'item', 'hover-class': 'navigator-hover', url: item.url }, item.name));
        }, true));;
    },
    classCode: 'c9627162097596367'
}, {});

Page(_ReactWX2.default.createPage(P, "pages/demo/form/index/index"));
exports.default = P;
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _rematchProdMin = require('../npm/@rematch/core/dist/esm/rematch.prod.min.js');

var _countModel = require('./countModel');

var _countModel2 = _interopRequireDefault(_countModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//我们这样引入数据模板，数据模板包含初始值及操作它们的方法
//import person from './personModel';
//import dog from './dognModel';

const store = (0, _rematchProdMin.init)({
    models: {
        count: _countModel2.default
    }
});
/*
//将所有模型放入全局store中
const store = init({
    models: { 
        count,
        person,
        dog
     }
});

*/

exports.default = store;
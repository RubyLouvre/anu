'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function randomHexColor() {
    let colorArray = ['#FFF68F', '#FFEFD5', '#FFE4E1', '#FFDEAD', '#FFC1C1', '#FFB90F', '#FFA54F', '#FF8C00', '#FF7F50', '#FF6EB4', '#FAF0E6', '#F7F7F7', '#F0FFFF', '#F08080', '#FF6A6A', '#FFFACD', '#FFE1FF', '#FFBBFF', '#EED8AE', '#EE9A00'];
    let key = parseInt(Math.random() * 20, 10);
    return colorArray[key];
}

function P() {
    this.state = {
        array1: [{
            name: '动物1'
        }, {
            name: '动物2'
        }, {
            name: '动物3'
        }],
        array2: [{
            name: '猫1'
        }, {
            name: '狗2'
        }, {
            name: '兔3'
        }],
        array3: [{
            name: '小猫1'
        }, {
            name: '小狗2'
        }, {
            name: '小兔子3'
        }]
    };
}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
    changeNumbers: function () {
        this.setState({
            array: [{
                name: '狗1'
            }, {
                name: '狗3'
            }, {
                name: '狗4'
            }, {
                name: '狗5'
            }]
        });
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { onTap: this.changeNumbers.bind(this), 'class': 'loop3-container', 'data-tap-uid': 'e3689', 'data-class-uid': 'c4080',
            'data-instance-uid': this.props.instanceUid }, this.state.array1.map(function (el, i1906) {
            return h('view', { key: el.name }, h('view', { 'class': 'index-item-1', style: _ReactWX2.default.collectStyle({ backgroundColor: randomHexColor()
                }, this.props, "style4185" + i1906) }, el.name), this.state.array2.map(function (item, i2223) {
                return h('view', { key: item.name }, h('view', { 'class': 'index-item-2', style: _ReactWX2.default.collectStyle({ backgroundColor: randomHexColor() }, this.props, "style4899" + i2223) }, item.name, '======='), this.state.array3.map(function (key, i2648) {
                    return h('view', { key: key.name, 'class': 'index-item-3', style: _ReactWX2.default.collectStyle({ backgroundColor: randomHexColor() }, this.props, "style6013" + i2648) }, key.name);
                }, this));
            }, this));
        }, this));;
    },
    classUid: 'c4080'
}, {});
Page(_ReactWX2.default.createPage(P, 'pages/demo/syntax/loop3/index'));

exports.default = P;
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

var _index = require('../../components/dialog/index');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('../../components/LotteryDraw/index');

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line
function Cart() {
    this.state = {
        cartImg: '../../assets/images/cart-null.png',
        tipWords: '购物车空空如也',
        visible: true
    };
}

Cart = _ReactWX2.default.miniCreateClass(Cart, _ReactWX2.default.Component, {
    tap: function () {
        this.setState({
            visible: false
        });
    },
    componentWillMount: function () {
        console.log('cat componentWillMount');
        this.setState({
            visible: false
        });
        console.log('cat componentWillMount 2');
    },
    componentDidMount: function () {
        console.log('cat componentDidMount');
    },
    onOk: function () {
        this.setState({
            visible: true
        });
    },
    onCanel: function () {
        this.setState({
            visible: true
        });
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { className: 'cart-container' }, h('view', null, h('image', { src: this.state.cartImg, onTap: this.tap, className: 'cart-image', 'data-tap-uid': 'e12761292', 'data-class-uid': 'c1882060', 'data-instance-uid': this.props.instanceUid }), h('view', null, this.state.tipWords)), h('view', { hidden: this.state.visible }, h('view', { className: 'ys-mask', onTap: this.onCanel, 'data-tap-uid': 'e16471667', 'data-class-uid': 'c1882060', 'data-instance-uid': this.props.instanceUid }), h('view', { className: 'ys-dialog'
        }, h('view', { className: 'ys-dialog-contetn' }, h('image', { src: '../../assets/images/lottery_draw_log.png', 'class': 'lottery_draw_log' }), h(_ReactWX2.default.template, { onOk: this.onOk.bind(this), templatedata: 'data99114141', is: _index4.default, 'data-ok-uid': 'e19221949', 'data-class-uid': 'c1882060', 'data-instance-uid': this.props.instanceUid })))));;
    },
    classUid: 'c1882060'
}, {});
Page(_ReactWX2.default.createPage(Cart, 'pages/cart/index'));

exports.default = Cart;
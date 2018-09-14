'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line
var app = getApp();

function MY() {
    this.state = {
        userInfo: {},
        show: true,
        userListInfo: [{
            icon: '../../assets/images/iconfont-dingdan.png',
            text: '我的订单',
            isunread: true,
            unreadNum: 2
        }, {
            icon: '../../assets/images/iconfont-card.png',
            text: '我的代金券',
            isunread: false,
            unreadNum: 2
        }, {
            icon: '../../assets/images/iconfont-icontuan.png',
            text: '我的拼团',
            isunread: true,
            unreadNum: 1
        }, {
            icon: '../../assets/images/iconfont-shouhuodizhi.png',
            text: '收货地址管理'
        }, {
            icon: '../../assets/images/iconfont-kefu.png',
            text: '联系客服'
        }, {
            icon: '../../assets/images/iconfont-help.png',
            text: '常见问题'
        }]
    };
}

MY = _ReactWX2.default.miniCreateClass(MY, _ReactWX2.default.Component, {
    componentWillMount: function () {
        // console.log(app)
        // var that = this;
        // app.getUserInfo(function(userInfo) {
        //   console.log('userInfo', userInfo);
        //   that.setData({
        //     userInfo: userInfo
        //   });
        // });
    },
    show: function (text) {
        wx.showToast({
            title: text,
            icon: 'success',
            duration: 2000
        });
    },
    getUserInfo: function (e) {

        this.setState({
            userInfo: e.userInfo,
            show: false
        });
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { className: 'chat-container' }, h('view', { className: 'userinfo' }, this.state.show ? h('button', { 'open-type': 'getUserInfo', onGetuserInfo: this.getUserInfo, 'data-getuserinfo-uid': 'e23052337', 'data-class-uid': 'c993844', 'data-instance-uid': this.props.instanceUid }, '\u83B7\u53D6\u7528\u6237\u767B\u5F55\u4FE1\u606F') : h('view', null, h('image', { className: 'userinfo-avatar', src: this.state.userInfo.avatarUrl, 'background-size': 'cover' }), h('view', { className: 'userinfo-nickname' }, this.state.userInfo.nickName))), h('view', { className: 'info_list' }, this.state.userListInfo.map(function (item, i2916) {
            return h('view', { className: 'weui_cell', key: item.text, onTap: this.show.bind(this, item.text), 'data-tap-uid': 'e30613100', 'data-class-uid': 'c993844', 'data-instance-uid': this.props.instanceUid, 'data-key': i2916 }, h('view', { className: 'weui_cell_hd' }, h('image', { src: item.icon })), h('view', { 'class': 'weui_cell_bd' }, h('view', {
                'class': 'weui_cell_bd_p' }, ' ', item.text, ' ')), item.isunread && h('view', { className: 'badge' }, item.unreadNum), h('view', { 'class': 'with_arrow' }, h('image', { src: '../../assets/images/icon-arrowdown.png' })));
        }, this)));;
    },
    classUid: 'c993844'
}, {});
Page(_ReactWX2.default.createPage(MY, 'pages/my/index'));

exports.default = MY;
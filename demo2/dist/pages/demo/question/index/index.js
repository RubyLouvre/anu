'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX.js');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {
    this.state = {
        navBtnActiveIndex: 1,
        isQuestion: true,
        data: [],
        city: '北京'
    };
}

P = _ReactWX2.default.toClass(P, _ReactWX2.default.Component, {
    navItemClick: function (navBtnActiveIndex) {
        this.setState({ navBtnActiveIndex });
        if (navBtnActiveIndex === 1 || navBtnActiveIndex === 2) {
            this.getData();
        }
    },
    switchFun: function () {
        this.setState({ isQuestion: !this.state.isQuestion });
    },
    getData: function () {
        let that = this;
        _ReactWX2.default.api.showLoading({
            title: '获取资源中',
            mask: true
        });
        _ReactWX2.default.api.request({
            url: 'http://yapi.demo.qunar.com/mock/18752/qunar/question',
            success: function (data) {
                _ReactWX2.default.api.hideLoading();
                that.setState({ data: data.data });
            }
        });
    },
    questionDetail: function () {
        _ReactWX2.default.api.navigateTo({ url: '../detail/index' });
    },
    componentDidMount: function () {
        this.getData();
    },
    componentDidShow: function () {
        let app = _ReactWX2.default.getApp();
        if (app.globalData.citySelect) {
            this.setState({ city: app.globalData.citySelect });
        }
    },
    toCitySelect: function () {
        this.navItemClick(2);
        _ReactWX2.default.api.navigateTo({ url: '../../citySelect/index' });
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { 'class': 'question' }, h('view', { 'class': 'nav-wrapper' }, h('view', { onTap: this.navItemClick.bind(this, 0), 'class': 'nav-btn ' + (this.state.navBtnActiveIndex === 0 ? 'active' : ''), 'data-tap-uid': 'e3446', 'data-class-uid': 'c5996' }, '\u6211\u7684\u95EE\u7B54'), h('view', { onTap: this.navItemClick.bind(this, 1), 'class': 'nav-btn ' + (this.state.navBtnActiveIndex === 1 ? 'active' : ''), 'data-tap-uid': 'e3742', 'data-class-uid': 'c5996' }, '\u63A8\u8350'), h('view', { 'class': 'nav-btn ' + (this.state.navBtnActiveIndex === 2 ? 'active' : '') }, h('text', { onTap: this.navItemClick.bind(this, 2), 'data-tap-uid': 'e4242', 'data-class-uid': 'c5996' }, this.state.city), h('image', { onTap: this.toCitySelect.bind(this), 'class': 'open-icon', src: '../../../../assets/image/' + (this.state.navBtnActiveIndex === 2 ? 'open_select.png' : 'open.png'), 'data-tap-uid': 'e4430', 'data-class-uid': 'c5996' })), h('view', { 'class': 'switch-bar ' + (this.state.navBtnActiveIndex === 1 ? '' : this.state.navBtnActiveIndex === 0 ? 'first-choose' : 'third-choose') })), h('view', { 'class': 'content' }, this.state.navBtnActiveIndex === 0 ? h('view', { 'class': 'my-question-answer' }, h('view', { 'class': 'tool' }, h('text', null, this.state.isQuestion ? '共有0个提问' : '共有0个回答'), h('view', { onTap: this.switchFun.bind(this), 'class': 'switch-wrapper', 'data-tap-uid': 'e6025', 'data-class-uid': 'c5996' }, h('text', null, this.state.isQuestion ? '切换至回答' : '切换至提问'))), h('view', { 'class': 'no-data-prompt' }, h('image', { src: '../../../../assets/image/order_none.png' }), h('view', { 'class': 'message' }, this.state.isQuestion ? '您还没有发布过问题，去提问吧~' : '您还没有发布过回答，去回答吧~'))) : '', this.state.navBtnActiveIndex === 1 || this.state.navBtnActiveIndex === 2 ? h('view', { 'class': 'all-question' }, this.state.data.map(function (item, index) {
            return h('view', { onTap: this.questionDetail.bind(this), 'class': 'question-item', key: index, 'data-tap-uid': 'e8320', 'data-class-uid': 'c5996', 'data-key': index }, item.isRemark ? h('view', { 'class': 'remark ' + (item.remark === '最新' ? 'new' : item.remark === '置顶' ? 'stick' : 'hot')
            }, item.remark) : '', h('view', { 'class': 'title' }, item.title), h('view', { 'class': 'desc hide-text' }, item.desc), h('view', { 'class': 'other-message' }, h('view', { 'class': 'other-message-item' }, h('image', { 'class': 'eye', src: '../../../../assets/image/eye.png' }), h('text', { 'class': 'eye-text' }, item.seeNum)), h('view', { 'class': 'other-message-item' }, h('image', { src: '../../../../assets/image/message.png' }), h('text', null, item.commentNum))));
        }, this)) : ''));
    },
    classUid: 'c5996'
}, {});
Page(_ReactWX2.default.registerPage(P, 'pages/demo/question/index/index'));

exports.default = P;
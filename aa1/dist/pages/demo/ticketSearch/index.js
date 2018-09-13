'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {

    this.state = {
        depCity: '北京',
        arrCity: '上海',
        exchangeStatus: false,
        displayDate: '8月28日',
        dateWeek: '周二',
        isOnlyGaotie: false
    };
}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
    componentDidMount: function () {
        _ReactWX2.default.getApp().globalData.dateSelect = new Date();
    },
    componentDidShow: function () {
        let week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        let date = _ReactWX2.default.getApp().globalData.dateSelect;
        this.setState({ displayDate: date.getMonth() + 1 + '月' + date.getDate() + '日' });
        this.setState({ dateWeek: week[date.getDay()] });
    },
    toDateSelect: function () {
        wx.navigateTo({
            url: '../../demo/calendar/index'
        });
    },
    exChangeCity: function () {
        this.setState({ exchangeStatus: !this.state.exchangeStatus });
    },
    fun_tip: function () {
        wx.showModal({
            title: '提示',
            content: '该部分仅展示，无具体功能!',
            showCancel: false
        });
    },
    handleChangeSwitch: function () {
        this.setState({ isOnlyGaotie: !this.state.isOnlyGaotie });
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { className: 'page', style: '{background-color: #feb64e}' }, h('image', { className: 'sreach_bg', mode: 'scaleToFill', src: 'http://picbed.qunarzz.com/image/b96f82f01ef5850d50e93ea511f618fa.png' }), h('view', { style: '{top: -15px}', className: 'search-container' }, h('view', { className: 'citySelector' }, h('view', { onTap: this.fun_tip, className: 'cityTap', 'data-tap-uid': 'e3498', 'data-class-uid': 'c5976', 'data-instance-uid': this.props.instanceUid }, h('view', { className: 'depCityContent ' + (this.state.exchangeStatus ? 'depCity-changing' : '') }, this.state.depCity)), h('view', {
            onTap: this.exChangeCity.bind(this), className: 'city_change', 'data-tap-uid': 'e4360', 'data-class-uid': 'c5976', 'data-instance-uid': this.props.instanceUid }, h('image', { className: 'exchange-logo', mode: 'widthFix', src: '../../../assets/image/train_icon.png' }), h('image', { className: 'exchange-btn ' + (this.state.exchangeStatus ? 'btn-rotating' : ''), src: '../../../assets/image/search_btn.png' })), h('view', { onTap: this.fun_tip, className: 'cityTap', 'data-tap-uid': 'e5544', 'data-class-uid': 'c5976', 'data-instance-uid': this.props.instanceUid }, h('view', { className: 'arrCityContent ' + (this.state.exchangeStatus ? 'arrCity-changing' : '') }, this.state.arrCity))), h('view', { onTap: this.toDateSelect, className: 'dateSelector', 'data-tap-uid': 'e6439', 'data-class-uid': 'c5976', 'data-instance-uid': this.props.instanceUid }, this.state.displayDate, h('view', { className: 'date-week' }, this.state.dateWeek)), h('view', { className: 'switch-content' }, h('view', { className: 'switch-label' }, h('image', { className: 'hight-speed', mode: 'widthFix', src: '../../../assets/image/train_highSpeed.png' }), h('view', { className: this.state.isOnlyGaotie ? 'switch-context switch-label-check' : 'switch-context switch-label-uncheck' }, '\u53EA\u67E5\u770B\u9AD8\u94C1/\u52A8\u8F66')), h('switch', { checked: this.state.isOnlyGaotie, onChange: this.handleChangeSwitch.bind(this), color: '#00bcd4', 'data-change-uid': 'e8543', 'data-class-uid': 'c5976', 'data-instance-uid': this.props.instanceUid })), h('view', { onTap: this.fun_tip, className: 'search-button', 'data-tap-uid': 'e8746', 'data-class-uid': 'c5976', 'data-instance-uid': this.props.instanceUid }, '\u641C \u7D22'), h('view', { className: 'actions-container' }, h('view', { onTap: this.fun_tip, className: 'order-action', 'data-tap-uid': 'e9024', 'data-class-uid': 'c5976', 'data-instance-uid': this.props.instanceUid }, h('text', { className: 'action-text' }, '\u6211\u7684\u8BA2\u5355')), h('view', { className: 'seprator' }), h('view', { onTap: this.fun_tip, className: 'feedback-action', 'data-tap-uid': 'e9468', 'data-class-uid': 'c5976', 'data-instance-uid': this.props.instanceUid }, h('text', { className: 'action-text' }, '\u54A8\u8BE2\u53CD\u9988')))), h('view', { className: 'welfare-entrance' }, h('view', { className: 'welfare-content' }, h('view', { onTap: this.fun_tip,
            className: 'welfare-action', 'data-tap-uid': 'e10112', 'data-class-uid': 'c5976', 'data-instance-uid': this.props.instanceUid }, h('image', { className: 'welfare-icon', src: 'http://s.qunarzz.com/open_m_train/miniprogram/home_redpack.png' }), h('text', { className: 'action-text' }, '\u4F18\u60E0\u62FC\u56E2')), h('view', { className: 'seprator' }), h('view', { onTap: this.fun_tip, className: 'welfare-action', 'data-tap-uid': 'e10992', 'data-class-uid': 'c5976', 'data-instance-uid': this.props.instanceUid }, h('image', { className: 'welfare-icon', src: 'http://s.qunarzz.com/open_m_train/miniprogram/home_welfare.png' }), h('text', { className: 'action-text' }, '\u6211\u7684\u798F\u5229')))));;
    },
    classUid: 'c5976'
}, {});
Page(_ReactWX2.default.createPage(P, 'pages/demo/ticketSearch/index'));

exports.default = P;
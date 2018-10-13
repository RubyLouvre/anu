'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../ReactWX.js');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {

    this.state = {
        depCity: '北京',
        arrCity: '上海',
        exchangeStatus: false,
        displayDate: '8月28日',
        dateWeek: '周二',
        isOnlyGaotie: false,
        isStartCity: true
    };
}

P = _ReactWX2.default.toClass(P, _ReactWX2.default.Component, {
    componentDidMount: function () {
        _ReactWX2.default.getApp().globalData.dateSelect = new Date();
    },
    componentDidShow: function () {
        let date = _ReactWX2.default.getApp().globalData.dateSelect;
        this.setState({ displayDate: date.getMonth() + 1 + '月' + date.getDate() + '日' });
        this.setState({ dateWeek: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()] });

        let app = _ReactWX2.default.getApp();
        if (app.globalData.citySelect) {
            if (!this.state.isStartCity) {
                this.setState({ arrCity: app.globalData.citySelect });
            } else {
                this.setState({ depCity: app.globalData.citySelect });
            }
        }
    },
    toDateSelect: function () {
        _ReactWX2.default.api.navigateTo({
            url: '../../demo/calendar/index'
        });
    },
    toCitySelect: function (isStartCity) {
        this.setState({ isStartCity });
        let app = _ReactWX2.default.getApp();
        if (!isStartCity) {
            app.globalData.citySelect = '上海';
        } else {
            app.globalData.citySelect = '北京';
        }
        _ReactWX2.default.api.navigateTo({
            url: '../../demo/citySelect/index'
        });
    },
    exChangeCity: function () {
        this.setState({ exchangeStatus: !this.state.exchangeStatus });
    },
    fun_tip: function () {
        _ReactWX2.default.api.showModal({
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

        return h('view', { className: 'page', style: '{background-color: #feb64e}' }, h('image', { className: 'sreach_bg', mode: 'scaleToFill', src: 'http://picbed.qunarzz.com/image/b96f82f01ef5850d50e93ea511f618fa.png' }), h('view', { style: '{top: -15px}', className: 'search-container' }, h('view', { className: 'citySelector' }, h('view', { onTap: this.toCitySelect.bind(this, true), className: 'cityTap', 'data-tap-uid': 'e4987', 'data-class-uid': 'c6566' }, h('view', { className: 'depCityContent' }, this.state.depCity)), h('view', { className: 'city_change' }, h('image', { className: 'exchange-logo', mode: 'widthFix', src: '../../../assets/image/train_icon.png' }), h('image', { className: 'exchange-btn', src: '../../../assets/image/search_btn.png' })), h('view', { onTap: this.toCitySelect.bind(this, false), className: 'cityTap', 'data-tap-uid': 'e6688', 'data-class-uid': 'c6566' }, h('view', { className: 'arrCityContent' }, this.state.arrCity))), h('view', { onTap: this.toDateSelect, className: 'dateSelector', 'data-tap-uid': 'e7355', 'data-class-uid': 'c6566' }, this.state.displayDate, h('view', { className: 'date-week' }, this.state.dateWeek)), h('view', { className: 'switch-content' }, h('view', { className: 'switch-label' }, h('image', { className: 'hight-speed', mode: 'widthFix', src: '../../../assets/image/train_highSpeed.png' }), h('view', { className: this.state.isOnlyGaotie ? 'switch-context switch-label-check' : 'switch-context switch-label-uncheck' }, '\u53EA\u67E5\u770B\u9AD8\u94C1/\u52A8\u8F66')), h('switch', { checked: this.state.isOnlyGaotie, onChange: this.handleChangeSwitch.bind(this), color: '#00bcd4', 'data-change-uid': 'e9563', 'data-class-uid': 'c6566' })), h('view', { onTap: this.fun_tip, className: 'search-button', 'data-tap-uid': 'e9862', 'data-class-uid': 'c6566' }, '\u641C \u7D22'), h('view', { className: 'actions-container' }, h('view', { onTap: this.fun_tip, className: 'order-action', 'data-tap-uid': 'e10204', 'data-class-uid': 'c6566' }, h('text', { className: 'action-text' }, '\u6211\u7684\u8BA2\u5355')), h('view', { className: 'seprator' }), h('view', { onTap: this.fun_tip, className: 'feedback-action', 'data-tap-uid': 'e10648', 'data-class-uid': 'c6566'
        }, h('text', { className: 'action-text' }, '\u54A8\u8BE2\u53CD\u9988')))), h('view', { className: 'welfare-entrance' }, h('view', { className: 'welfare-content' }, h('view', { onTap: this.fun_tip, className: 'welfare-action', 'data-tap-uid': 'e11292', 'data-class-uid': 'c6566' }, h('image', { className: 'welfare-icon', src: 'http://s.qunarzz.com/open_m_train/miniprogram/home_redpack.png' }), h('text', { className: 'action-text' }, '\u4F18\u60E0\u62FC\u56E2')), h('view', { className: 'seprator' }), h('view', { onTap: this.fun_tip, className: 'welfare-action', 'data-tap-uid': 'e12172', 'data-class-uid': 'c6566' }, h('image', { className: 'welfare-icon', src: 'http://s.qunarzz.com/open_m_train/miniprogram/home_welfare.png' }), h('text', { className: 'action-text' }, '\u6211\u7684\u798F\u5229')))));
    },
    classUid: 'c6566'
}, {});
Page(_ReactWX2.default.registerPage(P, 'pages/demo/ticketSearch/index'));

exports.default = P;
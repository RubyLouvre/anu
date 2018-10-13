'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX.js');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {
    this.state = {
        data: {},
        answer: [],
        sortkey: 'byTime'
    };
}

P = _ReactWX2.default.toClass(P, _ReactWX2.default.Component, {
    componentDidMount: function () {
        let that = this;
        _ReactWX2.default.api.showLoading({
            title: '获取资源中',
            mask: true
        });
        _ReactWX2.default.api.request({
            url: 'http://yapi.demo.qunar.com/mock/18752/qunar/question/detail',
            success: function (data) {
                _ReactWX2.default.api.hideLoading();
                that.setState({ data: data.data });
                that.setState({ answer: [...that.state.answer, ...data.data.answer] });
            }
        });
    },
    switchSortkey: function () {
        this.setState({ sortkey: this.state.sortkey === 'byTime' ? 'byHot' : 'byTime' });
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { 'class': 'detail' }, h('view', { 'class': 'question-detail' }, h('view', { 'class': 'title' }, this.state.data.question), h('view', { 'class': 'city' }, this.state.data.city), h('view', { 'class': 'other-infortion' }, h('image', { src: this.state.data.userImage }), h('text', { 'class': 'userName' }, this.state.data.userName), h('text', { 'class': 'post-date' }, this.state.data.date), h('view', { 'class': 'eye-wrapper' }, h('image', { src: '../../../../assets/image/eye.png' }), h('text', { 'class': 'eye-num' }, this.state.data.eyeNum)))), h('view', { 'class': 'question-prompt' }, h('text', null, '共' + this.state.data.answerNum + '个回答'), h('view', { onTap: this.switchSortkey.bind(this), 'class': 'sort-wrapper', 'data-tap-uid': 'e4031', 'data-class-uid': 'c3416' }, h('image', { src: '../../../../assets/image/sort.png' }), h('text', null, this.state.sortkey === 'byTime' ? '按时间排序' : '按热度排序'))), this.state.answer.map(function (item, index) {
            return h('view', { 'class': 'answer-wrapper', key: index }, h('view', { 'class': 'user-wrapper' }, h('image', { src: item.userImage }), h('view', { 'class': 'name-time' }, h('text', { 'class': 'name' }, item.userName), h('text', { 'class': 'time' }, item.time))), h('view', { 'class': 'answer-desc' }, item.desc), h('view', { 'class': 'agree-with-wrapper' }, h('image', { src: '../../../../assets/image/agree_with.png' }), h('text', null, item.agreeWithNum)));
        }, this));
    },
    classUid: 'c3416'
}, {});
Page(_ReactWX2.default.registerPage(P, 'pages/demo/question/detail/index'));

exports.default = P;
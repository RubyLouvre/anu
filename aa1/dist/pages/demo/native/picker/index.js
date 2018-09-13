'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {
    this.state = {
        array: ['美国', '中国', '巴西', '日本'],
        objectArray: [{
            id: 0,
            name: '美国'
        }, {
            id: 1,
            name: '中国'
        }, {
            id: 2,
            name: '巴西'
        }, {
            id: 3,
            name: '日本'
        }],
        index: 0,
        multiArray: [['无脊柱动物', '脊柱动物'], ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'], ['猪肉绦虫', '吸血虫']],
        objectMultiArray: [[{
            id: 0,
            name: '无脊柱动物'
        }, {
            id: 1,
            name: '脊柱动物'
        }], [{
            id: 0,
            name: '扁性动物'
        }, {
            id: 1,
            name: '线形动物'
        }, {
            id: 2,
            name: '环节动物'
        }, {
            id: 3,
            name: '软体动物'
        }, {
            id: 3,
            name: '节肢动物'
        }], [{
            id: 0,
            name: '猪肉绦虫'
        }, {
            id: 1,
            name: '吸血虫'
        }]],
        multiIndex: [0, 0, 0],
        date: '2016-09-01',
        time: '12:01',
        region: ['广东省', '广州市', '海珠区'],
        customItem: '全部'
    };
}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
    bindPickerChange: function (e) {
        // eslint-disable-next-line
        console.log('picker发送选择改变，携带值为', e.value);
        this.setState({
            index: e.value
        });
    },
    bindMultiPickerChange: function (e) {
        // eslint-disable-next-line
        console.log('picker发送选择改变，携带值为', e.value);
        this.setState({
            multiIndex: e.value
        });
    },
    bindMultiPickerColumnChange: function (e) {
        // eslint-disable-next-line
        console.log('修改的列为', e.column, '，值为', e.value);
        var data = {
            multiArray: this.state.multiArray,
            multiIndex: this.state.multiIndex
        };
        this.state.multiIndex[e.column] = e.value;
        switch (e.column) {
            case 0:
                switch (data.multiIndex[0]) {
                    case 0:
                        data.multiArray[1] = ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'];
                        data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
                        break;
                    case 1:
                        data.multiArray[1] = ['鱼', '两栖动物', '爬行动物'];
                        data.multiArray[2] = ['鲫鱼', '带鱼'];
                        break;
                }
                data.multiIndex[1] = 0;
                data.multiIndex[2] = 0;
                break;
            case 1:
                switch (data.multiIndex[0]) {
                    case 0:
                        switch (data.multiIndex[1]) {
                            case 0:
                                data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
                                break;
                            case 1:
                                data.multiArray[2] = ['蛔虫'];
                                break;
                            case 2:
                                data.multiArray[2] = ['蚂蚁', '蚂蟥'];
                                break;
                            case 3:
                                data.multiArray[2] = ['河蚌', '蜗牛', '蛞蝓'];
                                break;
                            case 4:
                                data.multiArray[2] = ['昆虫', '甲壳动物', '蛛形动物', '多足动物'];
                                break;
                        }
                        break;
                    case 1:
                        switch (data.multiIndex[1]) {
                            case 0:
                                data.multiArray[2] = ['鲫鱼', '带鱼'];
                                break;
                            case 1:
                                data.multiArray[2] = ['青蛙', '娃娃鱼'];
                                break;
                            case 2:
                                data.multiArray[2] = ['蜥蜴', '龟', '壁虎'];
                                break;
                        }
                        break;
                }
                data.multiIndex[2] = 0;
                // eslint-disable-next-line
                console.log(data.multiIndex);
                break;
        }
        this.setState(data);
    },
    bindTimeChange: function (e) {
        // eslint-disable-next-line
        console.log('picker发送选择改变，携带值为', e.value);
        this.setState({
            time: e.value
        });
    },
    bindDateChange: function (e) {
        // eslint-disable-next-line
        console.log('picker发送选择改变，携带值为', e.value);
        this.setState({
            date: e.value
        });
    },
    bindRegionChange: function (e) {
        // eslint-disable-next-line
        console.log('picker发送选择改变，携带值为', e.value);
        this.setState({
            region: e.value
        });
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { 'class': 'container' }, h('view', { 'class': 'section' }, h('view', {
            'class': 'section__title' }, '\u666E\u901A\u9009\u62E9\u5668'), h('picker', { onChange: this.bindPickerChange, value: this.state.index, range: this.state.array, 'data-change-uid': 'e12526', 'data-class-uid': 'c9226', 'data-instance-uid': this.props.instanceUid }, h('view', { 'class': 'picker' }, '\u5F53\u524D\u9009\u62E9\uFF1A', this.state.array[this.state.index]))), h('view', { 'class': 'section' }, h('view', { 'class': 'section__title' }, '\u591A\u5217\u9009\u62E9\u5668'), h('picker', { mode: 'multiSelector', onChange: this.bindMultiPickerChange, onColumnChange: this.bindMultiPickerColumnChange, value: this.state.multiIndex, range: this.state.multiArray, 'data-change-uid': 'e13683', 'data-class-uid': 'c9226', 'data-instance-uid': this.props.instanceUid, 'data-columnchange-uid': 'e13819' }, h('view', { 'class': 'picker' }, '\u5F53\u524D\u9009\u62E9\uFF1A', this.state.multiArray[0][this.state.multiIndex[0]], '\uFF0C', this.state.multiArray[1][this.state.multiIndex[1]], '\uFF0C', this.state.multiArray[2][this.state.multiIndex[2]]))), h('view', { 'class': 'section' }, h('view', { 'class': 'section__title' }, '\u65F6\u95F4\u9009\u62E9\u5668'), h('picker', { mode: 'time', value: this.state.time, start: '09:01', end: '21:01', onChange: this.bindTimeChange,
            'data-change-uid': 'e15708', 'data-class-uid': 'c9226', 'data-instance-uid': this.props.instanceUid }, h('view', { 'class': 'picker' }, '\u5F53\u524D\u9009\u62E9: ', this.state.time))), h('view', { 'class': 'section' }, h('view', { 'class': 'section__title' }, '\u65E5\u671F\u9009\u62E9\u5668'), h('picker', { mode: 'date', value: this.state.date, start: '2015-09-01', end: '2017-09-01', onChange: this.bindDateChange, 'data-change-uid': 'e16706', 'data-class-uid': 'c9226', 'data-instance-uid': this.props.instanceUid }, h('view', { 'class': 'picker' }, '\u5F53\u524D\u9009\u62E9: ', this.state.date))), h('view', { 'class': 'section' }, h('view', { 'class': 'section__title' }, '\u7701\u5E02\u533A\u9009\u62E9\u5668'), h('picker', { mode: 'region', onChange: this.bindRegionChange, value: this.state.region, 'custom-item': this.state.customItem, 'data-change-uid': 'e17446', 'data-class-uid': 'c9226', 'data-instance-uid': this.props.instanceUid }, h('view', { 'class': 'picker' }, '\u5F53\u524D\u9009\u62E9\uFF1A', this.state.region[0], '\uFF0C', this.state.region[1], '\uFF0C', this.state.region[2]))));;
    },
    classUid: 'c9226'
}, {});
Page(_ReactWX2.default.createPage(P, 'pages/demo/native/picker/index'));

exports.default = P;
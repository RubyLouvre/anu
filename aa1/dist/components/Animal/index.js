'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Animal(props) {
    this.state = {
        name: props.name,
        age: props.age || 1
    };
}

Animal = _ReactWX2.default.miniCreateClass(Animal, _ReactWX2.default.Component, {
    changeAge: function () {
        this.setState({
            age: ~~(Math.random() * 10)
        });
    },
    componentDidMount: function () {
        // eslint-disable-next-line
        console.log('Animal componentDidMount');
    },
    componentWillReceiveProps: function (props) {
        this.setState({
            name: props.name
        });
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { style: _ReactWX2.default.collectStyle({ border: '1px solid #333' }, this.props, "style1362") }, '\u540D\u5B57\uFF1A', this.state.name, ' \u5E74\u9F84\uFF1A', this.state.age, ' \u5C81', h('button', { catchTap: this.changeAge.bind(this), 'data-tap-uid': 'e1602', 'data-class-uid': 'c901', 'data-instance-uid': this.props.instanceUid }, '\u6362\u4E00\u4E2A\u5E74\u9F84'));;
    },
    classUid: 'c901'
}, {
    defaultProps: {
        age: 1,
        name: 'animal'
    }
});

exports.default = Animal;
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require("../../ReactWX");

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Dog(props) {
    this.state = {
        name: props.name,
        age: props.age
    };
}

Dog = _ReactWX2.default.miniCreateClass(Dog, _ReactWX2.default.Component, {
    changeAge: function (e) {
        this.setState({
            age: ~~(Math.random() * 10)
        });
    },
    render: function () {
        return _ReactWX2.default.createElement("view", { catchTap: this.changeAge.bind(this) }, this.state.name, "-", this.state.age);;
    },
    classCode: "c39874194970132004"
}, {
    defaultProps: {
        age: 77
    }
});

exports.default = Dog;
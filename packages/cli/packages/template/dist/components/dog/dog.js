"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require("../../ReactWX");

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Dog(props) {
    //this.props = props;
    console.log(this.props.eventTapHandler, '----');
}

Dog = _ReactWX2.default.miniCreateClass(Dog, _ReactWX2.default.Component, {
    render: function () {
        return _ReactWX2.default.createElement("view", { onTap: this.props.eventTapHandler }, this.props.name, "-", this.props.age);;
    },
    classCode: "c7199167959956871"
}, {
    defaultProps: {
        age: 77
    }
});

exports.default = Dog;
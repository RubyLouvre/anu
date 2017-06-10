/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

        _this.state = {
            aaa: 'aaa'
        };
        _this.change = _this.change.bind(_this);
        return _this;
    }

    App.prototype.change = function change(a) {
        this.setState({
            aaa: a
        });
    };

    App.prototype.componentDidMount = function componentDidMount() {
        console.log('App componentDidMount');
    };

    App.prototype.componentWillUpdate = function componentWillUpdate() {
        console.log('App componentWillUpdate');
    };

    App.prototype.render = function render() {
        return this.state.aaa === 'aaa' ? React.createElement(Inner, { title: 'aaa', className: this.state.aaa }) : React.createElement(Inner2, { title: 'bbb', className: this.state.aaa });
    };

    return App;
}(React.Component);

var Inner = function (_React$Component2) {
    _inherits(Inner, _React$Component2);

    function Inner(props) {
        _classCallCheck(this, Inner);

        var _this2 = _possibleConstructorReturn(this, _React$Component2.call(this, props));

        _this2.state = {
            value: '111'
        };
        _this2.onInput = _this2.onInput.bind(_this2);
        return _this2;
    }

    Inner.prototype.onInput = function onInput(e) {
        this.setState({
            value: e.target.value
        });
    };

    Inner.prototype.componentWillMount = function componentWillMount() {
        console.log('Inner componentWillMount');
    };

    Inner.prototype.componentDidMount = function componentDidMount() {
        console.log('Inner componentDidMount');
    };

    Inner.prototype.componentWillUpdate = function componentWillUpdate() {
        console.log('Inner componentWillUpdate');
    };

    Inner.prototype.componentDidUpdate = function componentDidUpdate() {
        console.log('Inner componentDidUpdate');
    };

    Inner.prototype.componentWillUnmount = function componentWillUnmount() {
        console.log('Inner componentWillUnmount');
    };

    Inner.prototype.render = function render() {
        return React.createElement(
            'div',
            { className: this.props.className },
            React.createElement(
                'p',
                null,
                'xxx',
                this.state.value
            ),
            React.createElement(
                'p',
                null,
                React.createElement('input', { value: this.state.value, onInput: this.onInput })
            )
        );
    };

    return Inner;
}(React.Component);

var Inner2 = function (_React$Component3) {
    _inherits(Inner2, _React$Component3);

    function Inner2(props) {
        _classCallCheck(this, Inner2);

        return _possibleConstructorReturn(this, _React$Component3.call(this, props));
    }

    Inner2.prototype.componentWillMount = function componentWillMount() {
        console.log('Inner2 componentWillMount');
    };

    Inner2.prototype.componentDidMount = function componentDidMount() {
        console.log('Inner2 componentDidMount');
    };

    Inner2.prototype.componentWillUpdate = function componentWillUpdate() {
        console.log('Inner2 componentWillUpdate');
    };

    Inner2.prototype.componentWillUnmount = function componentWillUnmount() {
        console.log('Inner2 componentWillUnmount');
    };

    Inner2.prototype.render = function render() {
        return React.createElement(
            'strong',
            { className: this.props.className },
            'yyy'
        );
    };

    return Inner2;
}(React.Component);

var s;
window.onload = function () {
    s = ReactDOM.render(React.createElement(App, null), document.getElementById('example'));
};

/***/ })
/******/ ]);
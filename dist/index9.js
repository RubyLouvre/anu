/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Select = function (_React$Component) {
	    _inherits(Select, _React$Component);
	
	    function Select() {
	        _classCallCheck(this, Select);
	
	        var _this = _possibleConstructorReturn(this, _React$Component.call(this));
	
	        _this.state = {
	            value: 'bbb'
	        };
	        _this.onChange = _this.onChange.bind(_this);
	        return _this;
	    }
	
	    Select.prototype.onChange = function onChange(e) {
	        console.log(e.target.value);
	        this.setState({
	            value: e.target.value
	        });
	    };
	
	    Select.prototype.render = function render() {
	        return React.createElement(
	            'div',
	            null,
	            React.createElement(
	                'select',
	                { value: this.state.value, onChange: this.onChange },
	                React.createElement(
	                    'option',
	                    { value: 'aaa' },
	                    'aaa'
	                ),
	                React.createElement(
	                    'option',
	                    { value: 'bbb' },
	                    'bbb'
	                ),
	                React.createElement(
	                    'option',
	                    { value: 'ccc' },
	                    'ccc'
	                )
	            ),
	            React.createElement(
	                'p',
	                null,
	                this.state.value
	            )
	        );
	    };
	
	    return Select;
	}(React.Component);
	
	var Input = function (_React$Component2) {
	    _inherits(Input, _React$Component2);
	
	    function Input() {
	        _classCallCheck(this, Input);
	
	        var _this2 = _possibleConstructorReturn(this, _React$Component2.call(this));
	
	        _this2.state = {
	            value: 'input'
	        };
	        _this2.onInput = _this2.onInput.bind(_this2);
	        return _this2;
	    }
	
	    Input.prototype.onInput = function onInput(e) {
	        this.setState({
	            value: e.target.value
	        });
	    };
	
	    Input.prototype.render = function render() {
	        return React.createElement(
	            'div',
	            null,
	            React.createElement('input', { value: this.state.value, onInput: this.onInput }),
	            this.state.value
	        );
	    };
	
	    return Input;
	}(React.Component);
	
	var Radio = function (_React$Component3) {
	    _inherits(Radio, _React$Component3);
	
	    function Radio(props) {
	        _classCallCheck(this, Radio);
	
	        var _this3 = _possibleConstructorReturn(this, _React$Component3.call(this, props));
	
	        _this3.state = {
	            value: _this3.props.value
	        };
	        _this3.onChange = _this3.onChange.bind(_this3);
	        return _this3;
	    }
	
	    Radio.prototype.onChange = function onChange(e) {
	        console.log(e.target.value);
	        this.setState({
	            value: e.target.value
	        });
	    };
	
	    Radio.prototype.render = function render() {
	        return React.createElement(
	            'span',
	            null,
	            React.createElement('input', { type: 'radio', name: this.props.name, value: this.props.value, onChange: this.onChange }),
	            this.state.value + ''
	        );
	    };
	
	    return Radio;
	}(React.Component);
	
	window.onload = function () {
	    window.s = ReactDOM.render(React.createElement(
	        'div',
	        null,
	        React.createElement(Select, null),
	        React.createElement(Input, null),
	        React.createElement(Radio, { name: 'sex', value: '\u7537' }),
	        React.createElement(Radio, { name: 'sex', value: '\u5973' })
	    ), document.getElementById('example'));
	};

/***/ })
/******/ ]);
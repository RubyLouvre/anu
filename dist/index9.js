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
	
	/*
	class Select extends React.Component{
	     constructor() {
	        super()
	        this.state = {
	            value: 'bbb'
	        }
	        this.onChange = this.onChange.bind(this)
	    }
	    onChange(e){
	       console.log(e.target.value)
	       this.setState({
	           value: e.target.value
	       })
	    }
	    render() {
	        return <div><select  value={this.state.value} onChange={this.onChange}>
	            <option value='aaa'>aaa</option>
	            <option value='bbb'>bbb</option>
	            <option value='ccc'>ccc</option>
	        </select><p>{this.state.value}</p></div>
	    }
	}
	class Input extends React.Component{
	     constructor() {
	        super()
	        this.state = {
	            value: 'input'
	        }
	        this.onInput = this.onInput.bind(this)
	    }
	    onInput(e){
	       this.setState({
	           value: e.target.value
	       })
	    }
	    render() {
	        return <div><input value={this.state.value} onInput={this.onInput} />{this.state.value}</div>
	    }
	}
	class Radio extends React.Component{
	     constructor(props) {
	        super(props)
	        this.state = {
	            value: this.props.value
	        }
	        this.onChange = this.onChange.bind(this)
	    }
	    onChange(e){
	        console.log(e.target.value)
	       this.setState({
	           value: e.target.value
	       })
	    }
	    render() {
	        return <span><input type='radio' name={this.props.name} value={this.props.value}  onChange={this.onChange} />{this.state.value+''}</span>
	    }
	}
	class Playground extends React.Component{
	     constructor(props) {
	        super(props)
	        this.state = {
	            value: '请上下滚动鼠标滚轮'
	        }
	        this.onWheel = this.onWheel.bind(this)
	    }
	    onWheel(e){
	       this.setState({
	           value: e.wheelDelta
	       })
	    }
	    render() {
	        return <div style={{width:300,height:300,backgroundColor:'red',display:'inline-block'}} onWheel={this.onWheel} >{this.state.value}</div>
	    }
	}
	class MouseMove extends React.Component{
	     constructor(props) {
	        super(props)
	        this.state = {
	            value: '请在绿色区域移动'
	        }
	        this.onMouseMove = this.onMouseMove.bind(this)
	    }
	    onMouseMove(e){
	       var v = e.pageX+' '+e.pageY;
	       this.setState({
	           value: v
	       })
	    }
	    render() {
	        return <div style={{width:300,height:300,backgroundColor:'#a9ea00',display:'inline-block'}} onMouseMove={this.onMouseMove} >{this.state.value}</div>
	    }
	}
	class FocusEl extends React.Component{
	     constructor(props) {
	        super(props)
	        this.state = {
	            value: '点我'
	        }
	        this.onFocus = this.onFocus.bind(this)
	    }
	    onFocus(e){
	       console.log(e.target.title)
	    }
	    render() {
	        return <input  title={this.props.title} onKeyUp={(e)=>{console.log(e.which)}} style={{width:100,height:50,backgroundColor:'green',display:'inline-block'}} onFocus={this.onFocus} />
	    }
	}
	*/
	var HasChild = function (_React$Component) {
	    _inherits(HasChild, _React$Component);
	
	    function HasChild(props) {
	        _classCallCheck(this, HasChild);
	
	        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));
	
	        _this.state = {};
	        _this.onClick = _this.onClick.bind(_this);
	        _this.a = 0;
	        return _this;
	    }
	
	    HasChild.prototype.onClick = function onClick() {
	        this.a = 1;
	        this.forceUpdate();
	    };
	
	    HasChild.prototype.render = function render() {
	        return React.createElement(
	            "div",
	            { onClick: this.onClick },
	            this.a == 0 ? React.createElement(
	                A,
	                { title: "xxx", ref: "a" },
	                "ddd"
	            ) : React.createElement(
	                A,
	                { ddd: "ddd", ref: "a" },
	                "3333"
	            )
	        );
	    };
	
	    return HasChild;
	}(React.Component);
	
	function A(props) {
	
	    return React.createElement(
	        "span",
	        { title: props.title },
	        props.children
	    );
	}
	A.defaultProps = {
	    title: "默认值"
	};
	
	window.onload = function () {
	    //<A title="eee">XXXX</A>
	    var s = window.s = ReactDOM.render(null, document.getElementById("example"));
	};

/***/ })
/******/ ]);
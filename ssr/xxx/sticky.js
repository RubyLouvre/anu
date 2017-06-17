/**
 * @component Sticky
 * @description `Sticky` 组件，只能在 `Scroller` 内部或者列表系列组件的 `staticSection` 中使用，
 * 它内部的子元素在 `Scroller` 滚动时将会获得吸顶效果。
 *
 * `Sticky` 是一个虚拟组件，它只会给它的唯一子元素添加额外的逻辑，而不会改变原有的 `dom` 结构。
 * @instructions {instruInfo: ./sticky.md}{instruUrl: scroller/sticky.html?hideIcon}
 * @author jiao.shen
 * @version  3.0.2
 */
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { getElementOffsetY } from './CommonUtil';

export default class Sticky extends Component {

    static propTypes = {
        /**
         * @property stickyExtraClass
         * @type String
         * @default null
         * @description 在Sticky的子元素处在吸顶状态时，为Scroller的sticky容器添加的额外样式类。
         */
        stickyExtraClass: PropTypes.string,
        /**
         * @property height
         * @type number
         * @default null
         * @version 3.0.6
         * @description 吸顶元素的高度，在infinite的列表组件的staticSection中使用时，设置这个属性可以提高列表的滚动性能。
         */
        height: PropTypes.number,
        children: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string])
    };

    static defaultProps = {
        stickyExtraClass: ''
    };

    static contextTypes = {
        scroller: PropTypes.object
    };

    constructor() {
        super();
        this.domNode = null;
        this.height = null;
        this.offsetTop = null;
        this.className = null;
    }

    componentDidMount() {
        this.scroller = this.context.scroller;

        if (this.scroller) {
            this.initialize();
            this.scroller.stickyHeaders.push(this);
        }
    }

    componentDidUpdate() {
        this.initialize();
    }

    componentWillUnmount() {
        if (this.scroller) {
            this.scroller.stickyHeaders = this.scroller.stickyHeaders.filter((header) => header !== this);
        }
    }

    initialize() {
        const { height } = this.props;
        this.domNode = ReactDOM.findDOMNode(this);
        if (height == null) {
            this.height = this.domNode.offsetHeight;
        } else {
            this.height = this.props.height;
        }
        this.offsetTop = getElementOffsetY(this.domNode, null);
        this.className = this.domNode.className;
        this.onlyChild = React.Children.only(this.props.children);
        this.stickyExtraClass = this.props.stickyExtraClass;
    }

    render() {
        return React.Children.only(this.props.children);
    }
}
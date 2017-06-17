/**
 * @component Toast
 * @version 3.0.0
 * @description 面包屑提示组件，页面居中显示一条提示信息。
 *
 * - 是一个对象，包含show/hide函数，支持简单的链式调用。
 * - 通过调用show函数打开组件，默认显示2s。
 * - 通过调用hide函数立刻关闭组件。
 *
 * @instructions {instruInfo: ./toast.md}{instruUrl: toast.html?hideIcon}
 * @author qingguo.xu
 */
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

let that = null;
const container = document.createElement('div'),

    defaultProps = {
        show: false
    },

    propTypes = {
        /**
         * @property show
         * @description 是否显示，默认false
         * @type Boolean
         * @default false
         * @skip
         */
        show: PropTypes.bool
    };

document.body.appendChild(container);

class ToastReact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show,
            content: '',
            autoHideTime: 2000
        };
        this._timer = null;
        that = this;
    }

    shouldComponentUpdate(nextProps, nextState) {
        this.setState({ show: nextState.show });
        if (!!this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }

        this._timer = setTimeout(() => this.setState({ show: false }), nextState.autoHideTime);
        return true;
    }

    componentWillUnmount() {
        clearTimeout(this._timer);
        document.body.removeChild(container);
    }

    render() {
        const { show, content } = this.state;
        return (
            <div
                className="yo-toast"
                style={{
                    display: show ? null : 'none'
                }}
            >{content}</div>
        );
    }
}

ToastReact.propTypes = propTypes;
ToastReact.defaultProps = defaultProps;

ReactDOM.render(<ToastReact />, container);

/**
 * Toast显隐函数
 * @returns {Object}
 */
export default {
    /**
     * @method show
     * @type Function
     * @description 打开组件，显示传入的内容
     * @param {String} content 组件显示的内容
     * @param {Number} [autoHideTime] 内容显示的持续时间，默认2000ms
     */
    show(content = 'no content', autoHideTime = 2000) {
        that.setState({
            content,
            autoHideTime,
            show: true
        });
        return this;
    },
    /**
     * @method hide
     * @type Function
     * @description 关闭正在显示的组件
     */
    hide() {
        that.setState({ show: false });
        return this;
    }
};
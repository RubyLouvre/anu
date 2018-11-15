

import React from '../../ReactWX.js';

function computedClass(className, disabed, active) {
    return ['anu-btn', className || '', disabed && 'disabled', active && 'active'].join(' ');
}

class AnuButton extends React.Component {
    constructor(props) {
        super(props);
        var title = props.children;
        if (typeof title === 'object') {
            console.wan('button内部只能传字符串与数字');//eslint-disable-line
        }
        this.state = {
            disabed: !!props.disabed,
            title: props.children,
            className: computedClass(props.class, props.disabed)
        };
    }
    onClick(e) {
        if (this.state.disabed) {
            return;
        }
        var fn = this.props.onClick;
        fn && fn.call(this, e);
        this.setState({
            className: computedClass(this.props.class, this.state.disabed, true)
        });
        setTimeout(function () {
            this.setState({
                className: computedClass(this.props.class, this.state.disabed)
            });
        }, 150);
    }
    componentWillReceiveProps(props) {
        this.setState({
            title: props.children,
            className: computedClass(props.class, props.disabed)
        });
    }
    render() {
        return <div onClick={this.onClick.bind(this)} class={this.state.className} >{this.state.class}</div>;
    }
}

export default AnuButton;


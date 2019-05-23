import React from '@react';
import './index.scss';

class YButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.computeState(props, false);

        this.handleClick = this.handleClick.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    computeState(props, active) {
        const buttonClasses = ['anu-button'];
        const labelClasses = ['anu-button__label'];
        const loadingClasses = ['anu-button__loading'];
        if (props.size === 'mini') {
            buttonClasses.push('anu-button--mini');
            labelClasses.push('anu-button__label--mini');
            loadingClasses.push('anu-button__loading--mini');
        }
        buttonClasses.push(`anu-button--${props.type}`);
        labelClasses.push(`anu-button__label--${props.type}`);
        if (props.plain) {
            buttonClasses.push(`anu-button--${props.type}-plain`);
            labelClasses.push(`anu-button__label--${props.type}-plain`);
        }
        if (props.disabled) {
            buttonClasses.push('anu-button--disabled');
            labelClasses.push('anu-button__label--disabled');
        } else if (active) {
            buttonClasses.push('anu-button--active');
            labelClasses.push('anu-button__label--active');
        }
        if (!props.loading) {
            loadingClasses.push('anu-button__loading--hidden');
        }
        return {
            loadingClasses: loadingClasses.join(' '),
            buttonClasses: buttonClasses.join(' '),
            labelClasses: labelClasses.join(' '),
            children: this.props.children,
            env: process.env.ANU_ENV
        };
    }

    updateState(nextProps, active) {
        let newState = this.computeState(nextProps, active);
        let oldState = this.state;
        let lastState = {};
        let diff = false;
        for (var i in oldState) {
            if (oldState[i] !== newState[i]) {
                diff = true;
                lastState[i] = newState[i];
            }
        }
        if (diff) {
            this.setState(lastState);
        }
    }
    componentWillReceiveProps(nextProps) {
        this.updateState(nextProps, false);
    }
    onClick(e) {
        // 不在 XLabel 内部的时候，执行本身逻辑
        // 在快应用下不支持事件冒泡，直接执行本身逻辑
        if (process.env.ANU_ENV === 'quick' || !this.props.__InLabel) {
            this.handleClick(e);
        }
    }
    handleClick(e) {
        var props = this.props;
        Array('onTap', 'catchTap', 'onClick', 'catchClick').forEach(function(
            name
        ) {
            var fn = props[name];
            if (fn) {
                fn(e);
                if (name == 'catchTap' || name == 'catchClick') {
                    e.stopPropagation();
                }
            }
        });
        if (props.disabled) {
            return;
        }
        this.updateState(this.props, true);

        setTimeout(() => {
            this.updateState(this.props, false);
        }, 150);
    }
    render() {
        return (
            <stack
                className={'anu-col anu-center anu-middle ' + this.state.buttonClasses}
                style={this.props.style}
            >
                <div className="anu-button__main anu-row anu-middle">
                    <image
                        className={this.state.loadingClasses}
                        src="https://s.qunarzz.com/flight_qzz/loading.gif"
                    />
                    <text className={this.state.labelClasses}>
                        {this.state.children}
                    </text>
                </div>
                {(this.state.env === 'ali' || this.state.env === 'bu') ?
                    <div className="anu-button__mask" onClick={this.onClick}></div> :
                    <input className="anu-button__mask" type='button' onClick={this.onClick} />}
            </stack>
        );
    }
}

YButton.defaultProps = {
    type: 'default',
    disabled: false,
    plain: false,
    size: 'default',
    style: {},
    loading: false,
    __InLabel: false
};

export default YButton;

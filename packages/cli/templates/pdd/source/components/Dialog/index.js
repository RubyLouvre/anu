import React from '@react';

class Dialog extends React.Component {
    constructor() {
        super();
        this.state = {
            title: '弹窗',
            content: '弹窗内容1111',
            cancelText: '取消',
            okText: '确定'
        };
    }


    render() {
        return (
            <div hidden={this.props.visible}>
                <div className="ys-mask" />
                <div className="ys-dialog">
                    <div className="ys-dialog-title">{this.state.title}</div>
                    <div className="ys-dialog-content">{this.state.content}</div>
                    <div className="ys-dialog-bottom">
                        <button class="ys-dialog-btn" onTap={this.props.onCanel}>{this.state.cancelText}</button>
                        <div class="ys-dialog-btn ys-dialog-ok-btn" onTap={this.props.onOk}>{this.state.okText}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dialog;

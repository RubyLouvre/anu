import React from '@react';
import Dialog from '@syntaxComponents/Dialog/index';
import './index.scss';
class P extends React.Component {
    constructor() {
        super();
        this.state = {
            hidden: true
        };
    }

    toggleDialog() {
        // eslint-disable-next-line
        this.setState({
            hidden: !this.state.hidden
        });
    }
    closeDialog() {
        this.setState({
            hidden: true
        });
    }
    render() {
        return (
            <div class="anu-block">
                <div>演示组件标签包含其他内容</div>
                <div  hidden={this.state.hidden}>
                    <Dialog>
                        <p>{this.state.title}</p>
                        <p>弹窗其他内容1</p>
                        <p>弹窗其他内容2</p>
                        <p>
                            <button
                                type="default"
                                size="mini"
                                onTap={this.closeDialog.bind(this)}
                            >
                                关闭
                            </button>
                        </p>
                    </Dialog>
                </div>
                <p>
                    <button type="primary" onTap={this.toggleDialog.bind(this)}>
                        点我
                    </button>
                </p>
            </div>
        );
    }
}

export default P;

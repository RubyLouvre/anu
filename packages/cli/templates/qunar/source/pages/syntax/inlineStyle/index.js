import React from '@react';
import './index.scss';
const formItemStyle = {
    marginBottom: '10px',
    textAlign: 'center',
    padding: '10px 10px 10px 10px',
    fontWeight: 'bold'
};

class Style extends React.Component {
    constructor() {
        super();
        this.state = {
            title: '使用 React 编写小程序',
            methodColor: {
                color: 'blue',
                bac: '#fee',
                radius: '4px'
            }
        };
    }
    config = {
        navigationBarTextStyle: '#fff',
        navigationBarBackgroundColor: '#0088a4',
        navigationBarTitleText: 'Demo',
        backgroundColor: '#eeeeee',
        backgroundTextStyle: 'light'
    };

    static defaultProps = {
        studyTip: 1
    };
    render() {
        return (
            <div class="inline-container">
                <div class="item">1. class 样式</div>
                <div class="page_hd">{this.state.title}</div>
                <div class="item">2. 传统 inlineStyle 样式</div>
                <div
                    style={{
                        textAlign: 'center',
                        padding: '10px 10px 10px 10px',
                        fontWeight: 'bold',
                        fontSize: '13px'
                    }}
                >
                    {this.state.title}
                </div>
                <div class="item">3. props 为参数 inlineStyle 样式</div>
                <div style={{ zIndex: this.props.studyTip === 0 ? 3 : 1 }}>
                    {this.state.title}
                </div>
                <div class="item">4. 直接是object 为参数 inlineStyle 样式</div>
                <div style={formItemStyle}>{this.state.title}</div>
                <div class="item">5. state 为参数 inlineStyle 样式</div>
                <div
                    style={{
                        color: this.state.methodColor.color,
                        backgroundColor: this.state.methodColor.bac
                    }}
                >
                    <text style={{
                        color: this.state.methodColor.color,
                        backgroundColor: this.state.methodColor.bac
                    }}>{this.state.title}</text>
                </div>
            </div>
        );
    }
}
export default Style;

import React from '@react';
import Count from '@syntaxComponents/Count/index';
import './index.scss';
class P extends React.Component {
    constructor() {
        super();
        this.state = {
            a: 111,
            b: 222,
            styles: {
                a: {
                    border:'1px solid red'
                }
            }
        };
    }
    changeA(e) {
        this.setState({
            a: ~~e.target.value,
        });
    }
    changeB(e) {
        this.setState({
            b: ~~e.target.value,
        });
    }
    render() {
        return (
            <div class='anu-block'>
                <div class='anu-page-header' style={this.state.styles.a}>无狀态组件</div>
                <p class='anu-block'>
                    <p>输入a(绑定onInput事件,箭头函数)</p>
                    <input
                        type="number"
                        style="border: 1px solid gray;width:50%"
                        value={this.state.a}
                        onChange={ (e)=> this.changeA(e) }
                    />
                </p>
                <p class='anu-block'>
                    <p>输入b(绑定onChange事件,箭头函数)</p>
                    <input
                        type="number"
                        style="border: 1px solid gray;width:50%"
                        value={this.state.b}
                        onChange={ (e)=> this.changeB(e) }
                    />
                </p>
                <div>
                    <Count a={this.state.a} b={this.state.b} />
                </div>
            </div>
        );
    }
}

export default P;

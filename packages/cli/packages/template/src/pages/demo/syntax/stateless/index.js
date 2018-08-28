import React from '@react';
import Count from '@components/Count/index';
class P extends React.Component {
    constructor() {
        super();
        this.state = {
            a: 111,
            b: 222
        };
    }
    changeA(e) {
        this.setState({
            a: ~~e.target.value
        });
    }
    changeB(e) {
        this.setState({
            b: ~~e.target.value
        });
    }
    render() {
        return (
            <div>
                <div>无狀态组件</div>
                <p>
                    输入a
                    <input
                        type="number"
                        value={this.state.a}
                        onChange={this.changeA.bind(this)}
                    />
                </p>
                <p>
                    输入b
                    <input
                        type="number"
                        value={this.state.b}
                        onChange={this.changeB.bind(this)}
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

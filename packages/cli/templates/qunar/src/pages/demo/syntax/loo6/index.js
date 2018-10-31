import React from '@react';
import Dog from '@components/Dog/index';

class P extends React.Component {
    constructor() {
        super();
        this.state = {
            add: false
        };
    }

    add() {
        // eslint-disable-next-line
        this.setState({
            add: true
        });
    }

    render() {
        return (
            <div>
                <div onTap={this.add.bind(this)}>
                    演示单重循环，点这里改变数组的个数
                </div>
                <Dog name="666" age={666} />
                <Dog name="777" age={777} />
                <Dog name="888" age={888} />
                {this.state.add ? [  <Dog name="999" age={999} />,  <Dog name="www" age={111} />]: null}
            </div>
        );
    }
}

export default P;

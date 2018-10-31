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
                <Dog name="111" age={111} />
                <Dog name="222" age={222} />
                <Dog name="333" age={333} />
                {this.state.add ? [  <Dog name="444" age={444} />,  <Dog name="555" age={555} />]: null}
            </div>
        );
    }
}

export default P;

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
                    点这里添加狗
                </div>
                <Dog name="666" age={666} />
                <Dog name="777" age={777} />
                <Dog name="888" age={888} />
                {this.state.add ?  <Dog name="999" age={999} /> : null}
            </div>
        );
    }
}

export default P;

import React from '@react';
import Dog from '@syntaxComponents/Dog/index';
import './index.scss';

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
            <div class='anu-block'>
                <div onTap={this.add.bind(this)}>
                    点这里添加狗
                </div>
                <Dog name="111" age={111} />
                <Dog name="222" age={222} />
                <Dog name="333" age={333} />
                {this.state.add ? <Dog name="444" age={444} /> : null}
            </div>
        );
    }
}

export default P;

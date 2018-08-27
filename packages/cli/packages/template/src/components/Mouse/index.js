import React from '@react';

class Mouse extends React.Component {
    constructor() {
        super();
        this.state = {
            x: 1,
            y: 2
        };
    }

    render() {
        return <div class="mouse">{this.props.children(this.state)}</div>;
    }
}

export default Mouse;

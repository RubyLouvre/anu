import React from '@react';

class MouseTracker extends React.Component {
    constructor(props) {
        super(props);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.state = { x: 4, y: 5 };
    }
  
    handleMouseMove(event) {
        this.setState({
            x: event.pageX,
            y: event.pageY
        });
    }
  
    render() {
        return (
            <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>
                <h1>Move the mouse around!</h1>
                <p>The current mouse position{this.props.renderUid} is ({this.state.x}, {this.state.y})</p>
                <p>{this.props.render(this.state)}</p>
            </div>
        );
    }
}
export default  MouseTracker;
import React from '@react';

class MouseTracker extends React.Component {
    constructor(props) {
        super(props);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.state = { x: 4, y: 5 };
    }
  
    handleMouseMove(e) {
        this.setState({
            x: e.x,
            y: e.y
        });
    }
  
    render() {
        return (
            <div style={{ height: '1000rpx' }} onClick={this.handleMouseMove}>
                <h1>随机点击页面!</h1>
                <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
                <p>{this.props.render(this.state)}</p>
            </div>
        );
    }
}
export default  MouseTracker;
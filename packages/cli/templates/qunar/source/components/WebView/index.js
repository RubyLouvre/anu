import React from '@react';

class WebView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            src: ''
        };
    }
    componentDidMount() {
        this.setState({
            src: this.props.src
        });
    }
    render() {
        return (
            <view>
                {this.state.src ? (
                    <web-view src={this.state.src} />
                ) : (
                    <text>111</text>
                )}
            </view>
        );
    }
}

export default WebView;

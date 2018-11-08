import React from '@react';
import WebView from '@components/WebView/index';
class P extends React.Component {
    constructor() {
        super();
        this.state = {
        };
    }
    
    render() {
        return (
            <div>
                <WebView src={'https://m.qunar.com'} />
            </div>
        );
    }
}

export default P;

import React from '@react';
import QunarWebView from '@components/QunarWebView/index';
class P extends React.Component {
    constructor() {
        super();
        this.state = {
        };
    }
    
    render() {
        return (
            <div>
                <QunarWebView src={'https://m.qunar.com'} />
            </div>
        );
    }
}

export default P;

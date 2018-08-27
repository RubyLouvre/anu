import React from '@react';
import Dog from '@components/Dog/index';

class P extends React.Component {
    render() {
        return (
            <div>
                <div>类继承的演示</div>
                <Dog age={12} />
            </div>
        );
    }
}

export default P;

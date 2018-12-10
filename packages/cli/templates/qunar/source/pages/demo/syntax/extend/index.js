import React from '@react';
import './index.scss';
import Dog from '@components/Dog/index';

class P extends React.Component {
    render() {
        return (
            <div class="anu-block">
                <div >类继承的演示</div>
                <Dog age={12} />
            </div>
        );
    }
}

export default P;

import React from '../../../ReactWX';
import Dog from '../../../components/Dog/index';

class P extends React.Component{
    render() {
        return (
            <div>
                <div>Dog测试</div>
                <Dog age={12} />
            </div>
        );
    }
}

export default P;

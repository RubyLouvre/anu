import React from '@react';
import Welcome from '@components/Welcome/index';
import './index.scss';
class P extends React.Component {
    componentDidMount() {
        // eslint-disable-next-line
    console.log('page did mount!');
    }
    render() {
        return (
            <div class='page'>
                <Welcome text='nanachi' />
            </div>
        );
    }
}

export default P;
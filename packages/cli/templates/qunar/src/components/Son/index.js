import React from '@react';
import './index.scss';
class Son extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        /* eslint-disable */
		console.log('Son did mount!');
	}
	render() {
		return <div class="son">最内层组件</div>;
	}
}

export default Son;

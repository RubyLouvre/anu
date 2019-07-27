import React from '@react';
import Parent from '../Parent/index';
import './index.scss';
class Super extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        /* eslint-disable */
		console.log('Super did mount!');
	}
	render() {
		return (
			<div class="super">
				<div class="title">最外层组件</div>
				<Parent />
			</div>
		);
	}
}

export default Super;

import React from '@react';
import Son from '../Son/index';
import './index.scss';
class Parent extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        /* eslint-disable */
		console.log('Parent did mount!');
	}
	render() {
		return (
			<div class="parent">
				<div class="title">第二层组件</div>
				<Son />
			</div>
		);
	}
}

export default Parent;

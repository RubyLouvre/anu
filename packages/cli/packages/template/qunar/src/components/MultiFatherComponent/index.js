import React from '@react';
import MultiBaseComponent from '../MultiBaseComponent/index';
class MultiFatherComponent extends React.Component {
	constructor() {
		super();
	}

	componentDidMount() {
		/* eslint-disable */
		console.log('MultiFatherComponent did mount!');
	}
	render() {
		return (
			<div class="multi-father-component">
				<div class="title">第二层组件</div>
				<MultiBaseComponent />
			</div>
		);
	}
}

export default MultiFatherComponent;

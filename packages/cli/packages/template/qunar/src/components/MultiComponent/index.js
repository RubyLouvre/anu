import React from '@react';
import MultiFatherComponent from '../MultiFatherComponent/index';
class MultiComponent extends React.Component {
	constructor() {
		super();
	}

	componentDidMount() {
		/* eslint-disable */
		console.log('MultiComponent did mount!');
	}
	render() {
		return (
			<div class="multi-component">
				<div class="title">最为外层组件</div>
				<MultiFatherComponent />
			</div>
		);
	}
}

export default MultiComponent;

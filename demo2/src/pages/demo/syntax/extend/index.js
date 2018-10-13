import React from '@react';
import Dog from '@components/Dog/index';

class P extends React.Component {
	componentWillMount() {
		console.log('P componentWillMount');
	}
	componentDidMount() {
		console.log('P componentDidMount');
	}
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

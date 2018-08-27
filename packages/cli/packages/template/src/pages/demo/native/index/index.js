import React from '@react';
class P extends React.Component {
	constructor() {
		const ROOT_PATH = '/pages/demo/native';
		this.state = {
			array: 'button,checkbox,input,slider,picker,radio,textarea,label,audio,camera,image,video'
				.split(',')
				.map(function(name) {
					return {
						url: `${ROOT_PATH}/${name}/index`,
						name: name,
					};
				}),
		};
	}
	config = {
		navigationBarBackgroundColor: '#ffffff',
		navigationBarTextStyle: '#fff',
		navigationBarBackgroundColor: '#0088a4',
		navigationBarTitleText: 'button demo',
		backgroundColor: '#eeeeee',
		backgroundTextStyle: 'light',
	};
	render() {
		return (
			<div class="container">
				<ul class="item-list">
					{//issues, 渲染class上非state数据
					this.state.array.map(function(item) {
						return (
							<li class="item">
								<navigator open-type="navigate" hover-class="navigator-hover" url={item.url}>
									{item.name}
								</navigator>
							</li>
						);
					}, true)}
				</ul>
			</div>
		);
	}
}

export default P;

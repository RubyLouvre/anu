import React from '@react';
import './index.scss';
/*eslint-disable*/
class P extends React.Component {
	constructor() {
		super();
		this.state = {
			defaultSize: 'default',
			primarySize: 'default',
			warnSize: 'default',
			disabled: false,
			plain: false,
			loading: false,
			ANU_ENV: process.env.ANU_ENV
		};

	}

	setDisabled() {
		console.log('disabled');
		this.setState({
			disabled: !this.state.disabled
		});
	}

	setPlain() {
		this.setState({
			plain: !this.state.plain
		});
	}

	setLoading() {
		this.setState({
			loading: !this.state.loading
		});
	}

	getUserInfo(e) {
		// eslint-disable-next-line
		console.log(e);
	}

	click(e) {
		console.log('click', e);
	}

	render() {
		return (
			<div class="anu-block">
				{
					this.state.ANU_ENV === 'quick' ?
					<div class="quick-container">
						<text disabled={this.state.disabled} class={'quick-button ' + (this.state.plain ? 'default-plain' : 'default')} onTap={this.click}>default</text>
						<text disabled={this.state.disabled} class={'quick-button ' + (this.state.plain ? 'primary-plain' : 'primary')} onTap={this.click}>primary</text>
						<text disabled={this.state.disabled} class={'quick-button ' + (this.state.plain ? 'warning-plain' : 'warning')} onTap={this.click}>warning</text>


						<text class="quick-button default" onTap={this.setDisabled.bind(this)}>点击设置以上按钮disabled属性</text>
						<text class="quick-button default" onTap={this.setPlain.bind(this)}>点击设置以上按钮plain属性</text>
					</div> :
					<div>
						<div style="margin: 4px 0px">
							<button
								class="anu-block"
								type="default"
								loading={this.state.loading}
								disabled={this.state.disabled}
								plain={this.state.plain}
							>
								default
							</button>
						</div>
						<div style="margin: 4px 0px">
							<button
								class="anu-block"
								type="primary"
								size="mini"
								loading={this.state.loading}
								disabled={this.state.disabled}
								plain={this.state.plain}
							>
								primary
							</button>
						</div>
						<div style="margin: 4px 0px">
							<button
								class="anu-block"
								type="warn"
								disabled={this.state.disabled}
								plain={this.state.plain}
								loading={this.state.loading}
							>
								warn
							</button>
							<button class="anu-block" type="warn" disabled={this.state.disabled} plain={this.state.plain}>
								warn
							</button>
						</div>
						<div style="margin: 4px 0px">
							<button onClick={this.setDisabled.bind(this)}>点击设置以上按钮disabled属性</button>
						</div>
						<div style="margin: 4px 0px">
							<button onClick={this.setPlain.bind(this)}>点击设置以上按钮plain属性</button>
						</div>
						<div style="margin: 4px 0px">
							<button onClick={this.setLoading.bind(this)}>点击设置以上按钮loading属性</button>
						</div>
						<button
							class="bottom"
							type="primary"
							open-type="getUserInfo"
							lang="zh_CN"
							onGetUserInfo={this.getUserInfo.bind(this)}
						>
							授权登录{' '}
						</button>{' '}
					</div>

				}


			</div>
		);
	}
}

export default P;

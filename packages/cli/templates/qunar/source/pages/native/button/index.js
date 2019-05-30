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
			ANU_ENV: process.env.ANU_ENV,
			product: {
				"item_code":"00003563372839_00000010154601",
				"title":"皇袍",
				"desc":"product_description",
				"category_list":[
				  "服装",
				  "上衣",
				  "短袖衬衫"
				],
				"image_list":[
				  "https://res.wx.qq.com/mpres/htmledition/images/xxxx.jpeg"
				],
				"src_mini_program_path":"/detail?item_code=00003563372839_00000010154601",
				"sku_list":[
				  {
					"sku_id":"SKU_ID",
					"price":12345,
					"original_price":67890,
					"status":1,
					"poi_list":[
					  {
						"longitude":116.32676,
						"latitude":40.003305,
						"radius":5,
						"business_name":"XXX",
						"branch_name":"珠江新城店",
						"address":"新港中路123号"
					  },
					  {
						"longitude":117.32676,
						"latitude":41.003305,
						"radius":5,
						"business_name":"CCC",
						"branch_name":"客村店",
						"address":"新港中路123号"
					  }
					],
					"sku_attr_list":[
					  {
						"name":"颜色",
						"value":"白色"
					  },
					  {
						"name":"尺码",
						"value":"XXL"
					  }
					]
				  }
				],
				"brand_info":{
				  "name":"品牌名、小程序名",
				  "logo":"http://xxxxx"
				}
			  }
			  
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
				{ this.state.ANU_ENV == 'wx'  && <div style="margin: 4px 0px"><share-button product={this.state.product} /></div> }


			</div>
		);
	}
}

export default P;

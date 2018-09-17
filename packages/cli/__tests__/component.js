const { transform, getTemplate, evalClass } = require('./utils/utils');
let q = require('../packages/translator/queue');
const prettifyXml = require('prettify-xml');

describe('component support', () => {
	test('work with es6 template string', () => {
		 transform(
			`
                return (
                <div><Cat context={this.state.aaa} /></div>
                )
            `,
			"aaa: 'xxx'",
			"import Cat from '../packages/template/qunar/components/Cat/index'"
		);

		let template = getTemplate(q);
		expect(template).toMatch(
			prettifyXml(
				`<import src="../packages/template/qunar/components/Cat/index.wxml" />
                <view>
                  <template is="Cat" data="{{...data}}" wx:for="{{components.data1202}}" wx:for-item="data" wx:for-index="index" wx:key="*this">
                  </template>
                </view`
			)
		);
	});
});

const { transform, getXml } = require('./utils/utils');
const prettifyXml = require('prettify-xml');

describe('if statement', () => {
    test('if 简单情况-bu', () => {
        let code = ` 
    if (this.state.tasks !== null) {
      return <view class='page-body'>tasks</view>
    }
    return (
        <div class="page-body"><span>Hello world!</span></div>
     )
   `;
        transform(code, 'bu');
        let templateBu = getXml();
        expect(prettifyXml(templateBu)).toMatch(
            prettifyXml(
                `<block s-if="state.tasks !== null">
        <view class="page-body">tasks</view>
        </block>
        <block s-elif="true">
        <view class="page-body">
        <text>Hello world!</text>
        </view>
        </block>`
            )
        );
    });

    test('if-eles bu', () => {
        let code = `
    if (this.state.tasks !== null) {
      return <view class="page-body">tasks</view>;
    } else if (this.state.task.length === 0) {
      return (
        <view class="page-body">
          <text>{tasks.length}</text>
        </view>
      );
    } else {
      return (
        <div class="page-body">
          <span>Hello world!</span>
        </div>
      );
    }
    `;
        transform(code, 'bu');
        let templateWX = getXml();
        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                `<block s-if="state.tasks !== null">
            <view class="page-body">tasks</view>
        </block>
        <block s-elif="true">
            <block s-if="state.task.length === 0">
              <view class="page-body">
                <text>{{tasks.length}}</text>
              </view>
            </block>
            <block s-elif="true">
              <view class="page-body">
                <text>Hello world!</text>
              </view>
          </block>
        </block>`
            )
        );
    });
});

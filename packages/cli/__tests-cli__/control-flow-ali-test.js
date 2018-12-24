const { transform, getXml } = require('./utils/utils');
const prettifyXml = require('prettify-xml');

describe('if statement', () => {
  test('if 简单情况-ali', () => {
    let code = ` 
  if (this.state.tasks !== null) {
    return <view class='page-body'>tasks</view>
  }
  return (
      <div class="page-body"><span>Hello world!</span></div>
   )
 `;
    transform(code, 'ali');
    let templateAli = getXml();
    expect(prettifyXml(templateAli)).toMatch(
      prettifyXml(
        `<block a:if="{{state.tasks !== null}}">
              <view class="page-body">tasks</view>
            </block>
            <block a:else="true">
              <view class="page-body">
                <text>Hello world!</text>
              </view>
            </block>`
      )
    );
  });

  test('if-eles ali', () => {
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
    transform(code, 'ali');
    let templateWX = getXml();
    expect(prettifyXml(templateWX)).toMatch(
      prettifyXml(
        `<block a:if="{{state.tasks !== null}}">
        <view class="page-body">tasks</view>
      </block>
      <block a:else="true">
        <block a:if="{{state.task.length === 0}}">
          <view class="page-body">
            <text>{{tasks.length}}</text>
          </view>
        </block>
        <block a:else="true">
          <view class="page-body">
            <text>Hello world!</text>
          </view>
        </block>
      </block>`
      )
    );
  })



});

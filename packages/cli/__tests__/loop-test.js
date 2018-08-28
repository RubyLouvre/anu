const { transform } = require('./utils/utils');
let q = require('../packages/translator/queue');
const prettifyXml = require('prettify-xml');

describe('loop', () => {
  test('简单情况', () => {
    transform(
      `return (
               <View>{this.state.array.map(function(item) {
                 return <CoverView>{item.list.map(function(item2) {return <Text>{item2}</Text>})}</CoverView>
               })}</View>
             )
           `
    );
    let template = q.wxml[q.wxml.length - 1].code;

    expect(template).toMatch(
      prettifyXml(
        `<view>
          <block wx:for="{{state.array}}" wx:for-item="item">
          <view>
          <block wx:for="{{item.list}}" wx:for-item="item2">
          <view>{{item2}}</view>
          </block>
          </view>
          </block>
          </view>`
      )
    );
  });
  test('calee 之前可以使用逻辑表达式', () => {
    transform(
      `return (
            <div>
            {this.state.arr.length === 0
                ? null
                : this.state.arr.map(function(e, i) {
                    return (
                      <div key={i} className="ratio-16-9 image-company-album">
                        loop1: {i}
                      </div>
                    );
                  })}
            </div>
        )`
    );
    let template = q.wxml[q.wxml.length - 1].code;
    expect(template).toMatch(
      prettifyXml(`<view>
      <block>
        <block wx:if="{{state.arr.length === 0}}">{{null}}</block>
        <block wx:else="true">
          <block wx:for="{{state.arr}}" wx:for-item="e" wx:for-index="i">
            <view class="ratio-16-9 image-company-album" wx:key="{{i}}">
              loop1: {{i}}
            </view>
          </block>
        </block>
      </block>
    </view>`)
    );
  });
});

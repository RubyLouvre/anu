const { transform } = require('./utils/utils');
let q = require('../packages/translator/queue');
const prettifyXml = require('prettify-xml');

describe('基本功能', () => {
    test('属性中存在三元表达式', () => {
      transform(
        `return (
               <View>{this.state.array.map(function(item) {
                 return <CoverView>{item.list.map(function(item2) {return <Text>{item2}</Text>})}</CoverView>
               })}</View>
             )
           `
      );
      let template = q.wxml[0].code;

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

  
});
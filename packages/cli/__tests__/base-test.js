const { transform } = require('./utils/utils');
let q = require('../packages/translator/queue');
const prettifyXml = require('prettify-xml');

describe('基本功能', () => {
    test('属性中存在三元表达式', () => {
      transform(
        `return (
            <div className={this.state.flag === clickValue ? 'checked' : ''}></div>
             )
           `
      );
      let template = q.wxml[0].code;

      expect(template).toMatch(
        prettifyXml(
          `<view class="{{state.flag === clickValue ? 'checked' : ''}}">\n</view>`
        )
      );
    });
    test('属性中存在三元表达式 2', () => {
        transform(
          `return (
              <div className={'row ' + (this.state.flag === clickValue ? 'checked' : '')}></div>
               )
             `
        );
        let template = q.wxml[0].code;
  
        expect(template).toMatch(
          prettifyXml(
            `<view class="{{state.flag === clickValue ? 'checked' : ''}}">\n</view>`
          )
        );
      });
  
});
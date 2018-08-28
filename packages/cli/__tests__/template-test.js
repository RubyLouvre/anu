const { transform, evalClass, getPropsStyle } = require('./utils/utils');
let q = require('../packages/translator/queue');
const prettifyXml = require('prettify-xml');

describe('inline style', () => {
  test('简单情况', () => {
    let code = transform(
      `return (
            <div style={{color: 'red'}}></div>
          )`
    );

    let inst = evalClass(code);
    expect(getPropsStyle(inst.data.props)).toMatch(`color: red`);
  });

  test('style 有 - 符号', () => {
    let code = transform(
      `return (
            <div style={{'fontSize': '16px'}}></div>
          )`
    );

    let inst = evalClass(code);
    expect(getPropsStyle(inst.data.props)).toMatch(`font-size: 16rpx`);
  });

  test('多个对象', () => {
    let code = transform(
      `return (
            <div style={{marginTop: '10rpx', fontSize: '13px', lineHeight: '25px' }}></div>
          )`
    );

    let inst = evalClass(code);
    expect(getPropsStyle(inst.data.props)).toMatch(`margin-top: 10rpx;font-size: 13rpx;line-height: 25rpx`);
  });

  test('不转换字符串', () => {
    let code = transform(
      `return (
            <div style='color: red'></div>
          )`
    );
    
    let template = q.wxml[q.wxml.length-1].code
    expect(template).toMatch(prettifyXml(`<view style=\"color: red\"></view>`))
    // let inst = evalClass(code);
    // expect(getPropsStyle(inst.data.props)).toMatch(`margin-top: 10rpx;font-size: 13rpx;line-height: 25rpx`);
  });
});

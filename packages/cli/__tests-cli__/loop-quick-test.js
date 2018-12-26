const { getXml } = require('./utils/utils');
const prettifyXml = require('prettify-xml');
const BUILD_TYPE = 'quick';

describe('loop 简单情况', () => {
    test('loop 简单情况-quick', async () => {
        let code = `
    return (
      <div>
        {
          this.state.array.map(function(item, index) {
            return <div>{item.item}</div>
          })
        }
      </div>
    )
    `;
    
        let templateWX = await getXml(code, BUILD_TYPE);
        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                `<template>
            <div>
                <block for="(index,item) in state.array">
                    <div><text>{{item.item}}</text></div>
                </block>
            </div>
    </template>`
            )
        );
    });
    test('loop 简单情况，有key值1 -quick', async () => {
        let code = `
    return (
      <div>
        {
          this.state.array.map(function(item, index) {
            return <div key={item.item}>{item.item}</div>
          })
        }
      </div>
    )
    `;
    
        let templateWX = await getXml(code, BUILD_TYPE);
        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                `<template>
        <div>
            <block for="(index,item) in state.array">
                <div><text>{{item.item}}</text></div>
            </block>
        </div>
</template>`
            )
        );
    });

    test('loop 简单情况，有key值2 -quick', async () => {
        let code = `
    return (
      <div>
        {
          this.state.array.map(function(item) {
            return <div key={item}>{item.item}</div>
          })
        }
      </div>
    )
    `;
    
        let templateWX = await getXml(code, BUILD_TYPE);
        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                `<template>
        <div>
            <block for="(i190,item) in state.array">
                <div><text>{{item.item}}</text></div>
            </block>
        </div>
</template>`
            )
        );
    });

    test('calee 之前可以使用逻辑表达式-quick', async () => {
        let code = `
      return (
        <div>
          {
            this.state.array.length ? this.state.array.map(function(item, index) {
              return <div key={index}>{item.item}</div>
            }) : null
          }
        </div>
      )
      `;
    
        let templateWX = await getXml(code, BUILD_TYPE);
        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                `<template>
            <div>
                <block if="{{state.array.length}}">
                    <block for="(index,item) in state.array">
                        <div><text>{{item.item}}</text></div>
                    </block>
                </block>
            </div>
    </template>`
            )
        );
    });

    test('calee 之前可以使用逻辑表达式 -quick', async () => {
        let code = `
      return (
        <div>
          {
            this.state.array.length ? this.state.array.map(function(item, index) {
              return <div key={index}>{item.item}</div>
            }) : null
          }
        </div>
      )
      `;

        let templateWX = await getXml(code, BUILD_TYPE);
        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                `<template>
            <div>
                <block if="{{state.array.length}}">
                    <block for="(index,item) in state.array">
                        <div><text>{{item.item}}</text></div>
                    </block>
                </block>
            </div>
    </template>`
            )
        );
    });

    test('calee 之前可以使用逻辑表达式2 -quick', async () => {
        let code = `
      return (
        <div>
          {
            this.state.array&& this.state.array.length && this.state.array.map(function(item) {
              return <div >{item.item}</div>
            })
          }
        </div>
      )
      `;

        let templateWX = await getXml(code, BUILD_TYPE);
        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                `<template>
            <div>
                <block if="{{state.array && state.array.length}}">
                    <block for="(i244,item) in state.array">
                        <div><text>{{item.item}}</text></div>
                    </block>
                </block>
            </div>
    </template>`
            )
        );
    });

    test('loop 二重循环-quick', async () => {

        let code = `
    return (
      <div>
        {this.state.multiArr.map(function(item) {
          return (
            <div>
              {item.list.map(function(item2) {
                return <span>{item2}</span>;
              })}
            </div>
          );
        })}
      </div>
    );
    `;
        let templateWX = await getXml(code, BUILD_TYPE);
        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                `<template>
            <div>
                <block for="(i179,item) in state.multiArr">
                    <div>
                        <block for="(i272,item2) in item.list"><text>{{item2}}</text></block>
                    </div>
                </block>
            </div>
    </template>`
            )
        );



    });

    test('loop 二重循环并支持条件表达式-quick', async () => {
        let code = `
    return (
      <div>
        {this.state.multiArr.map(function(item) {
          return (
            <div>
              {item.list.map(function(item2) {
                return this.state.isOk ? <span>{item2}</span> : <div>noOk</div>;
              })}
            </div>
          );
        })}
      </div>
    );
    `;
        let templateWX = await getXml(code, BUILD_TYPE);
        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                `<template>
            <div>
                <block for="(i179,item) in state.multiArr">
                    <div>
                        <block for="(i272,item2) in item.list">
                            <block if="{{state.isOk}}"><text>{{item2}}</text></block>
                            <block elif="true">
                                <div><text>noOk</text></div>
                            </block>
                        </block>
                    </div>
                </block>
            </div>
    </template>`
            )
        );
    });
});

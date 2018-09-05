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
        <block wx:for="{{state.array}}" wx:for-item="item" wx:for-index="i494" wx:key="*this">
          <view>
            <block wx:for="{{item.list}}" wx:for-item="item2" wx:for-index="i568" wx:key="*this">
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
          <block wx:for="{{state.arr}}" wx:for-item="e" wx:for-index="i" wx:key="*this">
            <view class="ratio-16-9 image-company-album">
              loop1: {{i}}
            </view>
          </block>
        </block>
      </block>
    </view>`)
    );
  });

  test('支持逻辑表达式', () => {
    transform(
      `return (
        <div>
        {this.state.array.map(function(item) {
          return (
            <div>
              {item.list.map(function(item2) {
                return this.state.b1 && <span>{item2}</span>;
              })}
            </div>
          );
        })}
      </div>
      )`,
      `array: [{ list: [1,2,3] }],
      b1: true`
    );
    let template = q.wxml[q.wxml.length - 1].code;

    expect(template).toMatch(
      prettifyXml(
        `<view>
          <block wx:for="{{state.array}}" wx:for-item="item" wx:for-index="i537" wx:key="*this">
            <view>
              <block wx:for="{{item.list}}" wx:for-item="item2" wx:for-index="i627" wx:key="*this">
                <block wx:if="{{state.b1}}">
                  <text>{{item2}}</text>
                </block>
              </block>
            </view>
          </block>
        </view>`
      )
    );
  });

  test('支持逻辑表达式2', () => {
    transform(
      `return (
        <div>
            {this.state.array.map(function (item) {
              return (
                <div>
                  {item.list.map(function(item2) {
                    return (
                      this.state.b1 && (
                        <div>
                          {this.state.b2 && <div />}
                          <div>
                            <text />
                            {this.state.b4 && <button />}
                          </div>
                          {this.state.b3 && <progress />}
                        </div>
                      )
                    );
                  })}
                </div>
              );
            })}
          </div>
      )`,
      `array: [{ list: [1,2,3] }],
      b1: true,
      b2: true,
      b3: true,
      b4: true`
    );
    let template = q.wxml[q.wxml.length - 1].code;

    expect(template).toMatch(
      prettifyXml(
        `<view>
        <block wx:for="{{state.array}}" wx:for-item="item" wx:for-index="i589" wx:key="*this">
          <view>
            <block wx:for="{{item.list}}" wx:for-item="item2" wx:for-index="i692" wx:key="*this">
              <block wx:if="{{state.b1}}">
                <view>
                  <block wx:if="{{state.b2}}">
                    <view />
                  </block>
                  <view>
                    <text />
                    <block wx:if="{{state.b4}}">
                      <button />
                    </block>
                  </view>
                  <block wx:if="{{state.b3}}">
                    <progress />
                  </block>
                </view>
              </block>
            </block>
          </view>
        </block>
      </view>`
      )
    );
  });

//   test('支持逻辑表达式, 箭头函数', () => {
//     transform(
//       `return (
//         <div>
//             {this.state.array.map((item) => {
//               return (
//                 <div>
//                   {item.list.map((item2) => {
//                     return (
//                       this.state.b1 && (
//                         <div>
//                           {this.state.b2 && <div />}
//                           <div>
//                             <text />
//                             {this.state.b4 && <button />}
//                           </div>
//                           {this.state.b3 && <progress />}
//                         </div>
//                       )
//                     );
//                   })}
//                 </div>
//               );
//             })}
//           </div>
//       )`,
//       `array: [{ list: [1,2,3] }],
//       b1: true,
//       b2: true,
//       b3: true,
//       b4: true`
//     );
//     let template = q.wxml[q.wxml.length - 1].code;

//     expect(template).toMatch(
//       prettifyXml(
//         `<view>
//         <block wx:for="{{state.array}}" wx:for-item="item">
//           <view>
//             <block wx:for="{{item.list}}" wx:for-item="item2">
//               <block wx:if="{{state.b1}}">
//                 <view>
//                   <block wx:if="{{state.b2}}">
//                     <view />
//                   </block>
//                   <view>
//                     <text />
//                     <block wx:if="{{state.b4}}">
//                       <button />
//                     </block>
//                   </view>
//                   <block wx:if="{{state.b3}}">
//                     <progress />
//                   </block>
//                 </view>
//               </block>
//             </block>
//           </view>
//         </block>
//       </view>`
//       )
//     );
//   });

  test('支持条件表达式', () => {
    transform(
      `return (
        <div>
        {this.state.array.map(function(item) {
          return (
            <div>
              {item.list.map(function(item2) {
                return this.state.b1 ? <span>{item2}</span> : <span>text</span>;
              })}
            </div>
          );
        })}
      </div>
      )`,
      `array: [{ list: [1,2,3] }],
      b1: true`
    );
    let template = q.wxml[q.wxml.length - 1].code;

    expect(template).toMatch(
      prettifyXml(
        `<view>
        <block wx:for="{{state.array}}" wx:for-item="item" wx:for-index="i537" wx:key="*this">
          <view>
            <block wx:for="{{item.list}}" wx:for-item="item2" wx:for-index="i627" wx:key="*this">
              <block>
                <block wx:if="{{state.b1}}">
                  <text>{{item2}}</text>
                </block>
                <block wx:else="true">
                  <text>text</text>
                </block>
              </block>
            </block>
          </view>
        </block>
      </view>`
      )
    );
  });
});

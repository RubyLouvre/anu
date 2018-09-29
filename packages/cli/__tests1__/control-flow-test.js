const { transform, getTemplate } = require('./utils/utils');
let q = require('../packages/translator/queue');
const prettifyXml = require('prettify-xml');

describe('if statement', () => {
    test('简单情况', () => {
        transform(
            ` 
      if (this.state.tasks !== null) {
        return <view className='page-body'>tasks</view>
      }
      return (
          <div className="page-body"><span>Hello world!</span></div>
       )
     `,
            'task: []'
        );

        let template = getTemplate(q);
        expect(template).toMatch(
            prettifyXml(
                `<block>
            <block wx:if="{{state.tasks !== null}}">
                <view class="page-body">tasks</view>
            </block>
            <block wx:else="true">
                <view class="page-body">
                     <text>Hello world!</text>
                </view>
            </block>
        </block>`
            )
        );
    });

    test(' if-else', () => {
        transform(
            `
          if (this.state.tasks !== null) {
            return <view className='page-body'>tasks</view>
          } else if(this.state.task.length === 0) {
            return <view className='page-body'>
              <Text>{tasks.length}</Text>
            </view>
          } else {
            return (
                <div className="page-body"><span>Hello world!</span></div>
             )
          }
         `,
            'task: []'
        );

        let template = getTemplate(q);

        expect(template).toMatch(
            prettifyXml(
                `<block>
            <block wx:if="{{state.tasks !== null}}">
                <view class="page-body">tasks</view>
            </block>
            <block wx:else="true">
                <block>
                    <block wx:if="{{state.task.length === 0}}">
                        <view class="page-body">
                            <view>{{tasks.length}}</view>
                         </view>
                    </block>
                    <block wx:else="true">
                        <view class="page-body">
                            <text>Hello world!</text>
                         </view>
                     </block>
                </block>
            </block>
        </block>`
            )
        );
    });
});

const { transform, getTemplate } = require('./utils/utils');
let q = require('../packages/translator/queue');
const prettifyXml = require('prettify-xml');

describe('if statement', () => {
    test('简单情况', () => {
        transform(
            ` 
      if (this.state.tasks !== null) {
        return <View className='page-body'>tasks</View>
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
            return <View className='page-body'>tasks</View>
          } else if(this.state.task.length === 0) {
            return <View className='page-body'>
              <Text>{tasks.length}</Text>
            </View>
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

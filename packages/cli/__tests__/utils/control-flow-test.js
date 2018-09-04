const { transform } = require('./utils/utils');
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
     `, `task: []`
    );
  });

  test('两个平级的 ifStatement', () => {
    transform(
        ` 
        if (this.state.tasks !== null) {
          return <View className='page-body'>tasks</View>
        }

        if(this.state.task.length === 0) {
          return <View className='page-body'>
            <Text>{tasks.length}</Text>
          </View>
        }
        return (
            <div className="page-body"><span>Hello world!</span></div>
         )
       `, `task: []`
      );
  })
});

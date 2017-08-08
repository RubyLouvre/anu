import { beforeHook, afterHook, browser } from 'karma-event-driver-ext/cjs/event-driver-hooks';
import React from 'dist/React'

describe('临时测试模块', function () {
  this.timeout(200000);
  before(async () => {
    await beforeHook();
  });
  after(async () => {
    await afterHook(false);
  });

  var body = document.body, div
  beforeEach(function () {
    div = document.createElement('div')
    body.appendChild(div)
  })
  afterEach(function () {
    body.removeChild(div)

  })

  it('should update state when called from child cWRP', async function () {
    const log = [];
    class Parent extends React.Component {
      constructor() {
        super(),
          this.state = {
            value: 'one'
          }
      }
      render() {
        log.push('parent render ' + this.state.value);
        return <Child parent={this} value={this.state.value} />;
      }
    }
    let updated = false;
    class Child extends React.Component {
      componentWillReceiveProps() {
        if (updated) {
          return;
        }
        log.push('child componentWillReceiveProps ' + this.props.value);
        this.props.parent.setState({ value: 'two' });
        log.push('child componentWillReceiveProps done ' + this.props.value);
        updated = true;
      }
      render() {
        log.push('child render ' + this.props.value);
        return <div>{this.props.value}</div>;
      }
    }
    var container = document.createElement('div');
    React.render(<Parent />, container);
    //setTimeout(function(){

    React.render(<Parent />, container);

    console.log(log)
    expect(log).toEqual([
      'parent render one',
      'child render one',
      'parent render one',
      'child componentWillReceiveProps one',
      'child componentWillReceiveProps done one',
      'child render one',
      'parent render two',
      'child render two',
    ]);

  });    

})
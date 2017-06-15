'use strict';

import {beforeHook, afterHook, browser} from 'karma-event-driver-ext/cjs/event-driver-hooks';
import React from 'dist/React';
import sinon from 'sinon';
var PropTypes;

var clone = function(o) {
  return JSON.parse(JSON.stringify(o));
};

var GET_INIT_STATE_RETURN_VAL = {
  hasWillMountCompleted: false,
  hasRenderCompleted: false,
  hasDidMountCompleted: false,
  hasWillUnmountCompleted: false,
};

var INIT_RENDER_STATE = {
  hasWillMountCompleted: true,
  hasRenderCompleted: false,
  hasDidMountCompleted: false,
  hasWillUnmountCompleted: false,
};

var DID_MOUNT_STATE = {
  hasWillMountCompleted: true,
  hasRenderCompleted: true,
  hasDidMountCompleted: false,
  hasWillUnmountCompleted: false,
};

var NEXT_RENDER_STATE = {
  hasWillMountCompleted: true,
  hasRenderCompleted: true,
  hasDidMountCompleted: true,
  hasWillUnmountCompleted: false,
};

var WILL_UNMOUNT_STATE = {
  hasWillMountCompleted: true,
  hasDidMountCompleted: true,
  hasRenderCompleted: true,
  hasWillUnmountCompleted: false,
};

var POST_WILL_UNMOUNT_STATE = {
  hasWillMountCompleted: true,
  hasDidMountCompleted: true,
  hasRenderCompleted: true,
  hasWillUnmountCompleted: true,
};

function getLifeCycleState(instance){
  return instance.updater.isMounted(instance) ? 'MOUNTED' : 'UNMOUNTED';
}

/**
 * TODO: We should make any setState calls fail in
 * `getInitialState` and `componentWillMount`. They will usually fail
 * anyways because `this._renderedComponent` is empty, however, if a component
 * is *reused*, then that won't be the case and things will appear to work in
 * some cases. Better to just block all updates in initialization.
 */
describe('ReactComponentLifeCycle', () => {
    let scratch;
  beforeEach(() => {
      scratch = document.createElement('div');
      document.body.appendChild(scratch);
    //jest.resetModules();
    //PropTypes = require('prop-types');
  });
  afterEach(() =>{
		scratch.parentNode.removeChild(scratch);
		scratch = null;
    });

  /**
   * If a state update triggers rerendering that in turn fires an onDOMReady,
   * that second onDOMReady should not fail.
   */
  it('it should fire onDOMReady when already in onDOMReady', () => {
    var _testJournal = [];

    class Child extends React.Component {
      componentDidMount() {
        _testJournal.push('Child:onDOMReady');
      }

      render() {
        return <div />;
      }
    }

    class SwitcherParent extends React.Component {
      constructor(props) {
        super(props);
        _testJournal.push('SwitcherParent:getInitialState');
        this.state = {showHasOnDOMReadyComponent: false};
      }

      componentDidMount() {
        _testJournal.push('SwitcherParent:onDOMReady');
        this.switchIt();
      }

      switchIt(){
        this.setState({showHasOnDOMReadyComponent: true});
      };

      render() {
        return (
          <div>
            {this.state.showHasOnDOMReadyComponent ? <Child /> : <div />}
          </div>
        );
      }
    }

    React.render(<SwitcherParent />,scratch);
    expect(_testJournal).toEqual([
      'SwitcherParent:getInitialState',
      'SwitcherParent:onDOMReady',
      'Child:onDOMReady',
    ]);
  });

  // You could assign state here, but not access members of it, unless you
  // had provided a getInitialState method.
  it('throws when accessing state in componentWillMount', () => {
    class StatefulComponent extends React.Component {
        constructor(){
            super(),
            this.state={
                yada:1
            }
        }
      componentWillMount() {
         console.log(this.state.yada);
      }

      render() {
        return <div />;
      }
    }
    var instance = <StatefulComponent />;
    expect(function() {
      instance = React.render(<instance />,scratch);
    }).toThrow();
  });

  it('should allow update state inside of componentWillMount', () => {
    class StatefulComponent extends React.Component {
      componentWillMount() {
        this.setState({stateField: 'something'});
      }

      render() {
        return <div />;
      }
    }

    var instance = <StatefulComponent />;
    expect(function() {
      instance = React.render(<instance />,scratch);
    }).not.toThrow();
  });

  it('should not allow update state inside of getInitialState', () => {
    class StatefulComponent extends React.Component {
      constructor(props, context) {
        super(props, context);
        this.setState({stateField: 'something'});

        this.state = {stateField: 'somethingelse'};
      }

      render() {
        return <div />;
      }
    }
    expect(function() {
      instance = React.render(<StatefulComponent />,scratch);
    }).toThrow();
    //React.render(<StatefulComponent />,scratch);
    //ReactTestUtils.renderIntoDocument(<StatefulComponent />);
    //expect(console.error).to.have.been.calledOnce;
    // expectDev(console.error.calls.argsFor(0)[0]).toBe(
    //   'Warning: setState(...): Can only update a mounted or ' +
    //     'mounting component. This usually means you called setState() on an ' +
    //     'unmounted component. This is a no-op.\n\nPlease check the code for the ' +
    //     'StatefulComponent component.',
    // );
  });

  it('warns if findDOMNode is used inside render', () => {
    sinon.spy(console, 'error');
    class Component extends React.Component {
        constructor(){
            super(),
            this.state={
                isMounted: false
            }
        }
      componentDidMount() {
        this.setState({isMounted: true});
      }
      render() {
        if (this.state.isMounted) {
          expect(React.findDOMNode(this).tagName).toBe('DIV');
        }
        return <div />;
      }
    }
    expect(function() {
      instance = React.render(<Component />,scratch);
    }).toThrow();
  });

  it('should not throw when updating an auxiliary component', () => {
    class Tooltip extends React.Component {
      render() {
        return <div>{this.props.children}</div>;
      }

      componentDidMount() {
        this.container = document.createElement('div');
        this.updateTooltip();
      }

      componentDidUpdate() {
        this.updateTooltip();
      }

      updateTooltip() {
        // Even though this.props.tooltip has an owner, updating it shouldn't
        // throw here because it's mounted as a root component
        ReactDOM.render(this.props.tooltip, this.container);
      };
    }

    class Component extends React.Component {
      render() {
        return (
          <Tooltip ref="tooltip" tooltip={<div>{this.props.tooltipText}</div>}>
            {this.props.text}
          </Tooltip>
        );
      }
    }

    var container = document.createElement('div');
    ReactDOM.render(<Component text="uno" tooltipText="one" />, container);

    // Since `instance` is a root component, we can set its props. This also
    // makes Tooltip rerender the tooltip component, which shouldn't throw.
    ReactDOM.render(<Component text="dos" tooltipText="two" />, container);
  });

  it('should allow state updates in componentDidMount', () => {
    /**
     * calls setState in an componentDidMount.
     */
    class SetStateInComponentDidMount extends React.Component {
        constructor(props){
            super(props),
            this.state={
                stateField: this.props.valueToUseInitially
            }
        }
      componentDidMount() {
        this.setState({stateField: this.props.valueToUseInOnDOMReady});
      }

      render() {
        return <div />;
      }
    }

    var instance = (
      <SetStateInComponentDidMount
        valueToUseInitially="hello"
        valueToUseInOnDOMReady="goodbye"
      />
    );
    instance = React.render(instance,scratch);
    expect(instance.state.stateField).toBe('goodbye');
  });

  it('should call nested lifecycle methods in the right order', () => {
    var log;
    // var logger = (msg)=> {
    //   return ()=> {
    //     // return true for shouldComponentUpdate
    //     log.push(msg);
    //     return true;
    //   };
    // };
    var logger = (msg)=>{
      log.push(msg);
      return true;
    }
    class Outer extends React.Component {
      componentWillMount (){ logger('outer componentWillMount')};
      componentDidMount () {logger('outer componentDidMount')};
      componentWillReceiveProps () {logger('outer componentWillReceiveProps')};
      shouldComponentUpdate () {logger('outer shouldComponentUpdate')};
      componentWillUpdate () {logger('outer componentWillUpdate')};
      componentDidUpdate () {logger('outer componentDidUpdate')};
      componentWillUnmount () {logger('outer componentWillUnmount')};
      render() {
        return <div><Inner x={this.props.x} /></div>;
      }
    }

    class Inner extends React.Component {
      componentWillMount () {logger('inner componentWillMount')};
      componentDidMount () {logger('inner componentDidMount')};
      componentWillReceiveProps () {logger('inner componentWillReceiveProps')};
      shouldComponentUpdate () {logger('inner shouldComponentUpdate')};
      componentWillUpdate () {logger('inner componentWillUpdate')};
      componentDidUpdate () {logger('inner componentDidUpdate')};
      componentWillUnmount () {logger('inner componentWillUnmount')};
      render() {
        return <span>{this.props.x}</span>;
      }
    }

    var container = document.createElement('div');
    log = [];
    React.render(<Outer x={17} />, container);
    console.log(log)
    expect(log).toEqual([
      'outer componentWillMount',
      'inner componentWillMount',
      'inner componentDidMount',
      'outer componentDidMount',
    ]);

    log = [];
    ReactDOM.render(<Outer x={42} />, container);
    expect(log).toEqual([
      'outer componentWillReceiveProps',
      'outer shouldComponentUpdate',
      'outer componentWillUpdate',
      'inner componentWillReceiveProps',
      'inner shouldComponentUpdate',
      'inner componentWillUpdate',
      'inner componentDidUpdate',
      'outer componentDidUpdate',
    ]);
  });
});
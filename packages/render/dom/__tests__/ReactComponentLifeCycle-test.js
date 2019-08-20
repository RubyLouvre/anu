'use strict';

let React;
let ReactDOM;
let ReactTestUtils;
let PropTypes;

const clone = function(o) {
  return JSON.parse(JSON.stringify(o));
};

const GET_INIT_STATE_RETURN_VAL = {
  hasWillMountCompleted: false,
  hasRenderCompleted: false,
  hasDidMountCompleted: false,
  hasWillUnmountCompleted: false,
};

const INIT_RENDER_STATE = {
  hasWillMountCompleted: true,
  hasRenderCompleted: false,
  hasDidMountCompleted: false,
  hasWillUnmountCompleted: false,
};

const DID_MOUNT_STATE = {
  hasWillMountCompleted: true,
  hasRenderCompleted: true,
  hasDidMountCompleted: false,
  hasWillUnmountCompleted: false,
};

const NEXT_RENDER_STATE = {
  hasWillMountCompleted: true,
  hasRenderCompleted: true,
  hasDidMountCompleted: true,
  hasWillUnmountCompleted: false,
};

const WILL_UNMOUNT_STATE = {
  hasWillMountCompleted: true,
  hasDidMountCompleted: true,
  hasRenderCompleted: true,
  hasWillUnmountCompleted: false,
};

const POST_WILL_UNMOUNT_STATE = {
  hasWillMountCompleted: true,
  hasDidMountCompleted: true,
  hasRenderCompleted: true,
  hasWillUnmountCompleted: true,
};


function getLifeCycleState(instance) {
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
  beforeEach(() => {
    jest.resetModules();
    React = require('react');
    ReactDOM = require('react-dom');
    ReactTestUtils = require('test-utils');
    PropTypes = require('prop-types');
  });

  it('should not reuse an instance when it has been unmounted', () => {
    const container = document.createElement('div');

    class StatefulComponent extends React.Component {
      state = {};

      render() {
        return <div />;
      }
    }

    const element = <StatefulComponent />;
    const firstInstance = ReactDOM.render(element, container);
    ReactDOM.unmountComponentAtNode(container);
    const secondInstance = ReactDOM.render(element, container);
    expect(firstInstance).not.toBe(secondInstance);
  });

  /**
   * If a state update triggers rerendering that in turn fires an onDOMReady,
   * that second onDOMReady should not fail.
   */
  it('it should fire onDOMReady when already in onDOMReady', () => {
    const _testJournal = [];

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

      switchIt = () => {
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

    ReactTestUtils.renderIntoDocument(<SwitcherParent />);
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
      UNSAFE_componentWillMount() {
        void this.state.yada;
      }

      render() {
        return <div />;
      }
    }

    let instance = <StatefulComponent />;
    expect(function() {
      instance = ReactTestUtils.renderIntoDocument(instance);
    }).toThrow();
  });

  it('should allow update state inside of componentWillMount', () => {
    class StatefulComponent extends React.Component {
      UNSAFE_componentWillMount() {
        this.setState({stateField: 'something'});
      }

      render() {
        return <div />;
      }
    }

    let instance = <StatefulComponent />;
    expect(function() {
      instance = ReactTestUtils.renderIntoDocument(instance);
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

    expect(() => {
      ReactTestUtils.renderIntoDocument(<StatefulComponent />);
    }).toWarnDev(
      "Warning: Can't call setState on a component that is not yet mounted. " +
        'This is a no-op, but it might indicate a bug in your application. ' +
        'Instead, assign to `this.state` directly or define a `state = {};` ' +
        'class property with the desired state in the StatefulComponent component.',
    );

    // Check deduplication; (no extra warnings should be logged).
    ReactTestUtils.renderIntoDocument(<StatefulComponent />);
  });

  it('should correctly determine if a component is mounted', () => {
    class Component extends React.Component {
      _isMounted() {
        // No longer a public API, but we can test that it works internally by
        // reaching into the updater.
        return this.updater.isMounted(this);
      }
      UNSAFE_componentWillMount() {
        expect(this._isMounted()).toBeFalsy();
      }
      componentDidMount() {
        expect(this._isMounted()).toBeTruthy();
      }
      render() {
        expect(this._isMounted()).toBeFalsy();
        return <div />;
      }
    }

    const element = <Component />;

    expect(() => {
      const instance = ReactTestUtils.renderIntoDocument(element);
      expect(instance._isMounted()).toBeTruthy();
    }).toWarnDev('Component is accessing isMounted inside its render()');
  });

  it('should correctly determine if a null component is mounted', () => {
    class Component extends React.Component {
      _isMounted() {
        // No longer a public API, but we can test that it works internally by
        // reaching into the updater.
        return this.updater.isMounted(this);
      }
      UNSAFE_componentWillMount() {
        expect(this._isMounted()).toBeFalsy();
      }
      componentDidMount() {
        expect(this._isMounted()).toBeTruthy();
      }
      render() {
        expect(this._isMounted()).toBeFalsy();
        return null;
      }
    }

    const element = <Component />;

    expect(() => {
      const instance = ReactTestUtils.renderIntoDocument(element);
      expect(instance._isMounted()).toBeTruthy();
    }).toWarnDev('Component is accessing isMounted inside its render()');
  });

  it('isMounted should return false when unmounted', () => {
    class Component extends React.Component {
      render() {
        return <div />;
      }
    }

    const container = document.createElement('div');
    const instance = ReactDOM.render(<Component />, container);

    // No longer a public API, but we can test that it works internally by
    // reaching into the updater.
    expect(instance.updater.isMounted(instance)).toBe(true);

    ReactDOM.unmountComponentAtNode(container);

    expect(instance.updater.isMounted(instance)).toBe(false);
  });

  it('warns if findDOMNode is used inside render', () => {
    class Component extends React.Component {
      state = {isMounted: false};
      componentDidMount() {
        this.setState({isMounted: true});
      }
      render() {
        if (this.state.isMounted) {
          expect(ReactDOM.findDOMNode(this).tagName).toBe('DIV');
        }
        return <div />;
      }
    }

    expect(() => {
      ReactTestUtils.renderIntoDocument(<Component />);
    }).toWarnDev('Component is accessing findDOMNode inside its render()');
  });

  it('should carry through each of the phases of setup', () => {
    class LifeCycleComponent extends React.Component {
      constructor(props, context) {
        super(props, context);
        this._testJournal = {};
        const initState = {
          hasWillMountCompleted: false,
          hasDidMountCompleted: false,
          hasRenderCompleted: false,
          hasWillUnmountCompleted: false,
        };
        this._testJournal.returnedFromGetInitialState = clone(initState);
        this._testJournal.lifeCycleAtStartOfGetInitialState = getLifeCycleState(
          this,
        );
        this.state = initState;
      }

      UNSAFE_componentWillMount() {
        this._testJournal.stateAtStartOfWillMount = clone(this.state);
        this._testJournal.lifeCycleAtStartOfWillMount = getLifeCycleState(this);
        this.state.hasWillMountCompleted = true;
      }

      componentDidMount() {
        this._testJournal.stateAtStartOfDidMount = clone(this.state);
        this._testJournal.lifeCycleAtStartOfDidMount = getLifeCycleState(this);
        this.setState({hasDidMountCompleted: true});
      }

      render() {
        const isInitialRender = !this.state.hasRenderCompleted;
        if (isInitialRender) {
          this._testJournal.stateInInitialRender = clone(this.state);
          this._testJournal.lifeCycleInInitialRender = getLifeCycleState(this);
        } else {
          this._testJournal.stateInLaterRender = clone(this.state);
          this._testJournal.lifeCycleInLaterRender = getLifeCycleState(this);
        }
        // you would *NEVER* do anything like this in real code!
        this.state.hasRenderCompleted = true;
        return <div ref="theDiv">I am the inner DIV</div>;
      }

      componentWillUnmount() {
        this._testJournal.stateAtStartOfWillUnmount = clone(this.state);
        this._testJournal.lifeCycleAtStartOfWillUnmount = getLifeCycleState(
          this,
        );
        this.state.hasWillUnmountCompleted = true;
      }
    }

    // A component that is merely "constructed" (as in "constructor") but not
    // yet initialized, or rendered.
    //
    const container = document.createElement('div');

    let instance;
    expect(() => {
      instance = ReactDOM.render(<LifeCycleComponent />, container);
    }).toWarnDev(
      'LifeCycleComponent is accessing isMounted inside its render() function',
    );

    // getInitialState
    expect(instance._testJournal.returnedFromGetInitialState).toEqual(
      GET_INIT_STATE_RETURN_VAL,
    );
    expect(instance._testJournal.lifeCycleAtStartOfGetInitialState).toBe(
      'UNMOUNTED',
    );

    // componentWillMount
    expect(instance._testJournal.stateAtStartOfWillMount).toEqual(
      instance._testJournal.returnedFromGetInitialState,
    );
    expect(instance._testJournal.lifeCycleAtStartOfWillMount).toBe('UNMOUNTED');

    // componentDidMount
    expect(instance._testJournal.stateAtStartOfDidMount).toEqual(
      DID_MOUNT_STATE,
    );
    expect(instance._testJournal.lifeCycleAtStartOfDidMount).toBe('MOUNTED');

    // initial render
    expect(instance._testJournal.stateInInitialRender).toEqual(
      INIT_RENDER_STATE,
    );
    expect(instance._testJournal.lifeCycleInInitialRender).toBe('UNMOUNTED');

    expect(getLifeCycleState(instance)).toBe('MOUNTED');

    // Now *update the component*
    instance.forceUpdate();

    // render 2nd time
    expect(instance._testJournal.stateInLaterRender).toEqual(NEXT_RENDER_STATE);
    expect(instance._testJournal.lifeCycleInLaterRender).toBe('MOUNTED');

    expect(getLifeCycleState(instance)).toBe('MOUNTED');

    ReactDOM.unmountComponentAtNode(container);

    expect(instance._testJournal.stateAtStartOfWillUnmount).toEqual(
      WILL_UNMOUNT_STATE,
    );
    // componentWillUnmount called right before unmount.
    expect(instance._testJournal.lifeCycleAtStartOfWillUnmount).toBe('MOUNTED');

    // But the current lifecycle of the component is unmounted.
    expect(getLifeCycleState(instance)).toBe('UNMOUNTED');
    expect(instance.state).toEqual(POST_WILL_UNMOUNT_STATE);
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

      updateTooltip = () => {
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

    const container = document.createElement('div');
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
      state = {
        stateField: this.props.valueToUseInitially,
      };

      componentDidMount() {
        this.setState({stateField: this.props.valueToUseInOnDOMReady});
      }

      render() {
        return <div />;
      }
    }

    let instance = (
      <SetStateInComponentDidMount
        valueToUseInitially="hello"
        valueToUseInOnDOMReady="goodbye"
      />
    );
    instance = ReactTestUtils.renderIntoDocument(instance);
    expect(instance.state.stateField).toBe('goodbye');
  });

  it('should call nested legacy lifecycle methods in the right order', () => {
    let log;
    const logger = function(msg) {
      return function() {
        // return true for shouldComponentUpdate
        log.push(msg);
        return true;
      };
    };
    class Outer extends React.Component {
      UNSAFE_componentWillMount = logger('outer componentWillMount');
      componentDidMount = logger('outer componentDidMount');
      UNSAFE_componentWillReceiveProps = logger(
        'outer componentWillReceiveProps',
      );
      shouldComponentUpdate = logger('outer shouldComponentUpdate');
      UNSAFE_componentWillUpdate = logger('outer componentWillUpdate');
      componentDidUpdate = logger('outer componentDidUpdate');
      componentWillUnmount = logger('outer componentWillUnmount');
      render() {
        return (
          <div>
            <Inner x={this.props.x} />
          </div>
        );
      }
    }

    class Inner extends React.Component {
      UNSAFE_componentWillMount = logger('inner componentWillMount');
      componentDidMount = logger('inner componentDidMount');
      UNSAFE_componentWillReceiveProps = logger(
        'inner componentWillReceiveProps',
      );
      shouldComponentUpdate = logger('inner shouldComponentUpdate');
      UNSAFE_componentWillUpdate = logger('inner componentWillUpdate');
      componentDidUpdate = logger('inner componentDidUpdate');
      componentWillUnmount = logger('inner componentWillUnmount');
      render() {
        return <span>{this.props.x}</span>;
      }
    }

    const container = document.createElement('div');
    log = [];
    ReactDOM.render(<Outer x={1} />, container);
    expect(log).toEqual([
      'outer componentWillMount',
      'inner componentWillMount',
      'inner componentDidMount',
      'outer componentDidMount',
    ]);

    // Dedup warnings
    log = [];
    ReactDOM.render(<Outer x={2} />, container);
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

    log = [];
    ReactDOM.unmountComponentAtNode(container);
    expect(log).toEqual([
      'outer componentWillUnmount',
      'inner componentWillUnmount',
    ]);
  });

  it('should call nested new lifecycle methods in the right order', () => {
    let log;
    const logger = function(msg) {
      return function() {
        // return true for shouldComponentUpdate
        log.push(msg);
        return true;
      };
    };
    class Outer extends React.Component {
      state = {};
      static getDerivedStateFromProps(props, prevState) {
        logger('outer getDerivedStateFromProps')();
        return null;
      }
      componentDidMount = logger('outer componentDidMount');
      shouldComponentUpdate = logger('outer shouldComponentUpdate');
      getSnapshotBeforeUpdate = logger('outer getSnapshotBeforeUpdate');
      componentDidUpdate = logger('outer componentDidUpdate');
      componentWillUnmount = logger('outer componentWillUnmount');
      render() {
        return (
          <div>
            <Inner x={this.props.x} />
          </div>
        );
      }
    }

    class Inner extends React.Component {
      state = {};
      static getDerivedStateFromProps(props, prevState) {
        logger('inner getDerivedStateFromProps')();
        return null;
      }
      componentDidMount = logger('inner componentDidMount');
      shouldComponentUpdate = logger('inner shouldComponentUpdate');
      getSnapshotBeforeUpdate = logger('inner getSnapshotBeforeUpdate');
      componentDidUpdate = logger('inner componentDidUpdate');
      componentWillUnmount = logger('inner componentWillUnmount');
      render() {
        return <span>{this.props.x}</span>;
      }
    }

    const container = document.createElement('div');
    log = [];
    ReactDOM.render(<Outer x={1} />, container);
    expect(log).toEqual([
      'outer getDerivedStateFromProps',
      'inner getDerivedStateFromProps',
      'inner componentDidMount',
      'outer componentDidMount',
    ]);

    // Dedup warnings
    log = [];
    ReactDOM.render(<Outer x={2} />, container);
    expect(log).toEqual([
      'outer getDerivedStateFromProps',
      'outer shouldComponentUpdate',
      'inner getDerivedStateFromProps',
      'inner shouldComponentUpdate',
      'inner getSnapshotBeforeUpdate',
      'outer getSnapshotBeforeUpdate',
      'inner componentDidUpdate',
      'outer componentDidUpdate',
    ]);

    log = [];
    ReactDOM.unmountComponentAtNode(container);
    expect(log).toEqual([
      'outer componentWillUnmount',
      'inner componentWillUnmount',
    ]);
  });

  it('should not invoke deprecated lifecycles (cWM/cWRP/cWU) if new static gDSFP is present', () => {
    class Component extends React.Component {
      state = {};
      static getDerivedStateFromProps() {
        return null;
      }
      componentWillMount() {
        throw Error('unexpected');
      }
      componentWillReceiveProps() {
        throw Error('unexpected');
      }
      componentWillUpdate() {
        throw Error('unexpected');
      }
      render() {
        return null;
      }
    }

    const container = document.createElement('div');
    expect(() => ReactDOM.render(<Component />, container)).toWarnDev(
      'Unsafe legacy lifecycles will not be called for components using new component APIs.',
    );
  });

  it('should not invoke deprecated lifecycles (cWM/cWRP/cWU) if new getSnapshotBeforeUpdate is present', () => {
    class Component extends React.Component {
      state = {};
      getSnapshotBeforeUpdate() {
        return null;
      }
      componentWillMount() {
        throw Error('unexpected');
      }
      componentWillReceiveProps() {
        throw Error('unexpected');
      }
      componentWillUpdate() {
        throw Error('unexpected');
      }
      componentDidUpdate() {}
      render() {
        return null;
      }
    }

    const container = document.createElement('div');
    expect(() => ReactDOM.render(<Component value={1} />, container)).toWarnDev(
      'Unsafe legacy lifecycles will not be called for components using new component APIs.',
    );
    ReactDOM.render(<Component value={2} />, container);
  });

  it('should not invoke new unsafe lifecycles (cWM/cWRP/cWU) if static gDSFP is present', () => {
    class Component extends React.Component {
      state = {};
      static getDerivedStateFromProps() {
        return null;
      }
      UNSAFE_componentWillMount() {
        throw Error('unexpected');
      }
      UNSAFE_componentWillReceiveProps() {
        throw Error('unexpected');
      }
      UNSAFE_componentWillUpdate() {
        throw Error('unexpected');
      }
      render() {
        return null;
      }
    }

    const container = document.createElement('div');
    expect(() => ReactDOM.render(<Component value={1} />, container)).toWarnDev(
      'Unsafe legacy lifecycles will not be called for components using new component APIs.',
    );
    ReactDOM.render(<Component value={2} />, container);
  });

  it('should warn about deprecated lifecycles (cWM/cWRP/cWU) if new static gDSFP is present', () => {
    const container = document.createElement('div');

    class AllLegacyLifecycles extends React.Component {
      state = {};
      static getDerivedStateFromProps() {
        return null;
      }
      componentWillMount() {}
      UNSAFE_componentWillReceiveProps() {}
      componentWillUpdate() {}
      render() {
        return null;
      }
    }

    expect(() => ReactDOM.render(<AllLegacyLifecycles />, container)).toWarnDev(
      'Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n' +
        'AllLegacyLifecycles uses getDerivedStateFromProps() but also contains the following legacy lifecycles:\n' +
        '  componentWillMount\n' +
        '  UNSAFE_componentWillReceiveProps\n' +
        '  componentWillUpdate\n\n' +
        'The above lifecycles should be removed. Learn more about this warning here:\n' +
        'https://fb.me/react-async-component-lifecycle-hooks',
    );

    class WillMount extends React.Component {
      state = {};
      static getDerivedStateFromProps() {
        return null;
      }
      UNSAFE_componentWillMount() {}
      render() {
        return null;
      }
    }

    expect(() => ReactDOM.render(<WillMount />, container)).toWarnDev(
      'Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n' +
        'WillMount uses getDerivedStateFromProps() but also contains the following legacy lifecycles:\n' +
        '  UNSAFE_componentWillMount\n\n' +
        'The above lifecycles should be removed. Learn more about this warning here:\n' +
        'https://fb.me/react-async-component-lifecycle-hooks',
    );

    class WillMountAndUpdate extends React.Component {
      state = {};
      static getDerivedStateFromProps() {
        return null;
      }
      componentWillMount() {}
      UNSAFE_componentWillUpdate() {}
      render() {
        return null;
      }
    }

    expect(() => ReactDOM.render(<WillMountAndUpdate />, container)).toWarnDev(
      'Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n' +
        'WillMountAndUpdate uses getDerivedStateFromProps() but also contains the following legacy lifecycles:\n' +
        '  componentWillMount\n' +
        '  UNSAFE_componentWillUpdate\n\n' +
        'The above lifecycles should be removed. Learn more about this warning here:\n' +
        'https://fb.me/react-async-component-lifecycle-hooks',
    );

    class WillReceiveProps extends React.Component {
      state = {};
      static getDerivedStateFromProps() {
        return null;
      }
      componentWillReceiveProps() {}
      render() {
        return null;
      }
    }

    expect(() => ReactDOM.render(<WillReceiveProps />, container)).toWarnDev(
      'Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n' +
        'WillReceiveProps uses getDerivedStateFromProps() but also contains the following legacy lifecycles:\n' +
        '  componentWillReceiveProps\n\n' +
        'The above lifecycles should be removed. Learn more about this warning here:\n' +
        'https://fb.me/react-async-component-lifecycle-hooks',
    );
  });

  it('should warn about deprecated lifecycles (cWM/cWRP/cWU) if new getSnapshotBeforeUpdate is present', () => {
    const container = document.createElement('div');

    class AllLegacyLifecycles extends React.Component {
      state = {};
      getSnapshotBeforeUpdate() {}
      componentWillMount() {}
      UNSAFE_componentWillReceiveProps() {}
      componentWillUpdate() {}
      componentDidUpdate() {}
      render() {
        return null;
      }
    }

    expect(() => ReactDOM.render(<AllLegacyLifecycles />, container)).toWarnDev(
      'Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n' +
        'AllLegacyLifecycles uses getSnapshotBeforeUpdate() but also contains the following legacy lifecycles:\n' +
        '  componentWillMount\n' +
        '  UNSAFE_componentWillReceiveProps\n' +
        '  componentWillUpdate\n\n' +
        'The above lifecycles should be removed. Learn more about this warning here:\n' +
        'https://fb.me/react-async-component-lifecycle-hooks',
    );

    class WillMount extends React.Component {
      state = {};
      getSnapshotBeforeUpdate() {}
      UNSAFE_componentWillMount() {}
      componentDidUpdate() {}
      render() {
        return null;
      }
    }

    expect(() => ReactDOM.render(<WillMount />, container)).toWarnDev(
      'Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n' +
        'WillMount uses getSnapshotBeforeUpdate() but also contains the following legacy lifecycles:\n' +
        '  UNSAFE_componentWillMount\n\n' +
        'The above lifecycles should be removed. Learn more about this warning here:\n' +
        'https://fb.me/react-async-component-lifecycle-hooks',
    );

    class WillMountAndUpdate extends React.Component {
      state = {};
      getSnapshotBeforeUpdate() {}
      componentWillMount() {}
      UNSAFE_componentWillUpdate() {}
      componentDidUpdate() {}
      render() {
        return null;
      }
    }

    expect(() => ReactDOM.render(<WillMountAndUpdate />, container)).toWarnDev(
      'Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n' +
        'WillMountAndUpdate uses getSnapshotBeforeUpdate() but also contains the following legacy lifecycles:\n' +
        '  componentWillMount\n' +
        '  UNSAFE_componentWillUpdate\n\n' +
        'The above lifecycles should be removed. Learn more about this warning here:\n' +
        'https://fb.me/react-async-component-lifecycle-hooks',
    );

    class WillReceiveProps extends React.Component {
      state = {};
      getSnapshotBeforeUpdate() {}
      componentWillReceiveProps() {}
      componentDidUpdate() {}
      render() {
        return null;
      }
    }

    expect(() => ReactDOM.render(<WillReceiveProps />, container)).toWarnDev(
      'Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n' +
        'WillReceiveProps uses getSnapshotBeforeUpdate() but also contains the following legacy lifecycles:\n' +
        '  componentWillReceiveProps\n\n' +
        'The above lifecycles should be removed. Learn more about this warning here:\n' +
        'https://fb.me/react-async-component-lifecycle-hooks',
    );
  });

  it('calls effects on module-pattern component', function() {
   
  });

  it('should warn if getDerivedStateFromProps returns undefined', () => {
    class MyComponent extends React.Component {
      state = {};
      static getDerivedStateFromProps() {}
      render() {
        return null;
      }
    }

    const div = document.createElement('div');
    expect(() => ReactDOM.render(<MyComponent />, div)).toWarnDev(
      'MyComponent.getDerivedStateFromProps(): A valid state object (or null) must ' +
        'be returned. You have returned undefined.',
    );

    // De-duped
    ReactDOM.render(<MyComponent />, div);
  });

  it('should warn if state is not initialized before getDerivedStateFromProps', () => {
    class MyComponent extends React.Component {
      static getDerivedStateFromProps() {
        return null;
      }
      render() {
        return null;
      }
    }

    const div = document.createElement('div');
    expect(() => ReactDOM.render(<MyComponent />, div)).toWarnDev(
      'MyComponent: Did not properly initialize state during construction. ' +
        'Expected state to be an object, but it was undefined.',
    );

    // De-duped
    ReactDOM.render(<MyComponent />, div);
  });

  it('should invoke both deprecated and new lifecycles if both are present', () => {
    const log = [];

    class MyComponent extends React.Component {
      componentWillMount() {
        log.push('componentWillMount');
      }
      componentWillReceiveProps() {
        log.push('componentWillReceiveProps');
      }
      componentWillUpdate() {
        log.push('componentWillUpdate');
      }
      UNSAFE_componentWillMount() {
        log.push('UNSAFE_componentWillMount');
      }
      UNSAFE_componentWillReceiveProps() {
        log.push('UNSAFE_componentWillReceiveProps');
      }
      UNSAFE_componentWillUpdate() {
        log.push('UNSAFE_componentWillUpdate');
      }
      render() {
        return null;
      }
    }

    const div = document.createElement('div');
    ReactDOM.render(<MyComponent foo="bar" />, div);
    expect(log).toEqual(['componentWillMount', 'UNSAFE_componentWillMount']);

    log.length = 0;

    ReactDOM.render(<MyComponent foo="baz" />, div);
    expect(log).toEqual([
      'componentWillReceiveProps',
      'UNSAFE_componentWillReceiveProps',
      'componentWillUpdate',
      'UNSAFE_componentWillUpdate',
    ]);
  });

  it('should not override state with stale values if prevState is spread within getDerivedStateFromProps', () => {
    const divRef = React.createRef();
    let childInstance;

    class Child extends React.Component {
      state = {local: 0};
      static getDerivedStateFromProps(nextProps, prevState) {
        return {...prevState, remote: nextProps.remote};
      }
      updateState = () => {
        this.setState(state => ({local: state.local + 1}));
        this.props.onChange(this.state.remote + 1);
      };
      render() {
        childInstance = this;
        return (
          <div onClick={this.updateState} ref={divRef}>{`remote:${
            this.state.remote
          }, local:${this.state.local}`}</div>
        );
      }
    }

    class Parent extends React.Component {
      state = {value: 0};
      handleChange = value => {
        this.setState({value});
      };
      render() {
        return <Child remote={this.state.value} onChange={this.handleChange} />;
      }
    }

    ReactTestUtils.renderIntoDocument(<Parent />);
    expect(divRef.current.textContent).toBe('remote:0, local:0');

    // Trigger setState() calls
    childInstance.updateState();
    expect(divRef.current.textContent).toBe('remote:1, local:1');

    // Trigger batched setState() calls
    ReactTestUtils.Simulate.click(divRef.current);
    expect(divRef.current.textContent).toBe('remote:2, local:2');
  });

  it('should pass the return value from getSnapshotBeforeUpdate to componentDidUpdate', () => {
    const log = [];

    class MyComponent extends React.Component {
      state = {
        value: 0,
      };
      static getDerivedStateFromProps(nextProps, prevState) {
        return {
          value: prevState.value + 1,
        };
      }
      getSnapshotBeforeUpdate(prevProps, prevState) {
        log.push(
          `getSnapshotBeforeUpdate() prevProps:${prevProps.value} prevState:${
            prevState.value
          }`,
        );
        return 'abc';
      }
      componentDidUpdate(prevProps, prevState, snapshot) {
        log.push(
          `componentDidUpdate() prevProps:${prevProps.value} prevState:${
            prevState.value
          } snapshot:${snapshot}`,
        );
      }
      render() {
        log.push('render');
        return null;
      }
    }

    const div = document.createElement('div');
    ReactDOM.render(
      <div>
        <MyComponent value="foo" />
      </div>,
      div,
    );
    expect(log).toEqual(['render']);
    log.length = 0;

    ReactDOM.render(
      <div>
        <MyComponent value="bar" />
      </div>,
      div,
    );
    expect(log).toEqual([
      'render',
      'getSnapshotBeforeUpdate() prevProps:foo prevState:1',
      'componentDidUpdate() prevProps:foo prevState:1 snapshot:abc',
    ]);
    log.length = 0;

    ReactDOM.render(
      <div>
        <MyComponent value="baz" />
      </div>,
      div,
    );
    expect(log).toEqual([
      'render',
      'getSnapshotBeforeUpdate() prevProps:bar prevState:2',
      'componentDidUpdate() prevProps:bar prevState:2 snapshot:abc',
    ]);
    log.length = 0;

    ReactDOM.render(<div />, div);
    expect(log).toEqual([]);
  });

  it('should call getSnapshotBeforeUpdate before mutations are committed', () => {
    const log = [];

    class MyComponent extends React.Component {
      divRef = React.createRef();
      getSnapshotBeforeUpdate(prevProps, prevState) {
        log.push('getSnapshotBeforeUpdate');
        expect(this.divRef.current.textContent).toBe(
          `value:${prevProps.value}`,
        );
        return 'foobar';
      }
      componentDidUpdate(prevProps, prevState, snapshot) {
        log.push('componentDidUpdate');
        expect(this.divRef.current.textContent).toBe(
          `value:${this.props.value}`,
        );
        expect(snapshot).toBe('foobar');
      }
      render() {
        log.push('render');
        return <div ref={this.divRef}>{`value:${this.props.value}`}</div>;
      }
    }

    const div = document.createElement('div');
    ReactDOM.render(<MyComponent value="foo" />, div);
    expect(log).toEqual(['render']);
    log.length = 0;

    ReactDOM.render(<MyComponent value="bar" />, div);
    expect(log).toEqual([
      'render',
      'getSnapshotBeforeUpdate',
      'componentDidUpdate',
    ]);
    log.length = 0;
  });

  it('should warn if getSnapshotBeforeUpdate returns undefined', () => {
    class MyComponent extends React.Component {
      getSnapshotBeforeUpdate() {}
      componentDidUpdate() {}
      render() {
        return null;
      }
    }

    const div = document.createElement('div');
    ReactDOM.render(<MyComponent value="foo" />, div);
    expect(() => ReactDOM.render(<MyComponent value="bar" />, div)).toWarnDev(
      'MyComponent.getSnapshotBeforeUpdate(): A snapshot value (or null) must ' +
        'be returned. You have returned undefined.',
    );

    // De-duped
    ReactDOM.render(<MyComponent value="baz" />, div);
  });

  it('should warn if getSnapshotBeforeUpdate is defined with no componentDidUpdate', () => {
    class MyComponent extends React.Component {
      getSnapshotBeforeUpdate() {
        return null;
      }
      render() {
        return null;
      }
    }

    const div = document.createElement('div');
    expect(() => ReactDOM.render(<MyComponent />, div)).toWarnDev(
      'MyComponent: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). ' +
        'This component defines getSnapshotBeforeUpdate() only.',
    );

    // De-duped
    ReactDOM.render(<MyComponent />, div);
  });
});
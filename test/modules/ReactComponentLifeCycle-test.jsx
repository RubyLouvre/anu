

import React from "dist/React";
import getTestDocument from "./getTestDocument";
import ReactTestUtils from "lib/ReactTestUtils";
import createReactClass from "lib/createClass";
import PropTypes from "lib/ReactPropTypes";
import ReactDOM from "dist/React";


describe("ReactComponentLifeCycle-test", function() {
    this.timeout(200000);

    it('should not reuse an instance when it has been unmounted', () => {
    var container = document.createElement('div');

    class StatefulComponent extends React.Component {
      state = {};

      render() {
        return <div />;
      }
    }

    var element = <StatefulComponent />;
    var firstInstance = ReactDOM.render(element, container);
    ReactDOM.unmountComponentAtNode(container);
    var secondInstance = ReactDOM.render(element, container);
    expect(firstInstance).not.toBe(secondInstance);
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
      componentWillMount() {
        void this.state.yada;
      }

      render() {
        return <div />;
      }
    }

    var instance = <StatefulComponent />;
    expect(function() {
      instance = ReactTestUtils.renderIntoDocument(instance);
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
      instance = ReactTestUtils.renderIntoDocument(instance);
    }).not.toThrow();
  });

  it('should not allow update state inside of getInitialState', () => {
  
    class StatefulComponent extends React.Component {
      constructor(props, context) {
        super(props, context);
       
        this.state = {stateField: 'somethingelse'};
        this.setState({stateField: 'something'});

      }

      render() {
        return <div>{this.state.stateField}</div>;
      }
    }
    var container = document.createElement('div');
    ReactDOM.render(<StatefulComponent />, container);
    expect(container.textContent).toBe("somethingelse");

  });

  it('should correctly determine if a component is mounted', () => {
    class Component extends React.Component {
 
      componentWillMount() {
        expect(this.isMounted()).toBeFalsy();
      }
      componentDidMount() {
        expect(this.isMounted()).toBeTruthy();
      }
      render() {
        expect(this.isMounted()).toBeFalsy();
        return <div />;
      }
    }

    var element = <Component />;

    var instance = ReactTestUtils.renderIntoDocument(element);
    expect(instance.isMounted()).toBeTruthy();


  });

  it('should correctly determine if a null component is mounted', () => {
    class Component extends React.Component {
  
      componentWillMount() {
        expect(this.isMounted()).toBeFalsy();
      }
      componentDidMount() {
        expect(this.isMounted()).toBeTruthy();
      }
      render() {
        expect(this.isMounted()).toBeFalsy();
        return null;
      }
    }

    var element = <Component />;

    var instance = ReactTestUtils.renderIntoDocument(element);
    expect(instance.isMounted()).toBeTruthy();
  })
  it('isMounted should return false when unmounted', () => {
    class Component extends React.Component {
      render() {
        return <div />;
      }
    }

    var container = document.createElement('div');
    var instance = ReactDOM.render(<Component />, container);

    // No longer a public API, but we can test that it works internally by
    // reaching into the updater.
    expect(instance.isMounted()).toBe(true);

    ReactDOM.unmountComponentAtNode(container);

    expect(instance.isMounted()).toBe(false);
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

    ReactTestUtils.renderIntoDocument(<Component />);

  });


  it('should carry through each of the phases of setup', () => {
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
function getLifeCycleState(instance) {
  return instance.isMounted() ? 'MOUNTED' : 'UNMOUNTED';
}
    spyOn(console, 'error');

    class LifeCycleComponent extends React.Component {
      constructor(props, context) {
        super(props, context);
        this._testJournal = {};
        var initState = {
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

      componentWillMount() {
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
        var isInitialRender = !this.state.hasRenderCompleted;
        if (isInitialRender) {
          this._testJournal.stateInInitialRender = clone(this.state);
          this._testJournal.lifeCycleInInitialRender = getLifeCycleState(this);
        } else {
          this._testJournal.stateInLaterRender = clone(this.state);
          this._testJournal.lifeCycleInLaterRender = getLifeCycleState(this);
        }
        // you would *NEVER* do anything like this in real code!
        this.state.hasRenderCompleted = true;
        return (
          <div ref="theDiv">
            I am the inner DIV
          </div>
        );
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
    var container = document.createElement('div');
    var instance = ReactDOM.render(<LifeCycleComponent />, container);

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

    var instance = (
      <SetStateInComponentDidMount
        valueToUseInitially="hello"
        valueToUseInOnDOMReady="goodbye"
      />
    );
    instance = ReactTestUtils.renderIntoDocument(instance);
    expect(instance.state.stateField).toBe('goodbye');
  });

  it('should call nested lifecycle methods in the right order', () => {
    var log;
    var logger = function(msg) {
      return function() {
        // return true for shouldComponentUpdate
        log.push(msg);
        return true;
      };
    };
    class Outer extends React.Component {
      componentWillMount = logger('outer componentWillMount');
      componentDidMount = logger('outer componentDidMount');
      componentWillReceiveProps = logger('outer componentWillReceiveProps');
      shouldComponentUpdate = logger('outer shouldComponentUpdate');
      componentWillUpdate = logger('outer componentWillUpdate');
      componentDidUpdate = logger('outer componentDidUpdate');
      componentWillUnmount = logger('outer componentWillUnmount');
      render() {
        return <div><Inner x={this.props.x} /></div>;
      }
    }

    class Inner extends React.Component {
      componentWillMount = logger('inner componentWillMount');
      componentDidMount = logger('inner componentDidMount');
      componentWillReceiveProps = logger('inner componentWillReceiveProps');
      shouldComponentUpdate = logger('inner shouldComponentUpdate');
      componentWillUpdate = logger('inner componentWillUpdate');
      componentDidUpdate = logger('inner componentDidUpdate');
      componentWillUnmount = logger('inner componentWillUnmount');
      render() {
        return <span>{this.props.x}</span>;
      }
    }

    var container = document.createElement('div');
    log = [];
    ReactDOM.render(<Outer x={17} />, container);
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

    log = [];
    ReactDOM.unmountComponentAtNode(container);
    expect(log).toEqual([
      'outer componentWillUnmount',
      'inner componentWillUnmount',
    ]);
  });

  it('calls effects on module-pattern component', function() {
    const log = [];
    function Parent() {
      return {
        render() {
          expect(typeof this.props).toBe('object');
          log.push('render');
          return <Child />;
        },
        componentWillMount() {
          log.push('will mount');
        },
        componentDidMount() {
          log.push('did mount');
        },
        componentDidUpdate() {
          log.push('did update');
        },
        getChildContext() {
          return {x: 2};
        },
      };
    }
    Parent.childContextTypes = {
      x: PropTypes.number,
    };
    function Child(props, context) {
      expect(context.x).toBe(2);
      return <div />;
    }
    Child.contextTypes = {
      x: PropTypes.number,
    };

    const div = document.createElement('div');
    ReactDOM.render(<Parent ref={c => c && log.push('ref')} />, div);
    ReactDOM.render(<Parent ref={c => c && log.push('ref')} />, div);
    expect(log).toEqual([
      'will mount',
      'render',
      'did mount',
      'ref',

      'render',
      'did update',
      'ref',
    ]);
  });
});
import React from "dist/React";
import getTestDocument from "./getTestDocument";
import ReactTestUtils from "lib/ReactTestUtils";

import ReactDOMServer from "dist/ReactDOMServer";
//https://github.com/facebook/react/blob/master/src/isomorphic/children/__tests__/ReactChildren-test.js
var ReactDOM = window.ReactDOM || React;

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
        console.log(this.isMounted())
        expect(this.isMounted()).toBeFalsy();
      }
      componentDidMount() {
        console.log(this.isMounted())
        expect(this.isMounted()).toBeTruthy();
      }
      render() {
        console.log(this.isMounted())
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

});
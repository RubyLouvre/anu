'use strict';

import {beforeHook, afterHook, browser} from 'karma-event-driver-ext/cjs/event-driver-hooks';
import React from 'dist/React';
import sinon from 'sinon';
var ReactDOMFeatureFlags;
var ReactTestUtils;

describe('ReactComponent', () => {
    function normalizeCodeLocInfo(str) {
        return str && str.replace(/\(at .+?:\d+\)/g, '(at **)');
    }
    let scratch;
    beforeEach(() => {
        ReactDOMFeatureFlags = {
            fiberAsyncScheduling: false,
            useFiber: true,
        };
        scratch = document.createElement('div');
        document.body.appendChild(scratch);
    });
    afterEach(() =>{
		scratch.parentNode.removeChild(scratch);
		scratch = null;
    });

  it('should throw on invalid render targets', () => {
    var container = document.createElement('div');
    // jQuery objects are basically arrays; people often pass them in by mistake
    expect(function() {
      React.render(<div />, [container]);
    }).toThrow('[object HTMLDivElement]必须为元素节点');

    expect(function() {
      React.render(<div />, null);
    }).toThrow('null必须为元素节点');
  });

  it('should throw when supplying a ref outside of render method', () => {
    //var instance = <div ref="badDiv" />;
    var instance;
    expect(function() {
        instance = React.render(<div ref="badDiv" />,scratch)
    }).toThrow();
  });

  it('should warn when children are mutated during render', () => {
    //sinon.spy(console, 'error');
    function Wrapper(props) {
      props.children[1] = <p key={1} />; // Mutation is illegal
      return <div>{props.children}</div>;
    }
    expect(() => {
        React.render(<Wrapper>
          <span key={0} />
          <span key={1} />
          <span key={2} />
        </Wrapper>,scratch);
    }).toThrow();
  });
  it('should warn when children are mutated during update', () => {
    //sinon.spy(console, 'error');

    class Wrapper extends React.Component {
      componentDidMount() {
        this.props.children[1] = <p key={1} />; // Mutation is illegal
        this.forceUpdate();
      }

      render() {
        return <div>{this.props.children}</div>;
      }
    }

    expect(() => {
         React.render(<Wrapper>
          <span key={0} />
          <span key={1} />
          <span key={2} />
        </Wrapper>,scratch);
    }).toThrow();
  });

  it('should support refs on owned components', () => {
    var innerObj = {};
    var outerObj = {};

    class Wrapper extends React.Component {
      getObject(){
        return this.props.object;
      };

      render() {
        return <div>{this.props.children}</div>;
      }
    }

    class Component extends React.Component {
      render() {
        var inner = <Wrapper object={innerObj} ref="inner" />;
        var outer = <Wrapper object={outerObj} ref="outer">{inner}</Wrapper>;
        return outer;
      }

      componentDidMount() {
        expect(this.refs.inner.getObject()).toEqual(innerObj);
        expect(this.refs.outer.getObject()).toEqual(outerObj);
      }
    }
    React.render(<Component />,scratch);
    //ReactTestUtils.renderIntoDocument(<Component />);
  });

  it('should not have refs on unmounted components', () => {
    class Parent extends React.Component {
      render() {
        return <Child><div ref="test" /></Child>;
      }

      componentDidMount() {
        expect(this.refs && this.refs.test).toEqual(undefined);
      }
    }

    class Child extends React.Component {
      render() {
        return <div />;
      }
    }
    React.render(<Parent child={<span />} />,scratch);
    //ReactTestUtils.renderIntoDocument(<Parent child={<span />} />);
  });

  it('should support new-style refs', () => {
    var innerObj = {};
    var outerObj = {};

    class Wrapper extends React.Component {
      getObject(){
        return this.props.object;
      };

      render() {
        return <div>{this.props.children}</div>;
      }
    }

    var mounted = false;

    class Component extends React.Component {
      render() {
        var inner = (
          <Wrapper object={innerObj} ref={c => (this.innerRef = c)} />
        );
        var outer = (
          <Wrapper object={outerObj} ref={c => (this.outerRef = c)}>
            {inner}
          </Wrapper>
        );
        return outer;
      }

      componentDidMount() {
        expect(this.innerRef.getObject()).toEqual(innerObj);
        expect(this.outerRef.getObject()).toEqual(outerObj);
        mounted = true;
      }
    }
    React.render(<Component />,scratch);
    //ReactTestUtils.renderIntoDocument(<Component />);
    expect(mounted).toBe(true);
  });

  it('should support new-style refs with mixed-up owners', () => {
    class Wrapper extends React.Component {
      getTitle(){
        return this.props.title;
      };

      render() {
        return this.props.getContent();
      }
    }

    var mounted = false;

    class Component extends React.Component {
      getInner(){
        // (With old-style refs, it's impossible to get a ref to this div
        // because Wrapper is the current owner when this function is called.)
        return <div className="inner" ref={c => (this.innerRef = c)} />;
      };

      render() {
        return (
          <Wrapper
            title="wrapper"
            ref={c => (this.wrapperRef = c)}
            getContent={this.getInner.bind(this)}
          />
        );
      }

      componentDidMount() {
        // Check .props.title to make sure we got the right elements back
        expect(this.wrapperRef.getTitle()).toBe('wrapper');
        expect(React.findDOMNode(this.innerRef).className).toBe('inner');
        mounted = true;
      }
    }
    React.render(<Component />,scratch);
    expect(mounted).toBe(true);
  });

  it('should call refs at the correct time', () => {
    var log = [];

    class Inner extends React.Component {
      render() {
        log.push(`inner ${this.props.id} render`);
        return <div />;
      }

      componentDidMount() {
        log.push(`inner ${this.props.id} componentDidMount`);
      }

      componentDidUpdate() {
        log.push(`inner ${this.props.id} componentDidUpdate`);
      }

      componentWillUnmount() {
        log.push(`inner ${this.props.id} componentWillUnmount`);
      }
    }

    class Outer extends React.Component {
      render() {
        return (
          <div>
            <Inner
              id={1}
              ref={c => {
                log.push(`ref 1 got ${c ? `instance ${c.props.id}` : 'null'}`);
              }}
            />
            <Inner
              id={2}
              ref={c => {
                log.push(`ref 2 got ${c ? `instance ${c.props.id}` : 'null'}`);
              }}
            />
          </div>
        );
      }

      componentDidMount() {
        log.push('outer componentDidMount');
      }

      componentDidUpdate() {
        log.push('outer componentDidUpdate');
      }

      componentWillUnmount() {
        log.push('outer componentWillUnmount');
      }
    }

    // mount, update, unmount
    var el = document.createElement('div');
    log.push('start mount');
    React.render(<Outer />, el);
    log.push('start update');
    React.render(<Outer />, el);
    // log.push('start unmount');
    // React.unmountComponentAtNode(el);

    /* eslint-disable indent */
    console.log(log)
    expect(log).toEqual([
      'start mount',
      'inner 1 render',
      'inner 2 render',
      'inner 1 componentDidMount',
      'ref 1 got instance 1',
      'inner 2 componentDidMount',
      'ref 2 got instance 2',
      'outer componentDidMount',
      'start update',
      // Previous (equivalent) refs get cleared
      ...(ReactDOMFeatureFlags.useFiber
        ? [
            // Fiber renders first, resets refs later
            'inner 1 render',
            'inner 2 render',
            'ref 1 got null',
            'ref 2 got null',
          ]
        : [
            // Stack resets refs before rendering
            'ref 1 got null',
            'inner 1 render',
            'ref 2 got null',
            'inner 2 render',
          ]),
      'inner 1 componentDidUpdate',
      'ref 1 got instance 1',
      'inner 2 componentDidUpdate',
      'ref 2 got instance 2',
      'outer componentDidUpdate',
    ]);
    /* eslint-enable indent */
  });

  it('fires the callback after a component is rendered', () => {
    //var callback = jest.fn();
    var callback = sinon.spy();
    var container = document.createElement('div');
    React.render(<div />, container, callback);
    expect(callback).to.have.been.calledOnce;
    React.render(<div className="foo" />, container, callback);
    expect(callback).to.have.been.calledTwice;
    React.render(<span />, container, callback);
    expect(callback).to.have.been.calledThrice
  });

  it('throws if a plain object is used as a child', () => {
    var children = {
      x: <span />,
      y: <span />,
      z: <span />,
    };
    var element = <div>{[children]}</div>;
    
    var container = document.createElement('div');
    var ex;
    try {
      var s = React.render(element, container);
    } catch (e) {
      ex = e;
    }
    expect(ex).toBeDefined();
    expect(normalizeCodeLocInfo(ex.message)).toBe(
      'Objects are not valid as a React child (found: object with keys ' +
        '{x, y, z}). If you meant to render a collection of children, use ' +
        'an array instead.' +
        // Fiber gives a slightly better stack with the nearest host components
        (ReactDOMFeatureFlags.useFiber ? '\n    in div (at **)' : ''),
    );
  });

  it('throws if a plain object even if it is in an owner', () => {
    class Foo extends React.Component {
      render() {
        var children = {
          a: <span />,
          b: <span />,
          c: <span />,
        };
        return <div>{[children]}</div>;
      }
    }
    var container = document.createElement('div');
    var ex;
    try {
      React.render(<Foo />, container);
    } catch (e) {
      ex = e;
    }
    expect(ex).toBeDefined();
    expect(normalizeCodeLocInfo(ex.message)).toBe(
      'Objects are not valid as a React child (found: object with keys ' +
        '{a, b, c}). If you meant to render a collection of children, use ' +
        'an array instead.\n' +
        // Fiber gives a slightly better stack with the nearest host components
        (ReactDOMFeatureFlags.useFiber ? '    in div (at **)\n' : '') +
        '    in Foo (at **)',
    );
  });
});
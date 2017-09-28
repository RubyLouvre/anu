import React from "dist/React";
import getTestDocument from "./getTestDocument";
import ReactTestUtils from "lib/ReactTestUtils";

import ReactDOMServer from "dist/ReactDOMServer";
//https://github.com/facebook/react/blob/master/src/isomorphic/children/__tests__/ReactChildren-test.js
var ReactDOM = window.ReactDOM || React;

describe("ReactCompositeComponent", function() {
    this.timeout(200000);


    it("should support module pattern components", () => {
        function Child({test}) {
            return {
                render() {
                    return <div>{test}</div>;
                },
            };
        }

        var el = document.createElement("div");
        ReactDOM.render(<Child test="test" />, el);

        expect(el.textContent).toBe("test");
    });

    it("should support rendering to different child types over time", () => {
        var instance = ReactTestUtils.renderIntoDocument(<MorphingComponent />);
        var el = ReactDOM.findDOMNode(instance);
        expect(el.tagName).toBe("A");

        instance._toggleActivatedState();
        el = ReactDOM.findDOMNode(instance);
        expect(el.tagName).toBe("B");

        instance._toggleActivatedState();
        el = ReactDOM.findDOMNode(instance);
        expect(el.tagName).toBe("A");
    });
    var MorphingComponent = class extends React.Component {
      state = {activated: false};

      _toggleActivatedState = () => {
        this.setState({activated: !this.state.activated});
      };

      render() {
        var toggleActivatedState = this._toggleActivatedState;
        return !this.state.activated
          ? <a ref="x" onClick={toggleActivatedState} />
          : <b ref="x" onClick={toggleActivatedState} />;
      }
    };
    it("should react to state changes from callbacks", () => {
        var instance = ReactTestUtils.renderIntoDocument(<MorphingComponent />);
        var el = ReactDOM.findDOMNode(instance);
        expect(el.tagName).toBe("A");

        ReactTestUtils.Simulate.click(el);
        el = ReactDOM.findDOMNode(instance);
        expect(el.tagName).toBe("B");
    });



  it('should rewire refs when rendering to different child types', () => {
    var instance = ReactTestUtils.renderIntoDocument(<MorphingComponent />);

    expect(ReactDOM.findDOMNode(instance.refs.x).tagName).toBe('A');
    instance._toggleActivatedState();
    expect(ReactDOM.findDOMNode(instance.refs.x).tagName).toBe('B');
    instance._toggleActivatedState();
    expect(ReactDOM.findDOMNode(instance.refs.x).tagName).toBe('A');
  });
  var ChildUpdates = class extends React.Component {
    getAnchor = () => {
      return this.refs.anch;
    };

    render() {
      var className = this.props.anchorClassOn ? 'anchorClass' : '';
      return this.props.renderAnchor
        ? <a ref="anch" className={className} />
        : <b />;
    }
  };
  it('should not cache old DOM nodes when switching constructors', () => {
    var container = document.createElement('div');
    var instance = ReactDOM.render(
      <ChildUpdates renderAnchor={true} anchorClassOn={false} />,
      container,
    );
    ReactDOM.render(
      // Warm any cache
      <ChildUpdates renderAnchor={true} anchorClassOn={true} />,
      container,
    );
    ReactDOM.render(
      // Clear out the anchor
      <ChildUpdates renderAnchor={false} anchorClassOn={true} />,
      container,
    );
    ReactDOM.render(
      // rerender
      <ChildUpdates renderAnchor={true} anchorClassOn={false} />,
      container,
    );
    expect(instance.getAnchor().className).toBe('');
  });

  it('should use default values for undefined props', () => {
    class Component extends React.Component {
      static defaultProps = {prop: 'testKey'};

      render() {
        return <span />;
      }
    }

    var instance1 = ReactTestUtils.renderIntoDocument(<Component />);
    expect(instance1.props).toEqual({prop: 'testKey'});

    var instance2 = ReactTestUtils.renderIntoDocument(
      <Component prop={undefined} />,
    );
    expect(instance2.props).toEqual({prop: 'testKey'});

    var instance3 = ReactTestUtils.renderIntoDocument(
      <Component prop={null} />,
    );
    expect(instance3.props).toEqual({prop: null});
  });


  it('should not mutate passed-in props object', () => {
    class Component extends React.Component {
      static defaultProps = {prop: 'testKey'};

      render() {
        return <span />;
      }
    }

    var inputProps = {};
    var instance1 = <Component {...inputProps} />;
    instance1 = ReactTestUtils.renderIntoDocument(instance1);
    expect(instance1.props.prop).toBe('testKey');

    // We don't mutate the input, just in case the caller wants to do something
    // with it after using it to instantiate a component
    expect(inputProps.prop).toBe(void 666);
  });

  it('should warn about `forceUpdate` on unmounted components', () => {

    var container = document.createElement('div');
    document.body.appendChild(container);

    class Component extends React.Component {
      render() {
        return <div />;
      }
    }

    var instance = <Component />;
    expect(instance.forceUpdate).toBe(void 666)

    instance = ReactDOM.render(instance, container);
    instance.forceUpdate();

    ReactDOM.unmountComponentAtNode(container);

    instance.forceUpdate();
  });

  it('should warn about `setState` on unmounted components', () => {

    var container = document.createElement('div');
    document.body.appendChild(container);

    var renders = 0;

    class Component extends React.Component {
      state = {value: 0};

      render() {
        renders++;
        return <div />;
      }
    }

    var instance = <Component />;
    expect(instance.setState).toBe(void 666)

    instance = ReactDOM.render(instance, container);

    expect(renders).toBe(1);

    instance.setState({value: 1});


    expect(renders).toBe(2);

    ReactDOM.unmountComponentAtNode(container);
    instance.setState({value: 2});

    expect(renders).toBe(2);


  });

  it('should silently allow `setState`, not call cb on unmounting components', () => {
    var cbCalled = false;
    var container = document.createElement('div');
    document.body.appendChild(container);

    class Component extends React.Component {
      state = {value: 0};

      componentWillUnmount() {
        expect(() => {
          this.setState({value: 2}, function() {
            cbCalled = true;
          });
        }).not.toThrow();
      }

      render() {
        return <div />;
      }
    }

    var instance = ReactDOM.render(<Component />, container);
    instance.setState({value: 1});

    ReactDOM.unmountComponentAtNode(container);
    expect(cbCalled).toBe(false);
  });

  it('should warn about `setState` in render', () => {
    spyOn(console, 'error');

    var container = document.createElement('div');

    var renderedState = -1;
    var renderPasses = 0;

    class Component extends React.Component {
      state = {value: 0};

      render() {
        renderPasses++;
        renderedState = this.state.value;
        if (this.state.value === 0) {
          this.setState({value: 1});
        }
        return <div />;
      }
    }


    var instance = ReactDOM.render(<Component />, container);



    // The setState call is queued and then executed as a second pass. This
    // behavior is undefined though so we're free to change it to suit the
    // implementation details.
    expect(renderPasses).toBe(2);
    expect(renderedState).toBe(1);
    expect(instance.state.value).toBe(1);

    // Forcing a rerender anywhere will cause the update to happen.
    var instance2 = ReactDOM.render(<Component prop={123} />, container);
    expect(instance).toBe(instance2);
    expect(renderedState).toBe(1);
    expect(instance2.state.value).toBe(1);
  });

  it('should warn about `setState` in getChildContext', () => {
    spyOn(console, 'error');

    var container = document.createElement('div');

    var renderPasses = 0;

    class Component extends React.Component {
      state = {value: 0};

      getChildContext() {
        if (this.state.value === 0) {
          this.setState({value: 4});
        }
      }

      render() {
        renderPasses++;
        return <div />;
      }
    }
    Component.childContextTypes = {};

    var instance = ReactDOM.render(<Component />, container);
    expect(renderPasses).toBe(2);
    expect(instance.state.value).toBe(4);
 
  });

  it('should call componentWillUnmount before unmounting', () => {
    var container = document.createElement('div');
    var innerUnmounted = false;

    class Component extends React.Component {
      render() {
        return (
          <div>
            <Inner />
            Text
          </div>
        );
      }
    }

    class Inner extends React.Component {
      componentWillUnmount() {
        innerUnmounted = true;
      }

      render() {
        return <div />;
      }
    }

    ReactDOM.render(<Component />, container);
    ReactDOM.unmountComponentAtNode(container);
    expect(innerUnmounted).toBe(true);
  });

  it('should warn when shouldComponentUpdate() returns undefined', () => {
    var container = document.createElement('div');
    class Component extends React.Component {
      state = {bogus: false};

      shouldComponentUpdate() {
        return undefined;
      }

      render() {
        return <div>{this.state.bogus}</div>;
      }
    }

    var instance = ReactDOM.render(<Component />, container);
    instance.setState({bogus: true});
    expect(container.textContent).toBe("");//布尔会转换为空字符串
   
  });
//https://github.com/facebook/react/blob/master/src/renderers/__tests__/ReactCompositeComponent-test.js#L526
  it('should pass context to children when not owner', () => {
    class Parent extends React.Component {
      render() {
        return <Child><Grandchild /></Child>;
      }
    }

    class Child extends React.Component {
      static childContextTypes = {
        foo: React.PropTypes.string,
      };

      getChildContext() {
        return {
          foo: 'bar',
        };
      }

      render() {
        return React.Children.only(this.props.children);
      }
    }

    class Grandchild extends React.Component {
      static contextTypes = {
        foo: React.PropTypes.string,
      };

      render() {
        return <div>{this.context.foo}</div>;
      }
    }

    var component = ReactTestUtils.renderIntoDocument(<Parent />);
    expect(ReactDOM.findDOMNode(component).innerHTML).toBe('bar');
  });

});
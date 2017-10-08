import React from "dist/React";
import getTestDocument from "./getTestDocument";
import ReactTestUtils from "lib/ReactTestUtils";
import ReactDOMServer from "dist/ReactDOMServer";
// https://github.com/facebook/react/blob/master/src/renderers/__tests__/EventPluginHub-test.js
var ReactDOM = window.ReactDOM || React;

describe("ReactElementClone", function() {
    this.timeout(200000);

    // NOTE: We're explicitly not using JSX here. This is intended to test
    // classic JS without JSX.
    var ComponentClass = class extends React.Component {
        render() {
            return React.createElement("div");
        }
    };


    it("should clone a DOM component with new props", () => {
        class Grandparent extends React.Component {
            render() {
                return <Parent child={<div className="child" />} />;
            }
        }
        class Parent extends React.Component {
            render() {
                return (
                    <div className="parent">
                        {React.cloneElement(this.props.child, {className: "xyz"})}
                    </div>
                );
            }
        }
        var component = ReactTestUtils.renderIntoDocument(<Grandparent />);
        expect(ReactDOM.findDOMNode(component).childNodes[0].className).toBe("xyz");
    });

    it("should clone a composite component with new props", () => {
        class Child extends React.Component {
            render() {
                return <div className={this.props.className} />;
            }
        }
        class Grandparent extends React.Component {
            render() {
                return <Parent child={<Child className="child" />} />;
            }
        }
        class Parent extends React.Component {
            render() {
                return (
                    <div className="parent">
                        {React.cloneElement(this.props.child, {className: "xyz"})}
                    </div>
                );
            }
        }
        var component = ReactTestUtils.renderIntoDocument(<Grandparent />);
        expect(ReactDOM.findDOMNode(component).childNodes[0].className).toBe("xyz");
    });

    it("does not fail if config has no prototype", () => {
        var config = Object.create(null, {foo: {value: 1, enumerable: true}});
        React.cloneElement(<div />, config);
    });

    it("should keep the original ref if it is not overridden", () => {
        class Grandparent extends React.Component {
            render() {
                return <Parent child={<div ref="yolo" />} />;
            }
        }

        class Parent extends React.Component {
            render() {
                return (
                    <div>
                        {React.cloneElement(this.props.child, {className: "xyz"})}
                    </div>
                );
            }
        }

        var component = ReactTestUtils.renderIntoDocument(<Grandparent />);
        expect(component.refs.yolo.tagName).toBe("DIV");
    });

    it('should transfer the key property', () => {
    class Component extends React.Component {
      render() {
        return null;
      }
    }
    var clone = React.cloneElement(<Component />, {key: 'xyz'});
    expect(clone.key).toBe('xyz');
  });

  it('should transfer children', () => {
    class Component extends React.Component {
      render() {
        expect(this.props.children).toBe('xyz');
        return <div />;
      }
    }

    ReactTestUtils.renderIntoDocument(
      React.cloneElement(<Component />, {children: 'xyz'}),
    );
  });
  it('should shallow clone children', () => {
    class Component extends React.Component {
      render() {
        expect(this.props.children).toBe('xyz');
        return <div />;
      }
    }

    ReactTestUtils.renderIntoDocument(
      React.cloneElement(<Component>xyz</Component>, {}),
    );
  });

  it('should accept children as rest arguments', () => {
    class Component extends React.Component {
      render() {
        return null;
      }
    }

    var clone = React.cloneElement(
      <Component>xyz</Component>,
      {children: <Component />},
      <div />,
      <span />,
    );

    expect(clone.props.children).toEqual([<div />, <span />]);
  });
  it('should override children if undefined is provided as an argument', () => {
    var element = React.createElement(
      ComponentClass,
      {
        children: 'text',
      },
      undefined,
    );
    expect(element.props.children).toBe(undefined);

    var element2 = React.cloneElement(
      React.createElement(ComponentClass, {
        children: 'text',
      }),
      {},
      undefined,
    );
    expect(element2.props.children).toBe(undefined);
  });
  it('should support keys and refs', () => {
    class Parent extends React.Component {
      render() {
        var clone = React.cloneElement(this.props.children, {
          key: 'xyz',
          ref: 'xyz',
        });
        expect(clone.key).toBe('xyz');
       // expect(clone.ref).toBe('xyz');
        return <div>{clone}</div>;
      }
    }

    class Grandparent extends React.Component {
      render() {
        return <Parent ref="parent"><span key="abc" /></Parent>;
      }
    }

    var component = ReactTestUtils.renderIntoDocument(<Grandparent />);
    expect(component.refs.parent.refs.xyz.tagName).toBe('SPAN');
  });

  it('should steal the ref if a new ref is specified', () => {
    class Parent extends React.Component {
      render() {
        var clone = React.cloneElement(this.props.children, {ref: 'xyz'});
        return <div>{clone}</div>;
      }
    }

    class Grandparent extends React.Component {
      render() {
        return <Parent ref="parent"><span ref="child" /></Parent>;
      }
    }

    var component = ReactTestUtils.renderIntoDocument(<Grandparent />);
    expect(component.refs.child).toBeUndefined();
    expect(component.refs.parent.refs.xyz.tagName).toBe('SPAN');
  });
  it('should overwrite props', () => {
    class Component extends React.Component {
      render() {
        expect(this.props.myprop).toBe('xyz');
        return <div />;
      }
    }

    ReactTestUtils.renderIntoDocument(
      React.cloneElement(<Component myprop="abc" />, {myprop: 'xyz'}),
    );
  });

  it('should normalize props with default values', () => {
    class Component extends React.Component {
      render() {
        return <span />;
      }
    }
    Component.defaultProps = {prop: 'testKey'};

    var instance = React.createElement(Component);
    var clonedInstance = React.cloneElement(instance, {prop: undefined});
    expect(clonedInstance.props.prop).toBe('testKey');
    var clonedInstance2 = React.cloneElement(instance, {prop: null});
    expect(clonedInstance2.props.prop).toBe(null);

    var instance2 = React.createElement(Component, {prop: 'newTestKey'});
    var cloneInstance3 = React.cloneElement(instance2, {prop: undefined});
    expect(cloneInstance3.props.prop).toBe('testKey');
    var cloneInstance4 = React.cloneElement(instance2, {});
    expect(cloneInstance4.props.prop).toBe('newTestKey');
  });
  it('does not warns for arrays of elements with keys', () => {
    spyOn(console, 'error');

    React.cloneElement(<div />, null, [<div key="#1" />, <div key="#2" />]);

    expect(console.error.calls.count()).toBe(0);
  });

  it('does not warn when the element is directly in rest args', () => {
    spyOn(console, 'error');

    React.cloneElement(<div />, null, <div />, <div />);

    expect(console.error.calls.count()).toBe(0);
  });

  it('does not warn when the array contains a non-element', () => {
    spyOn(console, 'error');

    React.cloneElement(<div />, null, [{}, {}]);

    expect(console.error.calls.count()).toBe(0);
  });

  it('should ignore key and ref warning getters', () => {
    var elementA = React.createElement('div');
    var elementB = React.cloneElement(elementA, elementA.props);
    expect(!!elementB.key).toBe(false);
    expect(!!elementB.ref).toBe(false);
  });

  it('should ignore undefined key and ref', () => {
    var element = React.createFactory(ComponentClass)({
      key: '12',
      ref: '34',
      foo: '56',
    });
    var props = {
      key: undefined,
      ref: undefined,
      foo: 'ef',
    };
    var clone = React.cloneElement(element, props);
    expect(clone.type).toBe(ComponentClass);
    expect(clone.key).toBe('12');
    expect(clone.ref.string).toBe('34');
  //  expect(Object.isFrozen(element)).toBe(true);
  //  expect(Object.isFrozen(element.props)).toBe(true);
    expect(clone.props).toEqual({foo: 'ef'});
  });

  it('should extract null key and ref', () => {
    var element = React.createFactory(ComponentClass)({
      key: '12',
      ref: '34',
      foo: '56',
    });
    var props = {
      key: null,
      ref: null,
      foo: 'ef',
    };
    var clone = React.cloneElement(element, props);
    expect(clone.type).toBe(ComponentClass);
    expect(clone.key).toBe('null');
    expect(!!clone.ref).toBe(false);
   // expect(Object.isFrozen(element)).toBe(true);
   // expect(Object.isFrozen(element.props)).toBe(true);
    expect(clone.props).toEqual({foo: 'ef'});
  });
  it("子元素被克隆", function(){
    function Bar(props) {
        return React.cloneElement(props.children, {className: props.className})
      }
    var container = document.createElement('div');
  
    var myNodeA = ReactDOM.render(<Bar className="a"><span /></Bar>, container);
    expect(myNodeA.updater._hostNode.className).toBe("a")
  
     myNodeA = ReactDOM.render(<Bar className="kk"><span /></Bar>, container);
    expect(myNodeA.updater._hostNode.className).toBe("kk")
  })
  it("子元素被克隆2", function(){
    function Bar(props) {
      return React.cloneElement(props.children, {className: props.className})
    }
    function Foo(props) {
      return props.className === "a" ?  <span {...props} />:<p {...props} />
    }
    var container = document.createElement('div');
  
    var myNodeA = ReactDOM.render(<Bar className="a"><Foo /></Bar>, container);
    expect(myNodeA.updater._hostNode.className).toBe("a")
  
     myNodeA = ReactDOM.render(<Bar className="kk"><Foo /></Bar>, container);
    expect(myNodeA.updater._hostNode.className).toBe("kk")
  })
});
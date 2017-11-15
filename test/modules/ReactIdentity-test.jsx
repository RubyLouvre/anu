import React from "dist/React";
import getTestDocument from "./getTestDocument";
import ReactTestUtils from "lib/ReactTestUtils";

import ReactDOMServer from "dist/ReactDOMServer";
//https://github.com/facebook/react/blob/master/src/isomorphic/children/__tests__/ReactChildren-test.js
var ReactDOM = window.ReactDOM || React;

describe("ReactIdentity", function() {
    this.timeout(200000);

    it("should allow key property to express identity", () => {
        var node;
        var Component = props => (
            <div ref={c => (node = c)}>
                <div key={props.swap ? "banana" : "apple"} />
                <div key={props.swap ? "apple" : "banana"} />
            </div>
        );

        var container = document.createElement("div");
        ReactDOM.render(<Component />, container);
        var origChildren = Array.from(node.childNodes);
        ReactDOM.render(<Component swap={true} />, container);
        var newChildren = Array.from(node.childNodes);
        expect(origChildren[0]).toBe(newChildren[1]);
        expect(origChildren[1]).toBe(newChildren[0]);
    });

    it("should use composite identity", () => {
        class Wrapper extends React.Component {
            render() {
                return <a>{this.props.children}</a>;
            }
        }

        var container = document.createElement("div");
        var node1;
        var node2;
        ReactDOM.render(
            <Wrapper key="wrap1"><span ref={c => (node1 = c)} /></Wrapper>,
            container
        );
        ReactDOM.render(
            <Wrapper key="wrap2"><span ref={c => (node2 = c)} /></Wrapper>,
            container
        );

        expect(node1).not.toBe(node2);
    });


    function renderAComponentWithKeyIntoContainer(key, container) {
        class Wrapper extends React.Component {
            render() {
                return <div><span ref="span" key={key} /></div>;
            }
        }

        var instance = ReactDOM.render(<Wrapper />, container);
        var span = instance.refs.span;
        expect(ReactDOM.findDOMNode(span)).not.toBe(null);
    }

    it("should allow any character as a key, in a detached parent", () => {
        var detachedContainer = document.createElement("div");
        renderAComponentWithKeyIntoContainer("<'WEIRD/&\\key'>", detachedContainer);
    });

    it("should allow any character as a key, in an attached parent", () => {
    // This test exists to protect against implementation details that
    // incorrectly query escaped IDs using DOM tools like getElementById.
        var attachedContainer = document.createElement("div");
        document.body.appendChild(attachedContainer);

        renderAComponentWithKeyIntoContainer("<'WEIRD/&\\key'>", attachedContainer);

        document.body.removeChild(attachedContainer);
    });

    it("should not allow scripts in keys to execute", () => {
        var h4x0rKey =
      "\"><script>window['YOUVEBEENH4X0RED']=true;</script><div id=\"";

        var attachedContainer = document.createElement("div");
        document.body.appendChild(attachedContainer);

        renderAComponentWithKeyIntoContainer(h4x0rKey, attachedContainer);

        document.body.removeChild(attachedContainer);

        // If we get this far, make sure we haven't executed the code
        expect(window.YOUVEBEENH4X0RED).toBe(undefined);
    });
    it("should let restructured components retain their uniqueness", () => {
        var instance0 = <span />;
        var instance1 = <span />;
        var instance2 = <span />;

        class TestComponent extends React.Component {
            render() {
                return (
                    <div>
                        {instance2}
                        {this.props.children[0]}
                        {this.props.children[1]}
                    </div>
                );
            }
        }

        class TestContainer extends React.Component {
            render() {
                return <TestComponent>{instance0}{instance1}</TestComponent>;
            }
        }

        expect(function() {
            ReactTestUtils.renderIntoDocument(<TestContainer />);
        }).not.toThrow();
    });

    it("should let nested restructures retain their uniqueness", () => {
        var instance0 = <span />;
        var instance1 = <span />;
        var instance2 = <span />;

        class TestComponent extends React.Component {
            render() {
                return (
                    <div>
                        {instance2}
                        {this.props.children[0]}
                        {this.props.children[1]}
                    </div>
                );
            }
        }

        class TestContainer extends React.Component {
            render() {
                return (
                    <div>
                        <TestComponent>{instance0}{instance1}</TestComponent>
            </div>
                );
            }
        }

        expect(function() {
            ReactTestUtils.renderIntoDocument(<TestContainer />);
        }).not.toThrow();
    });

    it("should let text nodes retain their uniqueness", () => {
        class TestComponent extends React.Component {
            render() {
                return <div>{this.props.children}<span /></div>;
            }
        }

        class TestContainer extends React.Component {
            render() {
                return (
                    <TestComponent>
                        <div />
                        {"second"}
                    </TestComponent>
                );
            }
        }

        expect(function() {
            ReactTestUtils.renderIntoDocument(<TestContainer />);
        }).not.toThrow();
    });
    it('should retain key during updates in composite components', () => {
    class TestComponent extends React.Component {
      render() {
        return <div>{this.props.children}</div>;
      }
    }

    class TestContainer extends React.Component {
      state = {swapped: false};

      swap = () => {
        this.setState({swapped: true});
      };

      render() {
        return (
          <TestComponent>
            {this.state.swapped ? this.props.second : this.props.first}
            {this.state.swapped ? this.props.first : this.props.second}
          </TestComponent>
        );
      }
    }

    var instance0 = <span key="A" />;
    var instance1 = <span key="B" />;

    var wrapped = <TestContainer first={instance0} second={instance1} />;

    wrapped = ReactDOM.render(wrapped, document.createElement('div'));
    var div = ReactDOM.findDOMNode(wrapped);

    var beforeA = div.childNodes[0];
    var beforeB = div.childNodes[1];
    wrapped.swap();
    var afterA = div.childNodes[1];
    var afterB = div.childNodes[0];

    expect(beforeA).toBe(afterA);
    expect(beforeB).toBe(afterB);
  });

  it('should not allow implicit and explicit keys to collide', () => {
    var component = (
      <div>
        <span />
        <span key="0" />
      </div>
    );

    expect(function() {
      ReactTestUtils.renderIntoDocument(component);
    }).not.toThrow();
  });
});
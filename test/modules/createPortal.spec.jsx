import React from "src/React";

describe("createPortal", function() {
    it("should support Portal components", () => {
        var context = {};
        var called = false;
        var callback = function(kid, index) {
            expect(this).toBe(context);
            called = true;
            return kid;
        };

        const portalContainer = document.createElement("div");

        const simpleChild = <span key="simple" />;
        const reactPortal = ReactDOM.createPortal(simpleChild, portalContainer);

        const parentInstance = <div>{reactPortal}</div>;
        React.Children.forEach(parentInstance.props.children, callback, context);
        expect(called).toBe(true);
        called = false;
        const mappedChildren = React.Children.map(parentInstance.props.children, callback, context);
        expect(called).toBe(true);
        //  expect(mappedChildren[0].type).toEqual(reactPortal.type);
    });

    it("supports portals", () => {
        var body = document.body;
        var container = document.createElement("div");
        body.appendChild(container);
        var innerWillMount, innerDidMount, innerWillUnmount;
        class Inner extends React.Component {
            render() {
                return <p>inner</p>;
            }
            componentWillUnmount() {
                innerWillUnmount = true;
            }
            componentWillMount() {
                innerWillMount = true;
            }
            componentDidMount() {
                innerDidMount = true;
            }
        }
        var testBubble = 0;
        class Container extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    show: false,
                    number: 1
                };
            }

            _show() {
                if (this.state.show) {
                    return; //防止创建多个弹窗
                }
                this.setState({ show: true });
            }

            _close(e) {
                this.setState({ show: false });
            }

            render() {
                const { show } = this.state;

                return (
                    <div
                        className="Container"
                        onClick={e => {
                            testBubble = true;
                            e.preventDefault();
                        }}
                    >
                        <div className="hasClick" style={{ background: "#00bcd4" }} ref="openDialog" onClick={this._show.bind(this)}>
                            <div>Click me to show the Portal content</div>
                            <div>State: {(show && "visible") || "hidden"}</div>
                            <div ref="vdialog">
                                {show && (
                                    <Portal>
                                        <div style={{ background: "#ffeebb", height: 200 }}>
                                            <p ref="number">{this.state.number}</p>
                                            <Inner />
                                            <button ref="closeDialog" onClick={this._close.bind(this)} type="button">
                                                &times; close portal
                                            </button>
                                        </div>
                                    </Portal>
                                )}<span>111</span><span>222</span>
                            </div>
                        </div>
                    </div>
                );
            }
        }

        class Portal extends React.Component {
            constructor(props) {
                super(props);
                this.node = document.createElement("div");
                this.node.id = "dynamic";
                body.appendChild(this.node);
            }
            componentWillUnmount() {
                body.removeChild(this.node);
            }
            render() {
                return ReactDOM.createPortal(this.props.children, this.node);
            }
        }
        var s = ReactDOM.render(<Container />, container);
        expect(!!s.refs.openDialog).toBe(true);
        expect(!!s.refs.closeDialog).toBe(false);
        s.refs.openDialog.click();
        expect(!!document.getElementById("dynamic")).toBe(true);
        expect(!!s.refs.closeDialog).toBe(true);
        
        expect(innerWillMount).toBe(true);
        expect(innerDidMount).toBe(true);
        s.setState({ number: 10 });
        expect(s.refs.number.innerHTML).toBe("10");
        testBubble = false;
        expect(s.refs.vdialog.innerHTML.toLowerCase()).toBe("<span>111</span><span>222</span>");
        
        s.refs.closeDialog.click();
        expect(innerWillUnmount).toBe(true);
        expect(!!s.refs.closeDialog).toBe(false);
        expect(testBubble).toBe(true);
        
    });

    it("弹窗中没有事件的按钮点击后也能触发外面的事件回调", function(){
        var appRoot = document.createElement("div")
        var modalRoot = document.createElement("div")
        document.body.appendChild(appRoot)
        document.body.appendChild(modalRoot)
        class Modal extends React.Component {
          constructor(props) {
            super(props);
            this.el = document.createElement('div');
          }
        
          componentDidMount() {
            // The portal element is inserted in the DOM tree after
            // the Modal's children are mounted, meaning that children
            // will be mounted on a detached DOM node. If a child
            // component requires to be attached to the DOM tree
            // immediately when mounted, for example to measure a
            // DOM node, or uses 'autoFocus' in a descendant, add
            // state to Modal and only render the children when Modal
            // is inserted in the DOM tree.
            modalRoot.appendChild(this.el);
          }
        
          componentWillUnmount() {
            modalRoot.removeChild(this.el);
          }
        
          render() {
            return ReactDOM.createPortal(
              this.props.children,
              this.el,
            );
          }
        }
        var c = 0
        class Parent extends React.Component {
          constructor(props) {
            super(props);
            this.state = {clicks: 0};
            this.handleClick = this.handleClick.bind(this);
          }
        
          handleClick() {
            // This will fire when the button in Child is clicked,
            // updating Parent's state, even though button
            // is not direct descendant in the DOM.
            c ++
            this.setState(prevState => ({
              clicks: prevState.clicks + 1
            }));
          }
        
          render() {
            return (
              <div onClick={this.handleClick}>
                <p>Number of clicks: {this.state.clicks}</p>
                <p>
                  Open up the browser DevTools
                  to observe that the button
                  is not a child of the div
                  with the onClick handler.
                </p>
                <Modal>
                  <Child />
                </Modal>
              </div>
            );
          }
        }
        
        function Child() {
          // The click event on this button will bubble up to parent,
          // because there is no 'onClick' attribute defined
          return (
            <div className="modal">
              <button type="button" id="ChildButton">Click</button>
            </div>
          );
        }
        
        ReactDOM.render(<Parent />, appRoot);
        var ChildButton = document.getElementById("ChildButton")
        ChildButton.click()
        expect(c).toBe(1)
        ChildButton.click()
        expect(c).toBe(2)

        document.body.removeChild(appRoot)
        document.body.removeChild(modalRoot)
    })
});

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
                                )}
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
        expect(s.refs.vdialog.innerHTML).toBe("");
        
        s.refs.closeDialog.click();
        expect(innerWillUnmount).toBe(true);
        console.log(s.refs.closeDialog);
        // expect(!!s.refs.closeDialog).toBe(false);
        expect(testBubble).toBe(true);
        
    });
});

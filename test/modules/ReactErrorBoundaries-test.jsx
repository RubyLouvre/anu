import React from "dist/React";
import getTestDocument from "./getTestDocument";
import ReactTestUtils from "lib/ReactTestUtils";
var PropTypes = React.PropTypes;

// https://github.com/facebook/react/blob/master/src/renderers/__tests__/EventPluginHub-test.js
var ReactDOM = window.ReactDOM || React;

describe("ReactErrorBoundaries", () => {
    var log;

    var BrokenConstructor;
    var BrokenComponentWillMount;
    var BrokenComponentDidMount;
    var BrokenComponentWillReceiveProps;
    var BrokenComponentWillUpdate;
    var BrokenComponentDidUpdate;
    var BrokenComponentWillUnmount;
    var BrokenRenderErrorBoundary;
    var BrokenComponentWillMountErrorBoundary;
    var BrokenComponentDidMountErrorBoundary;
    var BrokenRender;
    var ErrorBoundary;
    var ErrorMessage;
    var NoopErrorBoundary;
    var RetryErrorBoundary;
    var Normal;
    var logger;
    beforeEach(() => {
        log = [];
        logger = function(a){
            log.push(a)
        }
        BrokenConstructor = class extends React.Component {
            constructor(props) {
                super(props);
                logger("BrokenConstructor constructor [!]");
                throw new Error("Hello");
            }
            render() {
                logger("BrokenConstructor render");
                return <div>{this.props.children}</div>;
            }
            componentWillMount() {
                logger("BrokenConstructor componentWillMount");
            }
            componentDidMount() {
                logger("BrokenConstructor componentDidMount");
            }
            componentWillReceiveProps() {
                logger("BrokenConstructor componentWillReceiveProps");
            }
            componentWillUpdate() {
                logger("BrokenConstructor componentWillUpdate");
            }
            componentDidUpdate() {
                logger("BrokenConstructor componentDidUpdate");
            }
            componentWillUnmount() {
                logger("BrokenConstructor componentWillUnmount");
            }
        };

         BrokenComponentWillMount = class extends React.Component {
            constructor(props) {
                super(props);
                logger("BrokenComponentWillMount constructor");
            }
            render() {
                logger("BrokenComponentWillMount render");
                return <div>{this.props.children}</div>;
            }
            componentWillMount() {
                logger("BrokenComponentWillMount componentWillMount [!]");
                throw new Error("Hello");
            }
            componentDidMount() {
                logger("BrokenComponentWillMount componentDidMount");
            }
            componentWillReceiveProps() {
                logger("BrokenComponentWillMount componentWillReceiveProps");
            }
            componentWillUpdate() {
                logger("BrokenComponentWillMount componentWillUpdate");
            }
            componentDidUpdate() {
                logger("BrokenComponentWillMount componentDidUpdate");
            }
            componentWillUnmount() {
                logger("BrokenComponentWillMount componentWillUnmount");
            }
        };

        BrokenComponentDidMount = class extends React.Component {
            constructor(props) {
                super(props);
                logger("BrokenComponentDidMount constructor");
            }
            render() {
                logger("BrokenComponentDidMount render");
                return <div>{this.props.children}</div>;
            }
            componentWillMount() {
                logger("BrokenComponentDidMount componentWillMount");
            }
            componentDidMount() {
                logger("BrokenComponentDidMount componentDidMount [!]");
                throw new Error("Hello");
            }
            componentWillReceiveProps() {
                logger("BrokenComponentDidMount componentWillReceiveProps");
            }
            componentWillUpdate() {
                logger("BrokenComponentDidMount componentWillUpdate");
            }
            componentDidUpdate() {
                logger("BrokenComponentDidMount componentDidUpdate");
            }
            componentWillUnmount() {
                logger("BrokenComponentDidMount componentWillUnmount");
            }
        };

        BrokenComponentWillReceiveProps = class extends React.Component {
            constructor(props) {
                super(props);
                logger("BrokenComponentWillReceiveProps constructor");
            }
            render() {
                logger("BrokenComponentWillReceiveProps render");
                return <div>{this.props.children}</div>;
            }
            componentWillMount() {
                logger("BrokenComponentWillReceiveProps componentWillMount");
            }
            componentDidMount() {
                logger("BrokenComponentWillReceiveProps componentDidMount");
            }
            componentWillReceiveProps() {
                logger("BrokenComponentWillReceiveProps componentWillReceiveProps [!]");
                throw new Error("Hello");
            }
            componentWillUpdate() {
                logger("BrokenComponentWillReceiveProps componentWillUpdate");
            }
            componentDidUpdate() {
                logger("BrokenComponentWillReceiveProps componentDidUpdate");
            }
            componentWillUnmount() {
                logger("BrokenComponentWillReceiveProps componentWillUnmount");
            }
        };

        BrokenComponentWillUpdate = class extends React.Component {
            constructor(props) {
                super(props);
                logger("BrokenComponentWillUpdate constructor");
            }
            render() {
                logger("BrokenComponentWillUpdate render");
                return <div>{this.props.children}</div>;
            }
            componentWillMount() {
                logger("BrokenComponentWillUpdate componentWillMount");
            }
            componentDidMount() {
                logger("BrokenComponentWillUpdate componentDidMount");
            }
            componentWillReceiveProps() {
                logger("BrokenComponentWillUpdate componentWillReceiveProps");
            }
            componentWillUpdate() {
                logger("BrokenComponentWillUpdate componentWillUpdate [!]");
                throw new Error("Hello");
            }
            componentDidUpdate() {
                logger("BrokenComponentWillUpdate componentDidUpdate");
            }
            componentWillUnmount() {
                logger("BrokenComponentWillUpdate componentWillUnmount");
            }
        };

        BrokenComponentDidUpdate = class extends React.Component {
            static defaultProps = {
                errorText: "Hello"
            };
            constructor(props) {
                super(props);
                logger("BrokenComponentDidUpdate constructor");
            }
            render() {
                logger("BrokenComponentDidUpdate render");
                return <div>{this.props.children}</div>;
            }
            componentWillMount() {
                logger("BrokenComponentDidUpdate componentWillMount");
            }
            componentDidMount() {
                logger("BrokenComponentDidUpdate componentDidMount");
            }
            componentWillReceiveProps() {
                logger("BrokenComponentDidUpdate componentWillReceiveProps");
            }
            componentWillUpdate() {
                logger("BrokenComponentDidUpdate componentWillUpdate");
            }
            componentDidUpdate() {
                logger("BrokenComponentDidUpdate componentDidUpdate [!]");
                throw new Error(this.props.errorText);
            }
            componentWillUnmount() {
                logger("BrokenComponentDidUpdate componentWillUnmount");
            }
        };

        BrokenComponentWillUnmount = class extends React.Component {
            static defaultProps = {
                errorText: "Hello"
            };
            constructor(props) {
                super(props);
                logger("BrokenComponentWillUnmount constructor");
            }
            render() {
                logger("BrokenComponentWillUnmount render");
                return <div>{this.props.children}</div>;
            }
            componentWillMount() {
                logger("BrokenComponentWillUnmount componentWillMount");
            }
            componentDidMount() {
                logger("BrokenComponentWillUnmount componentDidMount");
            }
            componentWillReceiveProps() {
                logger("BrokenComponentWillUnmount componentWillReceiveProps");
            }
            componentWillUpdate() {
                logger("BrokenComponentWillUnmount componentWillUpdate");
            }
            componentDidUpdate() {
                logger("BrokenComponentWillUnmount componentDidUpdate");
            }
            componentWillUnmount() {
                logger("BrokenComponentWillUnmount componentWillUnmount [!]");
                throw new Error(this.props.errorText);
            }
        };

        BrokenComponentWillMountErrorBoundary = class extends React.Component {
            constructor(props) {
                super(props);
                this.state = { error: null };
                logger("BrokenComponentWillMountErrorBoundary constructor");
            }
            render() {
                if (this.state.error) {
                    logger("BrokenComponentWillMountErrorBoundary render error");
                    return <div>Caught an error: {this.state.error.message}.</div>;
                }
                logger("BrokenComponentWillMountErrorBoundary render success");
                return <div>{this.props.children}</div>;
            }
            componentWillMount() {
                logger("BrokenComponentWillMountErrorBoundary componentWillMount [!]");
                throw new Error("Hello");
            }
            componentDidMount() {
                logger("BrokenComponentWillMountErrorBoundary componentDidMount");
            }
            componentWillUnmount() {
                logger("BrokenComponentWillMountErrorBoundary componentWillUnmount");
            }
            componentDidCatch(error) {
                logger("BrokenComponentWillMountErrorBoundary componentDidCatch");
                this.setState({ error });
            }
        };

        BrokenComponentDidMountErrorBoundary = class extends React.Component {
            constructor(props) {
                super(props);
                this.state = { error: null };
                logger("BrokenComponentDidMountErrorBoundary constructor");
            }
            render() {
                if (this.state.error) {
                    logger("BrokenComponentDidMountErrorBoundary render error");
                    return <div>Caught an error: {this.state.error.message}.</div>;
                }
                logger("BrokenComponentDidMountErrorBoundary render success");
                return <div>{this.props.children}</div>;
            }
            componentWillMount() {
                logger("BrokenComponentDidMountErrorBoundary componentWillMount");
            }
            componentDidMount() {
                logger("BrokenComponentDidMountErrorBoundary componentDidMount [!]");
                throw new Error("Hello");
            }
            componentWillUnmount() {
                logger("BrokenComponentDidMountErrorBoundary componentWillUnmount");
            }
            componentDidCatch(error) {
                logger("BrokenComponentDidMountErrorBoundary componentDidCatch");
                this.setState({ error });
            }
        };

        BrokenRenderErrorBoundary = class extends React.Component {
            constructor(props) {
                super(props);
                this.state = { error: null };
                logger("BrokenRenderErrorBoundary constructor");
            }
            render() {
                if (this.state.error) {
                    logger("BrokenRenderErrorBoundary render error [!]");
                    throw new Error("Hello");
                }
                logger("BrokenRenderErrorBoundary render success");
                return <div>{this.props.children}</div>;
            }
            componentWillMount() {
                logger("BrokenRenderErrorBoundary componentWillMount");
            }
            componentDidMount() {
                logger("BrokenRenderErrorBoundary componentDidMount");
            }
            componentWillUnmount() {
                logger("BrokenRenderErrorBoundary componentWillUnmount");
            }
            componentDidCatch(error) {
                logger("BrokenRenderErrorBoundary componentDidCatch");
                this.setState({ error });
            }
        };

        BrokenRender = class extends React.Component {
            constructor(props) {
                super(props);
                logger("BrokenRender constructor");
            }
            render() {
                logger("BrokenRender render [!]");
                throw new Error("Hello");
            }
            componentWillMount() {
                logger("BrokenRender componentWillMount");
            }
            componentDidMount() {
                logger("BrokenRender componentDidMount");
            }
            componentWillReceiveProps() {
                logger("BrokenRender componentWillReceiveProps");
            }
            componentWillUpdate() {
                logger("BrokenRender componentWillUpdate");
            }
            componentDidUpdate() {
                logger("BrokenRender componentDidUpdate");
            }
            componentWillUnmount() {
                logger("BrokenRender componentWillUnmount");
            }
        };

        NoopErrorBoundary = class extends React.Component {
            constructor(props) {
                super(props);
                logger("NoopErrorBoundary constructor");
            }
            render() {
                logger("NoopErrorBoundary render");
                return <BrokenRender />;
            }
            componentWillMount() {
                logger("NoopErrorBoundary componentWillMount");
            }
            componentDidMount() {
                logger("NoopErrorBoundary componentDidMount");
            }
            componentWillUnmount() {
                logger("NoopErrorBoundary componentWillUnmount");
            }
            componentDidCatch() {
                logger("NoopErrorBoundary componentDidCatch");
            }
        };

        Normal = class extends React.Component {
            static defaultProps = {
                logName: "Normal"
            };
            constructor(props) {
                super(props);
                logger(`${this.props.logName} constructor`);
            }
            render() {
                logger(`${this.props.logName} render`);
                return <div>{this.props.children}</div>;
            }
            componentWillMount() {
                logger(`${this.props.logName} componentWillMount`);
            }
            componentDidMount() {
                logger(`${this.props.logName} componentDidMount`);
            }
            componentWillReceiveProps() {
                logger(`${this.props.logName} componentWillReceiveProps`);
            }
            componentWillUpdate() {
                logger(`${this.props.logName} componentWillUpdate`);
            }
            componentDidUpdate() {
                logger(`${this.props.logName} componentDidUpdate`);
            }
            componentWillUnmount() {
                logger(`${this.props.logName} componentWillUnmount`);
            }
        };

        ErrorBoundary = class extends React.Component {
            constructor(props) {
                super(props);
                this.state = { error: null };
                logger(`${this.props.logName} constructor`);
            }
            render() {
                if (this.state.error && !this.props.forceRetry) {
                    logger(`${this.props.logName} render error`);
                    return this.props.renderError(this.state.error, this.props);
                }
                logger(`${this.props.logName} render success`);
                return <div>{this.props.children}</div>;
            }
            componentDidCatch(error,info) {
                logger(`${this.props.logName} componentDidCatch`);
                this.setState({ error });
            }
            componentWillMount() {
                logger(`${this.props.logName} componentWillMount`);
            }
            componentDidMount() {
                logger(`${this.props.logName} componentDidMount`);
            }
            componentWillReceiveProps() {
                logger(`${this.props.logName} componentWillReceiveProps`);
            }
            componentWillUpdate() {
                logger(`${this.props.logName} componentWillUpdate`);
            }
            componentDidUpdate() {
                logger(`${this.props.logName} componentDidUpdate`);
            }
            componentWillUnmount() {
                logger(`${this.props.logName} componentWillUnmount`);
            }
        };
        ErrorBoundary.defaultProps = {
            logName: "ErrorBoundary",
            renderError(error, props) {
                return <div ref={props.errorMessageRef}>Caught an error: {error.message}.</div>;
            }
        };

        RetryErrorBoundary = class extends React.Component {
            constructor(props) {
                super(props);
                logger("RetryErrorBoundary constructor");
            }
            render() {
                logger("RetryErrorBoundary render");
                return <BrokenRender />;
            }
            componentWillMount() {
                logger("RetryErrorBoundary componentWillMount");
            }
            componentDidMount() {
                logger("RetryErrorBoundary componentDidMount");
            }
            componentWillUnmount() {
                logger("RetryErrorBoundary componentWillUnmount");
            }
            componentDidCatch(error) {
                logger("RetryErrorBoundary componentDidCatch [!]");
                // In Fiber, calling setState() (and failing) is treated as a rethrow.
                this.setState({});
            }
        };

        ErrorMessage = class extends React.Component {
            constructor(props) {
                super(props);
                logger("ErrorMessage constructor");
            }
            componentWillMount() {
                logger("ErrorMessage componentWillMount");
            }
            componentDidMount() {
                logger("ErrorMessage componentDidMount");
            }
            componentWillUnmount() {
                logger("ErrorMessage componentWillUnmount");
            }
            render() {
                logger("ErrorMessage render");
                return <div>Caught an error: {this.props.message}.</div>;
            }
        };
    });

    it("does not swallow exceptions on mounting without boundaries", () => {
        var container = document.createElement("div");
        expect(() => {
            ReactDOM.render(<BrokenRender />, container);
        }).toThrow("Hello");

        container = document.createElement("div");
        expect(() => {
            ReactDOM.render(<BrokenComponentWillMount />, container);
        }).toThrow("Hello");

        container = document.createElement("div");
        expect(() => {
            ReactDOM.render(<BrokenComponentDidMount />, container);
        }).toThrow("Hello");
    });

    it("does not swallow exceptions on updating without boundaries", () => {
        var container = document.createElement("div");
        ReactDOM.render(<BrokenComponentWillUpdate />, container);
        expect(() => {
            ReactDOM.render(<BrokenComponentWillUpdate />, container);
        }).toThrow("Hello");

        container = document.createElement("div");
        ReactDOM.render(<BrokenComponentWillReceiveProps />, container);
        expect(() => {
            ReactDOM.render(<BrokenComponentWillReceiveProps />, container);
        }).toThrow("Hello");

        container = document.createElement("div");
        ReactDOM.render(<BrokenComponentDidUpdate />, container);
        expect(() => {
            ReactDOM.render(<BrokenComponentDidUpdate />, container);
        }).toThrow("Hello");
    });

    it("does not swallow exceptions on unmounting without boundaries", () => {
        var container = document.createElement("div");
        ReactDOM.render(<BrokenComponentWillUnmount />, container);
        expect(() => {
            ReactDOM.unmountComponentAtNode(container);
        }).toThrow("Hello");
    });

    it("prevents errors from leaking into other roots", () => {
        var container1 = document.createElement("div");
        var container2 = document.createElement("div");
        var container3 = document.createElement("div");

        ReactDOM.render(<span>Before 1</span>, container1);
        expect(() => {
            ReactDOM.render(<BrokenRender />, container2);
        }).toThrow("Hello");
        ReactDOM.render(
            <ErrorBoundary>
                <BrokenRender />
            </ErrorBoundary>,
            container3
        );
        expect(container1.firstChild.textContent).toBe("Before 1");
        expect(container2.firstChild).toBe(null);
        expect(container3.firstChild.textContent).toBe("Caught an error: Hello.");

        ReactDOM.render(<span>After 1</span>, container1);
        ReactDOM.render(<span>After 2</span>, container2);
        ReactDOM.render(<ErrorBoundary forceRetry={true}>After 3</ErrorBoundary>, container3);
        expect(container1.firstChild.textContent).toBe("After 1");
        expect(container2.firstChild.textContent).toBe("After 2");
        expect(container3.firstChild.textContent).toBe("After 3");

        ReactDOM.unmountComponentAtNode(container1);
        ReactDOM.unmountComponentAtNode(container2);
        ReactDOM.unmountComponentAtNode(container3);
        expect(container1.firstChild).toBe(null);
        expect(container2.firstChild).toBe(null);
        expect(container3.firstChild).toBe(null);
    });

    it("renders an error state if child throws in render", () => {
        var container = document.createElement("div");
        ReactDOM.render(
            <ErrorBoundary>
                <BrokenRender />
            </ErrorBoundary>,
            container
        );
        expect(container.firstChild.textContent).toBe("Caught an error: Hello.");
        expect(log.join("\n")).toBe(
            [
                "ErrorBoundary constructor",
                "ErrorBoundary componentWillMount",
                "ErrorBoundary render success",
                "BrokenRender constructor",
                "BrokenRender componentWillMount",
                "BrokenRender render [!]",
                // Fiber mounts with null children before capturing error
                "ErrorBoundary componentDidMount",
                // Catch and render an error message
                "ErrorBoundary componentDidCatch",
                "ErrorBoundary componentWillUpdate",
                "ErrorBoundary render error",
                "ErrorBoundary componentDidUpdate"
            ].join("\n")
        );

        log.length = 0;
        ReactDOM.unmountComponentAtNode(container);
        expect(log).toEqual(["ErrorBoundary componentWillUnmount"]);
    });

    it("renders an error state if child throws in componentWillMount", () => {
        log.length = 0 
        var container = document.createElement("div");
        ReactDOM.render(
            <ErrorBoundary>
                <BrokenComponentWillMount />
            </ErrorBoundary>,
            container
        );
        console.log(container)
        expect(container.firstChild.textContent).toBe("Caught an error: Hello.");
        expect(log.join("\n")).toBe([
            "ErrorBoundary constructor",
            "ErrorBoundary componentWillMount",
            "ErrorBoundary render success",
            "BrokenComponentWillMount constructor",
            "BrokenComponentWillMount componentWillMount [!]",
            "ErrorBoundary componentDidMount",
            "ErrorBoundary componentDidCatch",
            "ErrorBoundary componentWillUpdate",
            "ErrorBoundary render error",
            "ErrorBoundary componentDidUpdate"
        ].join("\n"));

        log.length = 0;
        ReactDOM.unmountComponentAtNode(container);
        expect(log.join("\n")).toBe(["ErrorBoundary componentWillUnmount"].join("\n"));
    });

    it("renders an error state if context provider throws in componentWillMount", () => {
        class BrokenComponentWillMountWithContext extends React.Component {
            static childContextTypes = { foo: PropTypes.number };
            getChildContext() {
                return { foo: 42 };
            }
            render() {
                return <div>{this.props.children}</div>;
            }
            componentWillMount() {
                throw new Error("Hello");
            }
        }

        var container = document.createElement("div");
        ReactDOM.render(
            <ErrorBoundary>
                <BrokenComponentWillMountWithContext />
            </ErrorBoundary>,
            container
        );
        expect(container.firstChild.textContent).toBe("Caught an error: Hello.");
    });

    it("renders an error state if module-style context provider throws in componentWillMount", () => {
        function BrokenComponentWillMountWithContext() {
            return {
                getChildContext() {
                    return { foo: 42 };
                },
                render() {
                    return <div>{this.props.children}</div>;
                },
                componentWillMount() {
                    throw new Error("Hello");
                }
            };
        }
        BrokenComponentWillMountWithContext.childContextTypes = {
            foo: PropTypes.number
        };

        var container = document.createElement("div");
        ReactDOM.render(
            <ErrorBoundary>
                <BrokenComponentWillMountWithContext />
            </ErrorBoundary>,
            container
        );
        expect(container.firstChild.textContent).toBe("Caught an error: Hello.");
    });

    it("mounts the error message if mounting fails", () => {
        function renderError(error) {
            return <ErrorMessage message={error.message} />;
        }

        var container = document.createElement("div");
        ReactDOM.render(
            <ErrorBoundary renderError={renderError}>
                <BrokenRender />
            </ErrorBoundary>,
            container
        );
        expect(log.join("\n")).toBe([
            "ErrorBoundary constructor",
            "ErrorBoundary componentWillMount",
            "ErrorBoundary render success",
            "BrokenRender constructor",
            "BrokenRender componentWillMount",
            "BrokenRender render [!]",
            "ErrorBoundary componentDidMount",
            "ErrorBoundary componentDidCatch",
            "ErrorBoundary componentWillUpdate",
            "ErrorBoundary render error",
            "ErrorMessage constructor",
            "ErrorMessage componentWillMount",
            "ErrorMessage render",
            "ErrorMessage componentDidMount",
            "ErrorBoundary componentDidUpdate"
        ].join("\n"));

        log.length = 0;
        ReactDOM.unmountComponentAtNode(container);
        expect(log.join("\n")).toBe(["ErrorBoundary componentWillUnmount", "ErrorMessage componentWillUnmount"].join("\n"));
    });

    it("propagates errors on retry on mounting", () => {
        var container = document.createElement("div");
        ReactDOM.render(
            <ErrorBoundary>
                <RetryErrorBoundary>
                    <BrokenRender />
                </RetryErrorBoundary>
            </ErrorBoundary>,
            container
        );
        expect(container.firstChild.textContent).toBe("Caught an error: Hello.");
        expect(log.join("\n")).toBe([
            "ErrorBoundary constructor",
            "ErrorBoundary componentWillMount",
            "ErrorBoundary render success",
            "RetryErrorBoundary constructor",
            "RetryErrorBoundary componentWillMount",
            "RetryErrorBoundary render",
            "BrokenRender constructor",
            "BrokenRender componentWillMount",
            "BrokenRender render [!]",
            // In Fiber, failed error boundaries render null before attempting to recover
            "RetryErrorBoundary componentDidMount",
            "RetryErrorBoundary componentDidCatch [!]",
            "ErrorBoundary componentDidMount",
            // Retry
            "RetryErrorBoundary render",
            "BrokenRender constructor",
            "BrokenRender componentWillMount",
            "BrokenRender render [!]",
            // This time, the error propagates to the higher boundary
            "RetryErrorBoundary componentWillUnmount",
            "ErrorBoundary componentDidCatch",
            // Render the error
            "ErrorBoundary componentWillUpdate",
            "ErrorBoundary render error",
            "ErrorBoundary componentDidUpdate"
        ].join("\n"));

        log.length = 0;
        ReactDOM.unmountComponentAtNode(container);
        expect(log).toEqual(["ErrorBoundary componentWillUnmount"]);
    });
/*
    it("propagates errors inside boundary during componentWillMount", () => {
        var container = document.createElement("div");
        ReactDOM.render(
            <ErrorBoundary>
                <BrokenComponentWillMountErrorBoundary />
            </ErrorBoundary>,
            container
        );
        expect(container.firstChild.textContent).toBe("Caught an error: Hello.");
        expect(log.join("\n")).toBe(
            [
                "ErrorBoundary constructor",
                "ErrorBoundary componentWillMount",
                "ErrorBoundary render success",
                "BrokenComponentWillMountErrorBoundary constructor",
                "BrokenComponentWillMountErrorBoundary componentWillMount [!]",
                // The error propagates to the higher boundary
                "ErrorBoundary componentDidMount",
                "ErrorBoundary componentDidCatch",
                "ErrorBoundary componentWillUpdate",
                "ErrorBoundary render error",
                "ErrorBoundary componentDidUpdate"
            ].join("\n")
        );

        log.length = 0;
        ReactDOM.unmountComponentAtNode(container);
        expect(log + "").toBe(["ErrorBoundary componentWillUnmount"] + "");
    });

    it("propagates errors inside boundary while rendering error state", () => {
        var container = document.createElement("div");
        ReactDOM.render(
            <ErrorBoundary>
                <BrokenRenderErrorBoundary>
                    <BrokenRender />
                </BrokenRenderErrorBoundary>
            </ErrorBoundary>,
            container
        );
        expect(container.firstChild.textContent).toBe("Caught an error: Hello.");
        expect(log).toEqual([
            "ErrorBoundary constructor",
            "ErrorBoundary componentWillMount",
            "ErrorBoundary render success",
            "BrokenRenderErrorBoundary constructor",
            "BrokenRenderErrorBoundary componentWillMount",
            "BrokenRenderErrorBoundary render success",
            "BrokenRender constructor",
            "BrokenRender componentWillMount",
            "BrokenRender render [!]",
            // The first error boundary catches the error
            // It adjusts state but throws displaying the message
            // Finish mounting with null children
            "BrokenRenderErrorBoundary componentDidMount",
            // Attempt to handle the error
            "BrokenRenderErrorBoundary componentDidCatch",
            "ErrorBoundary componentDidMount",
            "BrokenRenderErrorBoundary render error [!]",
            // Boundary fails with new error, propagate to next boundary
            "BrokenRenderErrorBoundary componentWillUnmount",
            // Attempt to handle the error again
            "ErrorBoundary componentDidCatch",
            "ErrorBoundary componentWillUpdate",
            "ErrorBoundary render error",
            "ErrorBoundary componentDidUpdate"
        ]);

        log.length = 0;
        ReactDOM.unmountComponentAtNode(container);
        expect(log).toEqual(["ErrorBoundary componentWillUnmount"]);
    });
    
    it("does not call componentWillUnmount when aborting initial mount", () => {
        var container = document.createElement("div");
        ReactDOM.render(
            <ErrorBoundary>
                <Normal />
                <BrokenRender />
                <Normal />
            </ErrorBoundary>,
            container
        );
        expect(container.firstChild.textContent).toBe("Caught an error: Hello.");
        expect(log).toEqual([
            "ErrorBoundary constructor",
            "ErrorBoundary componentWillMount",
            "ErrorBoundary render success",
            // Render first child
            "Normal constructor",
            "Normal componentWillMount",
            "Normal render",
            // Render second child (it throws)
            "BrokenRender constructor",
            "BrokenRender componentWillMount",
            "BrokenRender render [!]",
            // Finish mounting with null children
            "ErrorBoundary componentDidMount",
            // Handle the error
            "ErrorBoundary componentDidCatch",
            // Render the error message
            "ErrorBoundary componentWillUpdate",
            "ErrorBoundary render error",
            "ErrorBoundary componentDidUpdate"
        ]);

        log.length = 0;
        ReactDOM.unmountComponentAtNode(container);
        expect(log).toEqual(["ErrorBoundary componentWillUnmount"]);
    });

    it("resets refs if mounting aborts", () => {
        function childRef(x) {
            logger("Child ref is set to " + x);
        }
        function errorMessageRef(x) {
            logger("Error message ref is set to " + x);
        }

        var container = document.createElement("div");
        ReactDOM.render(
            <ErrorBoundary errorMessageRef={errorMessageRef}>
                <div ref={childRef} />
                <BrokenRender />
            </ErrorBoundary>,
            container
        );
        expect(container.textContent).toBe("Caught an error: Hello.");
        expect(log).toEqual([
            "ErrorBoundary constructor",
            "ErrorBoundary componentWillMount",
            "ErrorBoundary render success",
            "BrokenRender constructor",
            "BrokenRender componentWillMount",
            "BrokenRender render [!]",
            // Handle error:
            // Finish mounting with null children
            "ErrorBoundary componentDidMount",
            // Handle the error
            "ErrorBoundary componentDidCatch",
            // Render the error message
            "ErrorBoundary componentWillUpdate",
            "ErrorBoundary render error",
            "Error message ref is set to [object HTMLDivElement]",
            "ErrorBoundary componentDidUpdate"
        ]);

        log.length = 0;
        ReactDOM.unmountComponentAtNode(container);
        expect(log).toEqual(["ErrorBoundary componentWillUnmount", "Error message ref is set to null"]);
    });

    it("successfully mounts if no error occurs", () => {
        var container = document.createElement("div");
        ReactDOM.render(
            <ErrorBoundary>
                <div>Mounted successfully.</div>
            </ErrorBoundary>,
            container
        );
        expect(container.firstChild.textContent).toBe("Mounted successfully.");
        expect(log).toEqual(["ErrorBoundary constructor", "ErrorBoundary componentWillMount", "ErrorBoundary render success", "ErrorBoundary componentDidMount"]);

        log.length = 0;
        ReactDOM.unmountComponentAtNode(container);
        expect(log).toEqual(["ErrorBoundary componentWillUnmount"]);
    });

    it("catches if child throws in constructor during update", () => {
        var container = document.createElement("div");
        ReactDOM.render(
            <ErrorBoundary>
                <Normal />
            </ErrorBoundary>,
            container
        );

        log.length = 0;
        ReactDOM.render(
            <ErrorBoundary>
                <Normal />
                <Normal logName="Normal2" />
                <BrokenConstructor />
            </ErrorBoundary>,
            container
        );
        expect(container.textContent).toBe("Caught an error: Hello.");
        expect(log).toEqual([
            "ErrorBoundary componentWillReceiveProps",
            "ErrorBoundary componentWillUpdate",
            "ErrorBoundary render success",
            "Normal componentWillReceiveProps",
            "Normal componentWillUpdate",
            "Normal render",
            // Normal2 will attempt to mount:
            "Normal2 constructor",
            "Normal2 componentWillMount",
            "Normal2 render",
            // BrokenConstructor will abort rendering:
            "BrokenConstructor constructor [!]",
            // Finish updating with null children
            "Normal componentWillUnmount",
            "ErrorBoundary componentDidUpdate",
            // Handle the error
            "ErrorBoundary componentDidCatch",
            // Render the error message
            "ErrorBoundary componentWillUpdate",
            "ErrorBoundary render error",
            "ErrorBoundary componentDidUpdate"
        ]);

        log.length = 0;
        ReactDOM.unmountComponentAtNode(container);
        expect(log).toEqual(["ErrorBoundary componentWillUnmount"]);
    });

    it("catches if child throws in componentWillMount during update", () => {
        var container = document.createElement("div");
        ReactDOM.render(
            <ErrorBoundary>
                <Normal />
            </ErrorBoundary>,
            container
        );

        log.length = 0;
        ReactDOM.render(
            <ErrorBoundary>
                <Normal />
                <Normal logName="Normal2" />
                <BrokenComponentWillMount />
            </ErrorBoundary>,
            container
        );
        expect(container.textContent).toBe("Caught an error: Hello.");
        expect(log.join("\n")).toEqual([
            "ErrorBoundary componentWillReceiveProps",
            "ErrorBoundary componentWillUpdate",
            "ErrorBoundary render success",
            "Normal componentWillReceiveProps",
            "Normal componentWillUpdate",
            "Normal render",
            // Normal2 will attempt to mount:
            "Normal2 constructor",
            "Normal2 componentWillMount",
            "Normal2 render",
            // BrokenComponentWillMount will abort rendering:
            "BrokenComponentWillMount constructor",
            "BrokenComponentWillMount componentWillMount [!]",
            // Finish updating with null children
            "Normal componentWillUnmount",
            "ErrorBoundary componentDidUpdate",
            // Handle the error
            "ErrorBoundary componentDidCatch",
            // Render the error message
            "ErrorBoundary componentWillUpdate",
            "ErrorBoundary render error",
            "ErrorBoundary componentDidUpdate"
        ].join("\n"));

        log.length = 0;
        ReactDOM.unmountComponentAtNode(container);
        expect(log).toEqual(["ErrorBoundary componentWillUnmount"]);
    });

    it("catches if child throws in componentWillReceiveProps during update", () => {
        var container = document.createElement("div");
        ReactDOM.render(
            <ErrorBoundary>
                <Normal />
                <BrokenComponentWillReceiveProps />
            </ErrorBoundary>,
            container
        );

        log.length = 0;
        ReactDOM.render(
            <ErrorBoundary>
                <Normal />
                <BrokenComponentWillReceiveProps />
            </ErrorBoundary>,
            container
        );
        expect(container.textContent).toBe("Caught an error: Hello.");
        expect(log).toEqual([
            "ErrorBoundary componentWillReceiveProps",
            "ErrorBoundary componentWillUpdate",
            "ErrorBoundary render success",
            "Normal componentWillReceiveProps",
            "Normal componentWillUpdate",
            "Normal render",
            // BrokenComponentWillReceiveProps will abort rendering:
            "BrokenComponentWillReceiveProps componentWillReceiveProps [!]",
            // Finish updating with null children
            "Normal componentWillUnmount",
            "BrokenComponentWillReceiveProps componentWillUnmount",
            "ErrorBoundary componentDidUpdate",
            // Handle the error
            "ErrorBoundary componentDidCatch",
            "ErrorBoundary componentWillUpdate",
            "ErrorBoundary render error",
            "ErrorBoundary componentDidUpdate"
        ]);

        log.length = 0;
        ReactDOM.unmountComponentAtNode(container);
        expect(log).toEqual(["ErrorBoundary componentWillUnmount"]);
    });

    it("catches if child throws in componentWillUpdate during update", () => {
        var container = document.createElement("div");
        ReactDOM.render(
            <ErrorBoundary>
                <Normal />
                <BrokenComponentWillUpdate />
            </ErrorBoundary>,
            container
        );

        log.length = 0;
        ReactDOM.render(
            <ErrorBoundary>
                <Normal />
                <BrokenComponentWillUpdate />
            </ErrorBoundary>,
            container
        );
        expect(container.textContent).toBe("Caught an error: Hello.");
        expect(log).toEqual([
            "ErrorBoundary componentWillReceiveProps",
            "ErrorBoundary componentWillUpdate",
            "ErrorBoundary render success",
            "Normal componentWillReceiveProps",
            "Normal componentWillUpdate",
            "Normal render",
            // BrokenComponentWillUpdate will abort rendering:
            "BrokenComponentWillUpdate componentWillReceiveProps",
            "BrokenComponentWillUpdate componentWillUpdate [!]",
            // Finish updating with null children
            "Normal componentWillUnmount",
            "BrokenComponentWillUpdate componentWillUnmount",
            "ErrorBoundary componentDidUpdate",
            // Handle the error
            "ErrorBoundary componentDidCatch",
            "ErrorBoundary componentWillUpdate",
            "ErrorBoundary render error",
            "ErrorBoundary componentDidUpdate"
        ]);

        log.length = 0;
        ReactDOM.unmountComponentAtNode(container);
        expect(log).toEqual(["ErrorBoundary componentWillUnmount"]);
    });

    it("catches if child throws in render during update", () => {
        var container = document.createElement("div");
        ReactDOM.render(
            <ErrorBoundary>
                <Normal />
            </ErrorBoundary>,
            container
        );

        log.length = 0;
        ReactDOM.render(
            <ErrorBoundary>
                <Normal />
                <Normal logName="Normal2" />
                <BrokenRender />
            </ErrorBoundary>,
            container
        );
        expect(container.textContent).toBe("Caught an error: Hello.");
        expect(log).toEqual([
            "ErrorBoundary componentWillReceiveProps",
            "ErrorBoundary componentWillUpdate",
            "ErrorBoundary render success",
            "Normal componentWillReceiveProps",
            "Normal componentWillUpdate",
            "Normal render",
            // Normal2 will attempt to mount:
            "Normal2 constructor",
            "Normal2 componentWillMount",
            "Normal2 render",
            // BrokenRender will abort rendering:
            "BrokenRender constructor",
            "BrokenRender componentWillMount",
            "BrokenRender render [!]",
            // Finish updating with null children
            "Normal componentWillUnmount",
            "ErrorBoundary componentDidUpdate",
            // Handle the error
            "ErrorBoundary componentDidCatch",
            "ErrorBoundary componentWillUpdate",
            "ErrorBoundary render error",
            "ErrorBoundary componentDidUpdate"
        ]);

        log.length = 0;
        ReactDOM.unmountComponentAtNode(container);
        expect(log).toEqual(["ErrorBoundary componentWillUnmount"]);
    });

    it("keeps refs up-to-date during updates", () => {
        function child1Ref(x) {
            logger("Child1 ref is set to " + x);
        }
        function child2Ref(x) {
            logger("Child2 ref is set to " + x);
        }
        function errorMessageRef(x) {
            logger("Error message ref is set to " + x);
        }

        var container = document.createElement("div");
        ReactDOM.render(
            <ErrorBoundary errorMessageRef={errorMessageRef}>
                <div ref={child1Ref} />
            </ErrorBoundary>,
            container
        );
        expect(log).toEqual([
            "ErrorBoundary constructor",
            "ErrorBoundary componentWillMount",
            "ErrorBoundary render success",
            "Child1 ref is set to [object HTMLDivElement]",
            "ErrorBoundary componentDidMount"
        ]);

        log.length = 0;
        ReactDOM.render(
            <ErrorBoundary errorMessageRef={errorMessageRef}>
                <div ref={child1Ref} />
                <div ref={child2Ref} />
                <BrokenRender />
            </ErrorBoundary>,
            container
        );
        expect(container.textContent).toBe("Caught an error: Hello.");
        expect(log).toEqual([
            "ErrorBoundary componentWillReceiveProps",
            "ErrorBoundary componentWillUpdate",
            "ErrorBoundary render success",
            // BrokenRender will abort rendering:
            "BrokenRender constructor",
            "BrokenRender componentWillMount",
            "BrokenRender render [!]",
            // Finish updating with null children
            "Child1 ref is set to null",
            "ErrorBoundary componentDidUpdate",
            // Handle the error
            "ErrorBoundary componentDidCatch",
            "ErrorBoundary componentWillUpdate",
            "ErrorBoundary render error",
            "Error message ref is set to [object HTMLDivElement]",
            // Child2 ref is never set because its mounting aborted
            "ErrorBoundary componentDidUpdate"
        ]);

        log.length = 0;
        ReactDOM.unmountComponentAtNode(container);
        expect(log).toEqual(["ErrorBoundary componentWillUnmount", "Error message ref is set to null"]);
    });

    it("recovers from componentWillUnmount errors on update", () => {
        var container = document.createElement("div");
        ReactDOM.render(
            <ErrorBoundary>
                <BrokenComponentWillUnmount />
                <BrokenComponentWillUnmount />
                <Normal />
            </ErrorBoundary>,
            container
        );

        log.length = 0;
        ReactDOM.render(
            <ErrorBoundary>
                <BrokenComponentWillUnmount />
            </ErrorBoundary>,
            container
        );
        expect(container.textContent).toBe("Caught an error: Hello.");
        expect(log).toEqual([
            "ErrorBoundary componentWillReceiveProps",
            "ErrorBoundary componentWillUpdate",
            "ErrorBoundary render success",
            // Update existing child:
            "BrokenComponentWillUnmount componentWillReceiveProps",
            "BrokenComponentWillUnmount componentWillUpdate",
            "BrokenComponentWillUnmount render",
            // Unmounting throws:
            "BrokenComponentWillUnmount componentWillUnmount [!]",
            // Fiber proceeds with lifecycles despite errors
            "Normal componentWillUnmount",
            // The components have updated in this phase
            "BrokenComponentWillUnmount componentDidUpdate",
            "ErrorBoundary componentDidUpdate",
            // Now that commit phase is done, Fiber unmounts the boundary's children
            "BrokenComponentWillUnmount componentWillUnmount [!]",
            "ErrorBoundary componentDidCatch",
            // The initial render was aborted, so
            // Fiber retries from the root.
            "ErrorBoundary componentWillUpdate",
            // Render an error now (stack will do it later)
            "ErrorBoundary render error",
            // Attempt to unmount previous child:
            // Done
            "ErrorBoundary componentDidUpdate"
        ]);

        log.length = 0;
        ReactDOM.unmountComponentAtNode(container);
        expect(log).toEqual(["ErrorBoundary componentWillUnmount"]);
    });

    it("recovers from nested componentWillUnmount errors on update", () => {
        var container = document.createElement("div");
        ReactDOM.render(
            <ErrorBoundary>
                <Normal>
                    <BrokenComponentWillUnmount />
                </Normal>
                <BrokenComponentWillUnmount />
            </ErrorBoundary>,
            container
        );

        log.length = 0;
        ReactDOM.render(
            <ErrorBoundary>
                <Normal>
                    <BrokenComponentWillUnmount />
                </Normal>
            </ErrorBoundary>,
            container
        );
        expect(container.textContent).toBe("Caught an error: Hello.");
        expect(log).toEqual([
            "ErrorBoundary componentWillReceiveProps",
            "ErrorBoundary componentWillUpdate",
            "ErrorBoundary render success",
            // Update existing children:
            "Normal componentWillReceiveProps",
            "Normal componentWillUpdate",
            "Normal render",
            "BrokenComponentWillUnmount componentWillReceiveProps",
            "BrokenComponentWillUnmount componentWillUpdate",
            "BrokenComponentWillUnmount render",
            // Unmounting throws:
            "BrokenComponentWillUnmount componentWillUnmount [!]",
            // Fiber proceeds with lifecycles despite errors
            "BrokenComponentWillUnmount componentDidUpdate",
            "Normal componentDidUpdate",
            "ErrorBoundary componentDidUpdate",
            "Normal componentWillUnmount",
            "BrokenComponentWillUnmount componentWillUnmount [!]",
            // Now that commit phase is done, Fiber handles errors
            "ErrorBoundary componentDidCatch",
            // The initial render was aborted, so
            // Fiber retries from the root.
            "ErrorBoundary componentWillUpdate",
            // Render an error now (stack will do it later)
            "ErrorBoundary render error",
            // Done
            "ErrorBoundary componentDidUpdate"
        ]);

        log.length = 0;
        ReactDOM.unmountComponentAtNode(container);
        expect(log).toEqual(["ErrorBoundary componentWillUnmount"]);
    });

    it("picks the right boundary when handling unmounting errors", () => {
        function renderInnerError(error) {
            return <div>Caught an inner error: {error.message}.</div>;
        }
        function renderOuterError(error) {
            return <div>Caught an outer error: {error.message}.</div>;
        }

        var container = document.createElement("div");
        ReactDOM.render(
            <ErrorBoundary logName="OuterErrorBoundary" renderError={renderOuterError}>
                <ErrorBoundary logName="InnerErrorBoundary" renderError={renderInnerError}>
                    <BrokenComponentWillUnmount />
                </ErrorBoundary>
            </ErrorBoundary>,
            container
        );

        log.length = 0;
        ReactDOM.render(
            <ErrorBoundary logName="OuterErrorBoundary" renderError={renderOuterError}>
                <ErrorBoundary logName="InnerErrorBoundary" renderError={renderInnerError} />
            </ErrorBoundary>,
            container
        );
        expect(container.textContent).toBe("Caught an inner error: Hello.");
        expect(log).toEqual([
            // Update outer boundary
            "OuterErrorBoundary componentWillReceiveProps",
            "OuterErrorBoundary componentWillUpdate",
            "OuterErrorBoundary render success",
            // Update inner boundary
            "InnerErrorBoundary componentWillReceiveProps",
            "InnerErrorBoundary componentWillUpdate",
            "InnerErrorBoundary render success",
            // Try unmounting child
            "BrokenComponentWillUnmount componentWillUnmount [!]",
            // Fiber proceeds with lifecycles despite errors
            // Inner and outer boundaries have updated in this phase
            "InnerErrorBoundary componentDidUpdate",
            "OuterErrorBoundary componentDidUpdate",
            // Now that commit phase is done, Fiber handles errors
            // Only inner boundary receives the error:
            "InnerErrorBoundary componentDidCatch",
            "InnerErrorBoundary componentWillUpdate",
            // Render an error now
            "InnerErrorBoundary render error",
            // In Fiber, this was a local update to the
            // inner boundary so only its hook fires
            "InnerErrorBoundary componentDidUpdate"
        ]);

        log.length = 0;
        ReactDOM.unmountComponentAtNode(container);
        expect(log).toEqual(["OuterErrorBoundary componentWillUnmount", "InnerErrorBoundary componentWillUnmount"]);
    });

    it("can recover from error state", () => {
        var container = document.createElement("div");
        ReactDOM.render(
            <ErrorBoundary>
                <BrokenRender />
            </ErrorBoundary>,
            container
        );

        ReactDOM.render(
            <ErrorBoundary>
                <Normal />
            </ErrorBoundary>,
            container
        );
        // Error boundary doesn't retry by itself:
        expect(container.textContent).toBe("Caught an error: Hello.");

        // Force the success path:
        log.length = 0;
        ReactDOM.render(
            <ErrorBoundary forceRetry={true}>
                <Normal />
            </ErrorBoundary>,
            container
        );
        expect(container.textContent).not.toContain("Caught an error");
        expect(log).toEqual([
            "ErrorBoundary componentWillReceiveProps",
            "ErrorBoundary componentWillUpdate",
            "ErrorBoundary render success",
            // Mount children:
            "Normal constructor",
            "Normal componentWillMount",
            "Normal render",
            // Finalize updates:
            "Normal componentDidMount",
            "ErrorBoundary componentDidUpdate"
        ]);

        log.length = 0;
        ReactDOM.unmountComponentAtNode(container);
        expect(log).toEqual(["ErrorBoundary componentWillUnmount", "Normal componentWillUnmount"]);
    });

    it("can update multiple times in error state", () => {
        var container = document.createElement("div");
        ReactDOM.render(
            <ErrorBoundary>
                <BrokenRender />
            </ErrorBoundary>,
            container
        );
        expect(container.textContent).toBe("Caught an error: Hello.");

        ReactDOM.render(
            <ErrorBoundary>
                <BrokenRender />
            </ErrorBoundary>,
            container
        );
        expect(container.textContent).toBe("Caught an error: Hello.");

        ReactDOM.render(<div>Other screen</div>, container);
        expect(container.textContent).toBe("Other screen");

        ReactDOM.unmountComponentAtNode(container);
    });

    it("doesn't get into inconsistent state during removals", () => {
        var container = document.createElement("div");
        ReactDOM.render(
            <ErrorBoundary>
                <Normal />
                <BrokenComponentWillUnmount />
                <Normal />
            </ErrorBoundary>,
            container
        );

        ReactDOM.render(<ErrorBoundary />, container);
        expect(container.textContent).toBe("Caught an error: Hello.");

        log.length = 0;
        ReactDOM.unmountComponentAtNode(container);
        expect(log).toEqual(["ErrorBoundary componentWillUnmount"]);
    });

    it("doesn't get into inconsistent state during additions", () => {
        var container = document.createElement("div");
        ReactDOM.render(<ErrorBoundary />, container);
        ReactDOM.render(
            <ErrorBoundary>
                <Normal />
                <BrokenRender />
                <Normal />
            </ErrorBoundary>,
            container
        );
        expect(container.textContent).toBe("Caught an error: Hello.");

        log.length = 0;
        ReactDOM.unmountComponentAtNode(container);
        expect(log).toEqual(["ErrorBoundary componentWillUnmount"]);
    });

    it("doesn't get into inconsistent state during reorders", () => {
        function getAMixOfNormalAndBrokenRenderElements() {
            var elements = [];
            for (var i = 0; i < 100; i++) {
                elements.push(<Normal key={i} />);
            }
            elements.push(<MaybeBrokenRender key={100} />);

            var currentIndex = elements.length;
            while (0 !== currentIndex) {
                var randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                var temporaryValue = elements[currentIndex];
                elements[currentIndex] = elements[randomIndex];
                elements[randomIndex] = temporaryValue;
            }
            return elements;
        }

        class MaybeBrokenRender extends React.Component {
            render() {
                if (fail) {
                    throw new Error("Hello");
                }
                return <div>{this.props.children}</div>;
            }
        }

        var fail = false;
        var container = document.createElement("div");
        ReactDOM.render(<ErrorBoundary>{getAMixOfNormalAndBrokenRenderElements()}</ErrorBoundary>, container);
        expect(container.textContent).not.toContain("Caught an error");

        fail = true;
        ReactDOM.render(<ErrorBoundary>{getAMixOfNormalAndBrokenRenderElements()}</ErrorBoundary>, container);
        expect(container.textContent).toBe("Caught an error: Hello.");

        log.length = 0;
        ReactDOM.unmountComponentAtNode(container);
        expect(log).toEqual(["ErrorBoundary componentWillUnmount"]);
    });

    it("catches errors originating downstream", () => {
        var fail = false;
        class Stateful extends React.Component {
            state = { shouldThrow: false };

            render() {
                if (fail) {
                    logger("Stateful render [!]");
                    throw new Error("Hello");
                }
                return <div>{this.props.children}</div>;
            }
        }

        var statefulInst;
        var container = document.createElement("div");
        ReactDOM.render(
            <ErrorBoundary>
                <Stateful ref={inst => (statefulInst = inst)} />
            </ErrorBoundary>,
            container
        );

        log.length = 0;
        expect(() => {
            fail = true;
            statefulInst.forceUpdate();
        }).not.toThrow();

        expect(log).toEqual(["Stateful render [!]", "ErrorBoundary componentDidCatch", "ErrorBoundary componentWillUpdate", "ErrorBoundary render error", "ErrorBoundary componentDidUpdate"]);

        log.length = 0;
        ReactDOM.unmountComponentAtNode(container);
        expect(log).toEqual(["ErrorBoundary componentWillUnmount"]);
    });

    it("catches errors in componentDidMount", () => {
        var container = document.createElement("div");
        ReactDOM.render(
            <ErrorBoundary>
                <BrokenComponentWillUnmount>
                    <Normal />
                </BrokenComponentWillUnmount>
                <BrokenComponentDidMount />
                <Normal logName="LastChild" />
            </ErrorBoundary>,
            container
        );
        expect(log).toEqual([
            "ErrorBoundary constructor",
            "ErrorBoundary componentWillMount",
            "ErrorBoundary render success",
            "BrokenComponentWillUnmount constructor",
            "BrokenComponentWillUnmount componentWillMount",
            "BrokenComponentWillUnmount render",
            "Normal constructor",
            "Normal componentWillMount",
            "Normal render",
            "BrokenComponentDidMount constructor",
            "BrokenComponentDidMount componentWillMount",
            "BrokenComponentDidMount render",
            "LastChild constructor",
            "LastChild componentWillMount",
            "LastChild render",
            // Start flushing didMount queue
            "Normal componentDidMount",
            "BrokenComponentWillUnmount componentDidMount",
            "BrokenComponentDidMount componentDidMount [!]",
            // Continue despite the error
            "LastChild componentDidMount",
            "ErrorBoundary componentDidMount",
            // Now we are ready to handle the error
            // Safely unmount every child
            "BrokenComponentWillUnmount componentWillUnmount [!]",
            // Continue unmounting safely despite any errors
            "Normal componentWillUnmount",
            "BrokenComponentDidMount componentWillUnmount",
            "LastChild componentWillUnmount",
            // Handle the error
            "ErrorBoundary componentDidCatch",
            "ErrorBoundary componentWillUpdate",
            "ErrorBoundary render error",
            // The update has finished
            "ErrorBoundary componentDidUpdate"
        ]);

        log.length = 0;
        ReactDOM.unmountComponentAtNode(container);
        expect(log).toEqual(["ErrorBoundary componentWillUnmount"]);
    });

    it("catches errors in componentDidUpdate", () => {
        var container = document.createElement("div");
        ReactDOM.render(
            <ErrorBoundary>
                <BrokenComponentDidUpdate />
            </ErrorBoundary>,
            container
        );

        log.length = 0;
        ReactDOM.render(
            <ErrorBoundary>
                <BrokenComponentDidUpdate />
            </ErrorBoundary>,
            container
        );
        expect(log).toEqual([
            "ErrorBoundary componentWillReceiveProps",
            "ErrorBoundary componentWillUpdate",
            "ErrorBoundary render success",
            "BrokenComponentDidUpdate componentWillReceiveProps",
            "BrokenComponentDidUpdate componentWillUpdate",
            "BrokenComponentDidUpdate render",
            // All lifecycles run
            "BrokenComponentDidUpdate componentDidUpdate [!]",
            "ErrorBoundary componentDidUpdate",
            "BrokenComponentDidUpdate componentWillUnmount",
            // Then, error is handled
            "ErrorBoundary componentDidCatch",
            "ErrorBoundary componentWillUpdate",
            "ErrorBoundary render error",
            "ErrorBoundary componentDidUpdate"
        ]);

        log.length = 0;
        ReactDOM.unmountComponentAtNode(container);
        expect(log).toEqual(["ErrorBoundary componentWillUnmount"]);
    });

    it("propagates errors inside boundary during componentDidMount", () => {
        var container = document.createElement("div");
        ReactDOM.render(
            <ErrorBoundary>
                <BrokenComponentDidMountErrorBoundary renderError={error => <div>We should never catch our own error: {error.message}.</div>} />
            </ErrorBoundary>,
            container
        );
        expect(container.firstChild.textContent).toBe("Caught an error: Hello.");
        expect(log).toEqual([
            "ErrorBoundary constructor",
            "ErrorBoundary componentWillMount",
            "ErrorBoundary render success",
            "BrokenComponentDidMountErrorBoundary constructor",
            "BrokenComponentDidMountErrorBoundary componentWillMount",
            "BrokenComponentDidMountErrorBoundary render success",
            "BrokenComponentDidMountErrorBoundary componentDidMount [!]",
            // Fiber proceeds with the hooks
            "ErrorBoundary componentDidMount",
            "BrokenComponentDidMountErrorBoundary componentWillUnmount",
            // The error propagates to the higher boundary
            "ErrorBoundary componentDidCatch",
            // Fiber retries from the root
            "ErrorBoundary componentWillUpdate",
            "ErrorBoundary render error",
            "ErrorBoundary componentDidUpdate"
        ]);

        log.length = 0;
        ReactDOM.unmountComponentAtNode(container);
        expect(log).toEqual(["ErrorBoundary componentWillUnmount"]);
    });

    it("lets different boundaries catch their own first errors", () => {
        function renderUnmountError(error) {
            return <div>Caught an unmounting error: {error.message}.</div>;
        }
        function renderUpdateError(error) {
            return <div>Caught an updating error: {error.message}.</div>;
        }

        var container = document.createElement("div");
        ReactDOM.render(
            <ErrorBoundary logName="OuterErrorBoundary">
                <ErrorBoundary logName="InnerUnmountBoundary" renderError={renderUnmountError}>
                    <BrokenComponentWillUnmount errorText="E1" />
                    <BrokenComponentWillUnmount errorText="E2" />
                </ErrorBoundary>
                <ErrorBoundary logName="InnerUpdateBoundary" renderError={renderUpdateError}>
                    <BrokenComponentDidUpdate errorText="E3" />
                    <BrokenComponentDidUpdate errorText="E4" />
                </ErrorBoundary>
            </ErrorBoundary>,
            container
        );

        log.length = 0;
        ReactDOM.render(
            <ErrorBoundary logName="OuterErrorBoundary">
                <ErrorBoundary logName="InnerUnmountBoundary" renderError={renderUnmountError} />
                <ErrorBoundary logName="InnerUpdateBoundary" renderError={renderUpdateError}>
                    <BrokenComponentDidUpdate errorText="E3" />
                    <BrokenComponentDidUpdate errorText="E4" />
                </ErrorBoundary>
            </ErrorBoundary>,
            container
        );

        expect(container.firstChild.textContent).toBe("Caught an unmounting error: E1." + "Caught an updating error: E3.");
        expect(log).toEqual([
            // Begin update phase
            "OuterErrorBoundary componentWillReceiveProps",
            "OuterErrorBoundary componentWillUpdate",
            "OuterErrorBoundary render success",
            "InnerUnmountBoundary componentWillReceiveProps",
            "InnerUnmountBoundary componentWillUpdate",
            "InnerUnmountBoundary render success",
            "InnerUpdateBoundary componentWillReceiveProps",
            "InnerUpdateBoundary componentWillUpdate",
            "InnerUpdateBoundary render success",
            // First come the updates
            "BrokenComponentDidUpdate componentWillReceiveProps",
            "BrokenComponentDidUpdate componentWillUpdate",
            "BrokenComponentDidUpdate render",
            "BrokenComponentDidUpdate componentWillReceiveProps",
            "BrokenComponentDidUpdate componentWillUpdate",
            "BrokenComponentDidUpdate render",
            // We're in commit phase now, deleting
            "BrokenComponentWillUnmount componentWillUnmount [!]",
            "BrokenComponentWillUnmount componentWillUnmount [!]",
            // Continue despite errors, handle them after commit is done
            "InnerUnmountBoundary componentDidUpdate",
            // We're still in commit phase, now calling update lifecycles
            "BrokenComponentDidUpdate componentDidUpdate [!]",
            // Again, continue despite errors, we'll handle them later
            "BrokenComponentDidUpdate componentDidUpdate [!]",
            "InnerUpdateBoundary componentDidUpdate",
            "OuterErrorBoundary componentDidUpdate",
            // After the commit phase, attempt to recover from any errors that
            // were captured
            "BrokenComponentDidUpdate componentWillUnmount",
            "BrokenComponentDidUpdate componentWillUnmount",
            "InnerUnmountBoundary componentDidCatch",
            "InnerUpdateBoundary componentDidCatch",
            "InnerUnmountBoundary componentWillUpdate",
            "InnerUnmountBoundary render error",
            "InnerUpdateBoundary componentWillUpdate",
            "InnerUpdateBoundary render error",
            "InnerUnmountBoundary componentDidUpdate",
            "InnerUpdateBoundary componentDidUpdate"
        ]);

        log.length = 0;
        ReactDOM.unmountComponentAtNode(container);
        expect(log).toEqual(["OuterErrorBoundary componentWillUnmount", "InnerUnmountBoundary componentWillUnmount", "InnerUpdateBoundary componentWillUnmount"]);
    });

    it("discards a bad root if the root component fails", () => {
        spyOn(console, "error");

        const X = null;
        const Y = undefined;
        let err1;
        let err2;

        try {
            let container = document.createElement("div");
            ReactDOM.render(<X />, container);
        } catch (err) {
            err1 = err;
        }
        try {
            let container = document.createElement("div");
            ReactDOM.render(<Y />, container);
        } catch (err) {
            err2 = err;
        }

        expect(err1.message).toMatch(/got: null/);
        expect(err2.message).toMatch(/got: undefined/);
    });

    it("renders empty output if error boundary does not handle the error", () => {
        var container = document.createElement("div");
        ReactDOM.render(
            <div>
                Sibling
                <NoopErrorBoundary>
                    <BrokenRender />
                </NoopErrorBoundary>
            </div>,
            container
        );
        expect(container.firstChild.textContent).toBe("Sibling");
        expect(log).toEqual([
            "NoopErrorBoundary constructor",
            "NoopErrorBoundary componentWillMount",
            "NoopErrorBoundary render",
            "BrokenRender constructor",
            "BrokenRender componentWillMount",
            "BrokenRender render [!]",
            // In Fiber, noop error boundaries render null
            "NoopErrorBoundary componentDidMount",
            "NoopErrorBoundary componentDidCatch"
            // Nothing happens.
        ]);

        log.length = 0;
        ReactDOM.unmountComponentAtNode(container);
        expect(log).toEqual(["NoopErrorBoundary componentWillUnmount"]);
    });

    it("passes first error when two errors happen in commit", () => {
        const errors = [];
        let caughtError;
        class Parent extends React.Component {
            render() {
                return <Child />;
            }
            componentDidMount() {
                errors.push("parent sad");
                throw new Error("parent sad");
            }
        }
        class Child extends React.Component {
            render() {
                return <div />;
            }
            componentDidMount() {
                errors.push("child sad");
                throw new Error("child sad");
            }
        }

        var container = document.createElement("div");
        try {
            // Here, we test the behavior where there is no error boundary and we
            // delegate to the host root.
            ReactDOM.render(<Parent />, container);
        } catch (e) {
            if (e.message !== "parent sad" && e.message !== "child sad") {
                throw e;
            }
            caughtError = e;
        }

        expect(errors).toEqual(["child sad", "parent sad"]);
        // Error should be the first thrown
        expect(caughtError.message).toBe("child sad");
    });
    */
});



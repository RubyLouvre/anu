import React from "dist/React";
import getTestDocument from "./getTestDocument";
import ReactTestUtils from "lib/ReactTestUtils";
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

    beforeEach(() => {
        log = [];

        BrokenConstructor = class extends React.Component {
            constructor(props) {
                super(props);
                log.push("BrokenConstructor constructor [!]");
                throw new Error("Hello");
            }
            render() {
                log.push("BrokenConstructor render");
                return <div>{this.props.children}</div>;
            }
            componentWillMount() {
                log.push("BrokenConstructor componentWillMount");
            }
            componentDidMount() {
                log.push("BrokenConstructor componentDidMount");
            }
            componentWillReceiveProps() {
                log.push("BrokenConstructor componentWillReceiveProps");
            }
            componentWillUpdate() {
                log.push("BrokenConstructor componentWillUpdate");
            }
            componentDidUpdate() {
                log.push("BrokenConstructor componentDidUpdate");
            }
            componentWillUnmount() {
                log.push("BrokenConstructor componentWillUnmount");
            }
        };

        BrokenComponentWillMount = class extends React.Component {
            constructor(props) {
                super(props);
                log.push("BrokenComponentWillMount constructor");
            }
            render() {
                log.push("BrokenComponentWillMount render");
                return <div>{this.props.children}</div>;
            }
            componentWillMount() {
                log.push("BrokenComponentWillMount componentWillMount [!]");
                throw new Error("Hello");
            }
            componentDidMount() {
                log.push("BrokenComponentWillMount componentDidMount");
            }
            componentWillReceiveProps() {
                log.push("BrokenComponentWillMount componentWillReceiveProps");
            }
            componentWillUpdate() {
                log.push("BrokenComponentWillMount componentWillUpdate");
            }
            componentDidUpdate() {
                log.push("BrokenComponentWillMount componentDidUpdate");
            }
            componentWillUnmount() {
                log.push("BrokenComponentWillMount componentWillUnmount");
            }
        };

        BrokenComponentDidMount = class extends React.Component {
            constructor(props) {
                super(props);
                log.push("BrokenComponentDidMount constructor");
            }
            render() {
                log.push("BrokenComponentDidMount render");
                return <div>{this.props.children}</div>;
            }
            componentWillMount() {
                log.push("BrokenComponentDidMount componentWillMount");
            }
            componentDidMount() {
                log.push("BrokenComponentDidMount componentDidMount [!]");
                throw new Error("Hello");
            }
            componentWillReceiveProps() {
                log.push("BrokenComponentDidMount componentWillReceiveProps");
            }
            componentWillUpdate() {
                log.push("BrokenComponentDidMount componentWillUpdate");
            }
            componentDidUpdate() {
                log.push("BrokenComponentDidMount componentDidUpdate");
            }
            componentWillUnmount() {
                log.push("BrokenComponentDidMount componentWillUnmount");
            }
        };

        BrokenComponentWillReceiveProps = class extends React.Component {
            constructor(props) {
                super(props);
                log.push("BrokenComponentWillReceiveProps constructor");
            }
            render() {
                log.push("BrokenComponentWillReceiveProps render");
                return <div>{this.props.children}</div>;
            }
            componentWillMount() {
                log.push("BrokenComponentWillReceiveProps componentWillMount");
            }
            componentDidMount() {
                log.push("BrokenComponentWillReceiveProps componentDidMount");
            }
            componentWillReceiveProps() {
                log.push("BrokenComponentWillReceiveProps componentWillReceiveProps [!]");
                throw new Error("Hello");
            }
            componentWillUpdate() {
                log.push("BrokenComponentWillReceiveProps componentWillUpdate");
            }
            componentDidUpdate() {
                log.push("BrokenComponentWillReceiveProps componentDidUpdate");
            }
            componentWillUnmount() {
                log.push("BrokenComponentWillReceiveProps componentWillUnmount");
            }
        };

        BrokenComponentWillUpdate = class extends React.Component {
            constructor(props) {
                super(props);
                log.push("BrokenComponentWillUpdate constructor");
            }
            render() {
                log.push("BrokenComponentWillUpdate render");
                return <div>{this.props.children}</div>;
            }
            componentWillMount() {
                log.push("BrokenComponentWillUpdate componentWillMount");
            }
            componentDidMount() {
                log.push("BrokenComponentWillUpdate componentDidMount");
            }
            componentWillReceiveProps() {
                log.push("BrokenComponentWillUpdate componentWillReceiveProps");
            }
            componentWillUpdate() {
                log.push("BrokenComponentWillUpdate componentWillUpdate [!]");
                throw new Error("Hello");
            }
            componentDidUpdate() {
                log.push("BrokenComponentWillUpdate componentDidUpdate");
            }
            componentWillUnmount() {
                log.push("BrokenComponentWillUpdate componentWillUnmount");
            }
        };

        BrokenComponentDidUpdate = class extends React.Component {
            static defaultProps = {
                errorText: "Hello"
            };
            constructor(props) {
                super(props);
                log.push("BrokenComponentDidUpdate constructor");
            }
            render() {
                log.push("BrokenComponentDidUpdate render");
                return <div>{this.props.children}</div>;
            }
            componentWillMount() {
                log.push("BrokenComponentDidUpdate componentWillMount");
            }
            componentDidMount() {
                log.push("BrokenComponentDidUpdate componentDidMount");
            }
            componentWillReceiveProps() {
                log.push("BrokenComponentDidUpdate componentWillReceiveProps");
            }
            componentWillUpdate() {
                log.push("BrokenComponentDidUpdate componentWillUpdate");
            }
            componentDidUpdate() {
                log.push("BrokenComponentDidUpdate componentDidUpdate [!]");
                throw new Error(this.props.errorText);
            }
            componentWillUnmount() {
                log.push("BrokenComponentDidUpdate componentWillUnmount");
            }
        };

        BrokenComponentWillUnmount = class extends React.Component {
            static defaultProps = {
                errorText: "Hello"
            };
            constructor(props) {
                super(props);
                log.push("BrokenComponentWillUnmount constructor");
            }
            render() {
                log.push("BrokenComponentWillUnmount render");
                return <div>{this.props.children}</div>;
            }
            componentWillMount() {
                log.push("BrokenComponentWillUnmount componentWillMount");
            }
            componentDidMount() {
                log.push("BrokenComponentWillUnmount componentDidMount");
            }
            componentWillReceiveProps() {
                log.push("BrokenComponentWillUnmount componentWillReceiveProps");
            }
            componentWillUpdate() {
                log.push("BrokenComponentWillUnmount componentWillUpdate");
            }
            componentDidUpdate() {
                log.push("BrokenComponentWillUnmount componentDidUpdate");
            }
            componentWillUnmount() {
                log.push("BrokenComponentWillUnmount componentWillUnmount [!]");
                throw new Error(this.props.errorText);
            }
        };

        BrokenComponentWillMountErrorBoundary = class extends React.Component {
            constructor(props) {
                super(props);
                this.state = { error: null };
                log.push("BrokenComponentWillMountErrorBoundary constructor");
            }
            render() {
                if (this.state.error) {
                    log.push("BrokenComponentWillMountErrorBoundary render error");
                    return <div>Caught an error: {this.state.error.message}.</div>;
                }
                log.push("BrokenComponentWillMountErrorBoundary render success");
                return <div>{this.props.children}</div>;
            }
            componentWillMount() {
                log.push("BrokenComponentWillMountErrorBoundary componentWillMount [!]");
                throw new Error("Hello");
            }
            componentDidMount() {
                log.push("BrokenComponentWillMountErrorBoundary componentDidMount");
            }
            componentWillUnmount() {
                log.push("BrokenComponentWillMountErrorBoundary componentWillUnmount");
            }
            componentDidCatch(error) {
                log.push("BrokenComponentWillMountErrorBoundary componentDidCatch");
                this.setState({ error });
            }
        };

        BrokenComponentDidMountErrorBoundary = class extends React.Component {
            constructor(props) {
                super(props);
                this.state = { error: null };
                log.push("BrokenComponentDidMountErrorBoundary constructor");
            }
            render() {
                if (this.state.error) {
                    log.push("BrokenComponentDidMountErrorBoundary render error");
                    return <div>Caught an error: {this.state.error.message}.</div>;
                }
                log.push("BrokenComponentDidMountErrorBoundary render success");
                return <div>{this.props.children}</div>;
            }
            componentWillMount() {
                log.push("BrokenComponentDidMountErrorBoundary componentWillMount");
            }
            componentDidMount() {
                log.push("BrokenComponentDidMountErrorBoundary componentDidMount [!]");
                throw new Error("Hello");
            }
            componentWillUnmount() {
                log.push("BrokenComponentDidMountErrorBoundary componentWillUnmount");
            }
            componentDidCatch(error) {
                log.push("BrokenComponentDidMountErrorBoundary componentDidCatch");
                this.setState({ error });
            }
        };

        BrokenRenderErrorBoundary = class extends React.Component {
            constructor(props) {
                super(props);
                this.state = { error: null };
                log.push("BrokenRenderErrorBoundary constructor");
            }
            render() {
                if (this.state.error) {
                    log.push("BrokenRenderErrorBoundary render error [!]");
                    throw new Error("Hello");
                }
                log.push("BrokenRenderErrorBoundary render success");
                return <div>{this.props.children}</div>;
            }
            componentWillMount() {
                log.push("BrokenRenderErrorBoundary componentWillMount");
            }
            componentDidMount() {
                log.push("BrokenRenderErrorBoundary componentDidMount");
            }
            componentWillUnmount() {
                log.push("BrokenRenderErrorBoundary componentWillUnmount");
            }
            componentDidCatch(error) {
                log.push("BrokenRenderErrorBoundary componentDidCatch");
                this.setState({ error });
            }
        };

        BrokenRender = class extends React.Component {
            constructor(props) {
                super(props);
                log.push("BrokenRender constructor");
            }
            render() {
                log.push("BrokenRender render [!]");
                throw new Error("Hello");
            }
            componentWillMount() {
                log.push("BrokenRender componentWillMount");
            }
            componentDidMount() {
                log.push("BrokenRender componentDidMount");
            }
            componentWillReceiveProps() {
                log.push("BrokenRender componentWillReceiveProps");
            }
            componentWillUpdate() {
                log.push("BrokenRender componentWillUpdate");
            }
            componentDidUpdate() {
                log.push("BrokenRender componentDidUpdate");
            }
            componentWillUnmount() {
                log.push("BrokenRender componentWillUnmount");
            }
        };

        NoopErrorBoundary = class extends React.Component {
            constructor(props) {
                super(props);
                log.push("NoopErrorBoundary constructor");
            }
            render() {
                log.push("NoopErrorBoundary render");
                return <BrokenRender />;
            }
            componentWillMount() {
                log.push("NoopErrorBoundary componentWillMount");
            }
            componentDidMount() {
                log.push("NoopErrorBoundary componentDidMount");
            }
            componentWillUnmount() {
                log.push("NoopErrorBoundary componentWillUnmount");
            }
            componentDidCatch() {
                log.push("NoopErrorBoundary componentDidCatch");
            }
        };

        Normal = class extends React.Component {
            static defaultProps = {
                logName: "Normal"
            };
            constructor(props) {
                super(props);
                log.push(`${this.props.logName} constructor`);
            }
            render() {
                log.push(`${this.props.logName} render`);
                return <div>{this.props.children}</div>;
            }
            componentWillMount() {
                log.push(`${this.props.logName} componentWillMount`);
            }
            componentDidMount() {
                log.push(`${this.props.logName} componentDidMount`);
            }
            componentWillReceiveProps() {
                log.push(`${this.props.logName} componentWillReceiveProps`);
            }
            componentWillUpdate() {
                log.push(`${this.props.logName} componentWillUpdate`);
            }
            componentDidUpdate() {
                log.push(`${this.props.logName} componentDidUpdate`);
            }
            componentWillUnmount() {
                log.push(`${this.props.logName} componentWillUnmount`);
            }
        };

        ErrorBoundary = class extends React.Component {
            constructor(props) {
                super(props);
                this.state = { error: null };
                log.push(`${this.props.logName} constructor`);
            }
            render() {
                if (this.state.error && !this.props.forceRetry) {
                    log.push(`${this.props.logName} render error`);
                    return this.props.renderError(this.state.error, this.props);
                }
                log.push(`${this.props.logName} render success`);
                return <div>{this.props.children}</div>;
            }
            componentDidCatch(error) {
                log.push(`${this.props.logName} componentDidCatch`);
                this.setState({ error });
            }
            componentWillMount() {
                log.push(`${this.props.logName} componentWillMount`);
            }
            componentDidMount() {
                log.push(`${this.props.logName} componentDidMount`);
            }
            componentWillReceiveProps() {
                log.push(`${this.props.logName} componentWillReceiveProps`);
            }
            componentWillUpdate() {
                log.push(`${this.props.logName} componentWillUpdate`);
            }
            componentDidUpdate() {
                log.push(`${this.props.logName} componentDidUpdate`);
            }
            componentWillUnmount() {
                log.push(`${this.props.logName} componentWillUnmount`);
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
                log.push("RetryErrorBoundary constructor");
            }
            render() {
                log.push("RetryErrorBoundary render");
                return <BrokenRender />;
            }
            componentWillMount() {
                log.push("RetryErrorBoundary componentWillMount");
            }
            componentDidMount() {
                log.push("RetryErrorBoundary componentDidMount");
            }
            componentWillUnmount() {
                log.push("RetryErrorBoundary componentWillUnmount");
            }
            componentDidCatch(error) {
                log.push("RetryErrorBoundary componentDidCatch [!]");
                // In Fiber, calling setState() (and failing) is treated as a rethrow.
                this.setState({});
            }
        };

        ErrorMessage = class extends React.Component {
            constructor(props) {
                super(props);
                log.push("ErrorMessage constructor");
            }
            componentWillMount() {
                log.push("ErrorMessage componentWillMount");
            }
            componentDidMount() {
                log.push("ErrorMessage componentDidMount");
            }
            componentWillUnmount() {
                log.push("ErrorMessage componentWillUnmount");
            }
            render() {
                log.push("ErrorMessage render");
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
});

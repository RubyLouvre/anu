
import React from "dist/React";
import ReactTestUtils from "lib/ReactTestUtils";
import { createReactNoop } from "lib/createReactNoop";

describe("React.forwardRef", function () {
    this.timeout(200000);

    var body = document.body, ReactNoop,
        div;
    beforeEach(function () {
        ReactNoop = createReactNoop(div, React);
        div = document.createElement("div");
        body.appendChild(div);
    });
    afterEach(function () {
        body.removeChild(div);
    });

    it("to have a current prop that is null on creation", () => {
        expect(React.createRef().current).toEqual(null);
    });

    it("should work without a ref to be forwarded", () => {
        class Child extends React.Component {
            render() {
                ReactNoop.yield(this.props.value);
                return null;
            }
        }

        function Wrapper(props) {
            return <Child {...props} ref={props.forwardedRef} />;
        }

        const RefForwardingComponent = React.forwardRef((props, ref) => (
            <Wrapper {...props} forwardedRef={ref} />
        ));

        ReactNoop.render(<RefForwardingComponent value={123} />);
        expect(ReactNoop.flush()).toEqual([123]);
    });


    it("should forward a ref for a single child", () => {
        class Child extends React.Component {
            render() {
                ReactNoop.yield(this.props.value);
                return null;
            }
        }

        function Wrapper(props) {
            return <Child {...props} ref={props.forwardedRef} />;
        }

        const RefForwardingComponent = React.forwardRef((props, ref) => (
            <Wrapper {...props} forwardedRef={ref} />
        ));

        const ref = React.createRef();

        ReactNoop.render(<RefForwardingComponent ref={ref} value={123} />);
        expect(ReactNoop.flush()).toEqual([123]);
        expect(ref.current instanceof Child).toBe(true);
    });

    it('should forward a ref for multiple children', () => {
        class Child extends React.Component {
            render() {
                ReactNoop.yield(this.props.value);
                return null;
            }
        }

        function Wrapper(props) {
            return <Child {...props} ref={props.forwardedRef} />;
        }

        const RefForwardingComponent = React.forwardRef((props, ref) => (
            <Wrapper {...props} forwardedRef={ref} />
        ));

        const ref = React.createRef();

        ReactNoop.render(
            <div>
                <div />
                <RefForwardingComponent ref={ref} value={123} />
                <div />
            </div>,
        );
        expect(ReactNoop.flush()).toEqual([123]);
        expect(ref.current instanceof Child).toBe(true);
    });


    it('should update refs when switching between children', () => {
        var container = document.createElement("div")
        function FunctionalComponent({ forwardedRef, setRefOnDiv }) {
            return (
                <section>
                    <div ref={setRefOnDiv ? forwardedRef : null}>First</div>
                    <span ref={setRefOnDiv ? null : forwardedRef}>Second</span>
                </section>
            );
        }

        const RefForwardingComponent = React.forwardRef((props, ref) => (
            <FunctionalComponent {...props} forwardedRef={ref} />
        ));

        const ref = React.createRef();

        ReactDOM.render(<RefForwardingComponent ref={ref} setRefOnDiv={true} />, container);
        expect(ref.current.tagName).toBe('DIV');

        ReactDOM.render(<RefForwardingComponent ref={ref} setRefOnDiv={false} />, container);
        expect(ref.current.tagName).toBe('SPAN');

    });
    it('should maintain child instance and ref through updates', () => {
        class Child extends React.Component {
          constructor(props) {
            super(props);
          }
          render() {
            ReactNoop.yield(this.props.value);
            return null;
          }
        }
    
        function Wrapper(props) {
          return <Child {...props} ref={props.forwardedRef} />;
        }
    
        const RefForwardingComponent = React.forwardRef((props, ref) => (
          <Wrapper {...props} forwardedRef={ref} />
        ));
    
        let setRefCount = 0;
        let ref;
    
        const setRef = r => {
          setRefCount++;
          ref = r;
        };
    
        ReactNoop.render(<RefForwardingComponent ref={setRef} value={123} />);
        expect(ReactNoop.flush()).toEqual([123]);
        expect(ref instanceof Child).toBe(true);
        expect(setRefCount).toBe(1);
        ReactNoop.render(<RefForwardingComponent ref={setRef} value={456} />);
        expect(ReactNoop.flush()).toEqual([456]);
        expect(ref instanceof Child).toBe(true);
        expect(setRefCount).toBe(1);
      });
})
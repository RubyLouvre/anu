import React from "src/React";

describe("createPortal", function() {
    it("should support Portal components", () => {
        const context = {};
        const callback = function(kid, index) {
            expect(this).toBe(context);
            return kid;
        };
      
        const portalContainer = document.createElement("div");

        const simpleChild = <span key="simple" />;
        const reactPortal = ReactDOM.createPortal(simpleChild, portalContainer);

        const parentInstance = <div>{reactPortal}</div>;
        React.Children.forEach(parentInstance.props.children, callback, context);
        expect(callback).toHaveBeenCalledWith(reactPortal, 0);
        callback.calls.reset();
        const mappedChildren = React.Children.map(parentInstance.props.children, callback, context);
        expect(callback).toHaveBeenCalledWith(reactPortal, 0);
        expect(mappedChildren[0]).toEqual(reactPortal);
    });

    it("supports portals", () => {
        function Parent(props) {
            return <div>{props.children}</div>;
        }

        function BailoutSpan() {
            return <span />;
        }

        class BailoutTest extends React.Component {
            shouldComponentUpdate() {
                return false;
            }
            render() {
                return <BailoutSpan />;
            }
        }

        function Child(props) {
            return (
                <div>
                    <BailoutTest />
                    {props.children}
                </div>
            );
        }
        const portalContainer = { rootID: "persistent-portal-test", children: [] };
        const emptyPortalChildSet = portalContainer.children;
        render(<Parent>{ReactPortal.createPortal(<Child />, portalContainer, null)}</Parent>);
        ReactNoop.flush();

        expect(emptyPortalChildSet).toEqual([]);

        const originalChildren = getChildren();
        expect(originalChildren).toEqual([div()]);
        const originalPortalChildren = portalContainer.children;
        expect(originalPortalChildren).toEqual([div(span())]);

        render(<Parent>{ReactPortal.createPortal(<Child>Hello {"World"}</Child>, portalContainer, null)}</Parent>);
        ReactNoop.flush();

        const newChildren = getChildren();
        expect(newChildren).toEqual([div()]);
        const newPortalChildren = portalContainer.children;
        expect(newPortalChildren).toEqual([div(span(), "Hello ", "World")]);

        expect(originalChildren).toEqual([div()]);
        expect(originalPortalChildren).toEqual([div(span())]);

        // Reused portal children should have reference equality
        expect(newPortalChildren[0].children[0]).toBe(originalPortalChildren[0].children[0]);

        // Deleting the Portal, should clear its children
        render(<Parent />);
        ReactNoop.flush();

        const clearedPortalChildren = portalContainer.children;
        expect(clearedPortalChildren).toEqual([]);

        // The original is unchanged.
        expect(newPortalChildren).toEqual([div(span(), "Hello ", "World")]);
    });
});

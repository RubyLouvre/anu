describe("onlyChild", () => {
    let React;
    let WrapComponent;
  
    beforeEach(() => {
        React = require("react");
      
        WrapComponent = class extends React.Component {
            render() {
                return (
                    <div>
                        {React.Children.only(this.props.children, this.props.mapFn, this)}
                    </div>
                );
            }
        };
    });
  
    it("should fail when passed two children", () => {
        expect(function() {
            const instance = (
                <WrapComponent>
                    <div />
                    <span />
                </WrapComponent>
            );
            React.Children.only(instance.props.children);
        }).toThrow();
    });
    it("should fail when passed nully values", () => {
        expect(function() {
            const instance = <WrapComponent>{null}</WrapComponent>;
            React.Children.only(instance.props.children);
        }).toThrow();
  
        expect(function() {
            const instance = <WrapComponent>{undefined}</WrapComponent>;
            React.Children.only(instance.props.children);
        }).toThrow();
    });
  
    it("should fail when key/value objects", () => {
        expect(function() {
            const instance = <WrapComponent>{[<span key="abc" />]}</WrapComponent>;
            React.Children.only(instance.props.children);
        }).toThrow();
    });
  
    it("should not fail when passed interpolated single child", () => {
        expect(function() {
            const instance = <WrapComponent>{<span />}</WrapComponent>;
            React.Children.only(instance.props.children);
        }).not.toThrow();
    });
  
    it("should return the only child", () => {
        const instance = (
            <WrapComponent>
                <span />
            </WrapComponent>
        );
        expect(React.Children.only(instance.props.children)).toEqual(<span />);
    });
});
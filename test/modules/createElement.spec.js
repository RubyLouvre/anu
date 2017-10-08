import React from "src/React";

describe("createElement", function() {
    it("type", () => {
        var el = React.createElement("p", null, "aaa");
        expect(el.type).toBe("p");
        expect(el.vtype).toBe(1);
        expect(el.props.children).toA("string");
        expect(el.props.children.length).toBe(3);
    });
    it("children", () => {
        var el = React.createElement("p", null, "aaa", "bbb", "ccc");
        expect(el.props.children).toEqual(["aaa", "bbb", "ccc"]);

        el = React.createElement("p", null, null);
        expect(el.props.children).toEqual(null);
        el = React.createElement("div", { key: "xxx" });

        expect(el.key).toBe("xxx");

        el = React.createElement("p", null, []);
        expect(el.props.children.length).toBe(0);

        el = React.createElement("p", { children: ["aaa", "bbb"] });
        expect(el.props.children.length).toBe(2);

        el = React.createElement("p", null);
        expect(el.props.children).toBe(void 666);
    });
    it("Children.only", () => {
        var el = React.createElement("p", null, "aaa", "bbb", "ccc");
        var a = React.Children.only(el);
        expect(a.type).toBe("p");
        expect(a.props.children).toEqual(["aaa", "bbb", "ccc"]);

        el = React.createElement("p", null, null);
        expect(el.props.children).toEqual(null);

        el = React.createElement("p", null, []);
        expect(el.props.children.length).toBe(0);
        expect(el.vtype).toBe(1);
        el = React.createElement("p", { children: ["aaa", "bbb"] });
        expect(el.props.children.length).toBe(2);
    });

    it("flatChildren", () => {
        var el = React.createElement("p", null, "aaa", false, "ccc");
        expect(el.props.children).toEqual(["aaa", false, "ccc"]);

        var el = React.createElement("p", null, "aaa", true, "ccc");
        expect(el.props.children).toEqual(["aaa", true, "ccc"]);

        var el = React.createElement("p", null, "aaa", 111, "ccc");
        expect(el.props.children).toEqual(["aaa", 111, "ccc"]);

        var el = React.createElement("p", null, "aaa", "", "ccc");
        expect(el.props.children).toEqual(["aaa", "", "ccc"]);

        var el = React.createElement("p", null, "aaa", "ccc", "");
        expect(el.props.children).toEqual(["aaa", "ccc", ""]);

        var el = React.createElement("p", null, "aaa", "", "ccc");
        expect(el.props.children).toEqual(["aaa", "", "ccc"]);

        var el = React.createElement("p", null, 111, 222, 333);
        expect(el.props.children).toEqual([111, 222, 333]);

        var el = React.createElement("p", null, 111, "ddd", 333);
        expect(el.props.children).toEqual([111, "ddd", 333]);
    });
    it("class render", () => {
        class A extends React.Component {
            render() {
                return <div id="aaa" />;
            }
        }
        var el = React.createElement(A, {});
        expect(el.vtype).toBe(2);
        el = React.createElement(function() {}, {});
        expect(el.vtype).toBe(4);
        var obj = new A().render();
        expect(obj.props.children).toEqual(void 666);
        expect(obj.props.id).toBe("aaa");
        expect(obj.props).toEqual({
            id: "aaa"
        });
        expect(obj.type).toEqual("div");
        expect(obj.key == null).toBe(true);
        expect(typeof obj._owner).toBe("object");
    });
});

import {patchStyle, cssName} from "src/style";
import {DOMElement} from "src/browser";

describe("style", function () {
    it("patchStyle", function () {
        var dom = new DOMElement;
        var sameStyle = {};
        patchStyle(dom, sameStyle, sameStyle);
        expect(dom.style).toEqual({});

        dom.style.color = "red";
        patchStyle(dom, {
            color: "red"
        }, {color: "green"});
        expect(dom.style).toEqual({color: "green"});

        patchStyle(dom, {
            color: "red"
        }, {color: null});
        expect(dom.style).toEqual({color: ""});

        patchStyle(dom, {
            color: "red"
        }, {color: false});
        expect(dom.style).toEqual({color: ""});
        dom.style.backgroundColor = "black";
        patchStyle(dom,dom.style, {});
        expect(dom.style).toEqual({backgroundColor: "",color: ""});
    });
    it("cssName", function () {
        expect(cssName("xxx")).toBe(null);
    });

});
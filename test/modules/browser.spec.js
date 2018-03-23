import { createElement, win, fakeDoc, DOMElement } from "src/browser";
import { getWindow } from "src/util";

describe("browser", function() {
    it("window", function() {
        var win = getWindow();
        expect(typeof win).toBe("object");
        expect(typeof win.document).toBe("object");

        expect(fakeDoc.createElementNS()).toInstanceOf(DOMElement);
        expect(fakeDoc.createDocumentFragment()).toInstanceOf(DOMElement);
        expect(fakeDoc.createTextNode()).toA("boolean");
        expect(fakeDoc.createComment()).toA("boolean");
        expect(fakeDoc.textContent).toA("string");
    });

    it("createElement", function() {
        var el = createElement({ type: "div" }, { tag: 5 });
        expect(typeof el).toBe("object");
        expect(createElement({ type: "span", ns: "xxx" }, { tag: 5 }).nodeName.toLowerCase()).toBe("span");
    });

    it("DOMElement", function() {
        var el = fakeDoc.createElement("div", { tag: 5 });
        expect(el).toInstanceOf(DOMElement);
        expect(el.nodeName).toBe("div");
        expect(el.children).toA("array");
        expect(el.style).toA("object");
        expect(el.contains).toA("function");
        expect(el.getAttribute).toA("function");
        expect(el.setAttribute).toA("function");
        expect(el.setAttributeNS).toA("function");
        expect(el.removeAttribute).toA("function");
        expect(el.removeAttributeNS).toA("function");
        el.removeAttribute("aaa");
        expect(el.appendChild).toA("function");
        expect(el.removeChild).toA("function");
        expect(el.insertBefore).toA("function");
        expect(el.replaceChild).toA("function");
        expect(el.addEventListener).toA("function");
        expect(el.removeEventListener).toA("function");
    });
});

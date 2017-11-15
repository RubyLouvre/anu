import {createElement, win, fakeDoc,  DOMElement} from "src/browser";
function getNs(){
    console.log("不再使用");
}
describe("browser", function () {

    it("window", function () {

        expect(typeof win).toBe("object");
        expect(typeof win.document).toBe("object");

        expect(fakeDoc.createElementNS()).toInstanceOf(DOMElement);
        expect(fakeDoc.createDocumentFragment()).toInstanceOf(DOMElement);
        expect(fakeDoc.createTextNode()).toA("boolean");
        expect(fakeDoc.createComment()).toA("boolean");
        expect(fakeDoc.textContent).toA("string");
    });
    it("createElement", function () {
        var a = createElement({type: "div"});
        expect(typeof a).toBe("object");
        expect(createElement({type: "span", ns: "xxx"}).nodeName.toLowerCase()).toBe("span");

    });
    it("getNs", function () {
        return;

        expect(getNs("svg")).toBe("http://www.w3.org/2000/svg");
        /*
        expect(getNs('use')).toBe('http://www.w3.org/2000/svg')
        expect(getNs('path')).toBe('http://www.w3.org/2000/svg')
        expect(getNs('rect')).toBe('http://www.w3.org/2000/svg')
        expect(getNs('clipPath')).toBe('http://www.w3.org/2000/svg')
        expect(getNs('circle')).toBe('http://www.w3.org/2000/svg')
        expect(getNs('polyline')).toBe('http://www.w3.org/2000/svg')
        expect(getNs('polygon')).toBe('http://www.w3.org/2000/svg')
        */
        expect(getNs("semantics")).toBe("http://www.w3.org/1998/Math/MathML");
        expect(getNs("math")).toBe("http://www.w3.org/1998/Math/MathML");
        expect(getNs("mo")).toBe("http://www.w3.org/1998/Math/MathML");
        expect(getNs("menu")).toBe(null);
    });
    it("DOMElement", function () {
        var el = fakeDoc.createElement("div");
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

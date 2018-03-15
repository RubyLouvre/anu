
import React from "dist/React";
import ReactTestUtils from "lib/ReactTestUtils";

describe("createRef", function () {
    this.timeout(200000);

    var body = document.body,
        div;
    beforeEach(function () {
        div = document.createElement("div");
        body.appendChild(div);
    });
    afterEach(function () {
        body.removeChild(div);
    });

    it("to have a value prop that is null on creation", () => {
        expect(createRef().value).toEqual(null);
    });

    it("when called with ReactElement it sets the value to the passed component", () => {
        const component = React.createElement("span");
        const refObject = createRef();

        refObject(component);

        expect(refObject.value).toBe(component);
    });

    it("when called with HTMLElement it sets the value to the passed element", () => {
        const component = document.createElement("span");
        const refObject = createRef();

        refObject(component);

        expect(refObject.value).toBe(component);
    });
});
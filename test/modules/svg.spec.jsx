import React from "dist/React";

describe("SVG元素", function() {
    this.timeout(200000);

    var body = document.body,
        div;
    beforeEach(function() {
        div = document.createElement("div");
        body.appendChild(div);
    });
    afterEach(function() {
        body.removeChild(div);
    });
    var rsvg = /^\[object SVG\w*Element\]$/;
    it("circle", () => {
        var s = ReactDOM.render(
            <svg>
                <circle cx="25" cy="25" r="20" fill="green" />
            </svg>,
            div
        );

        expect(rsvg.test(s.firstChild)).toBe(true);
    });
    it("ellipse", () => {
        var s = ReactDOM.render(
            <svg>
                <ellipse cx="25" cy="25" rx="20" ry="10" fill="green" />
            </svg>,
            div
        );

        expect(rsvg.test(s.firstChild)).toBe(true);
    });

    it("line", () => {
        var s = ReactDOM.render(
            <svg>
                <line x1="5" y1="5" x2="45" y2="45" stroke="green" />
            </svg>,
            div
        );

        expect(rsvg.test(s.firstChild)).toBe(true);
    });

    it("path", () => {
        var s = ReactDOM.render(
            <svg>
                <path d="M5,5 C5,45 45,45 45,5" fill="none" stroke="red" />
            </svg>,
            div
        );

        expect(rsvg.test(s.firstChild)).toBe(true);
    });

    it("polygon", () => {
        var s = ReactDOM.render(
            <svg>
                <polygon points="5,5 45,45 5,45 45,5" fill="none" stroke="red" />
            </svg>,
            div
        );

        expect(rsvg.test(s.firstChild)).toBe(true);
    });

    it("polyline", () => {
        var s = ReactDOM.render(
            <svg>
                <polyline points="5,5 45,45 5,45 45,5" fill="none" stroke="red" />
            </svg>,
            div
        );

        expect(rsvg.test(s.firstChild)).toBe(true);
    });
    it("rect", () => {
        var s = ReactDOM.render(
            <svg>
                <rect x="5" y="5" rx="5" ry="5" width="40" height="40" fill="green" stroke="red" />
            </svg>,
            div
        );

        expect(rsvg.test(s.firstChild)).toBe(true);
    });
    it("defs", () => {
        var s = ReactDOM.render(
            <svg>
                <defs>
                    <rect id="rect" style="fill:green" width="15" height="15" />
                </defs>
                <use x="5" y="5" xlinkHref="#rect" />
                <use x="30" y="30" xlinkHref="#rect" />
            </svg>,
            div
        );

        expect(rsvg.test(s.firstChild)).toBe(true);
    });
    it("attribute throw error", () => {
        var a = {};
        a.toString = function() {
            throw "xxx";
        };
        var s = ReactDOM.render(React.createElement("div", { aaa: a }), div);

        expect(s.getAttribute("aaa")).toBeNull();
    });

    it("use元素的xlinkHref", () => {
        function Test() {
            return (
                <svg className="icon-twitter" width="16px" height="16px">
                    <use xlinkHref="#twitter" xlinkRole="#aaa" id="aaa" />
                </svg>
            );
        }

        ReactDOM.render(<Test />, div);

        var el = div.getElementsByTagName("use");
        expect(el.length).toBe(1);
        expect(el[0].getAttribute("xlink:href")).toBe("#twitter");
        expect(el[0].getAttribute("xlink:role")).toBe("#aaa");
    });
});

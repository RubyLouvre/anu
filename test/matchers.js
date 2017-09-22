if (typeof chai !== "undefined") {
    // http://stackoverflow.com/questions/11942085/is-there-a-way-to-add-a-jasmine-matcher-to-the-whole-environment
    (function() {
        var utils = chai.util;
        var expect = chai.expect;

        var Assertion = chai.Assertion,
            flag = utils.flag;

        Assertion.addMethod("toEqual", function(expected) {
            return this.to.eql(expected);
        });

        //实现spyOn功能
        var spy = (window.spyOn = function(obj, method) {
            var orig = obj[method];
            return {
                and: {
                    callThrough: function() {
                        return (obj[method] = spy.createSpy(orig));
                    }
                }
            };
        });
        spy.createSpy = function(fn) {
            function spyFn() {
                spyFn.spyArgs = [].slice.call(arguments);
                spyFn.spyThis = this;
                spyFn.calls.count++;
                if (fn) {
                    return spyFn.spyReturn = fn.apply(this, arguments);
                }
            }
            spyFn.calls = {
                reset: function() {
                    spyFn.spyArgs = spyFn.spyThis = spyFn.spyReturn = void 666;
                    this.count = 0;
                },
                count: 0
            };
            return spyFn;
        };

        Assertion.addMethod("toHaveBeenCalledWith", function(expected) {
            var val = this.__flags.object;
            var arr = val.spyArgs || [];
            val = val.spyArgs[0];
            var a = new chai.Assertion(val);
            var arr = Object.keys(expected);
            return a.contain.any.keys(arr);
        });

        Assertion.addMethod("toHaveBeenCalled", function() {
            var val = this.__flags.object;
            var a = new chai.Assertion("toHaveBeenCalled");
            if (val.spyArgs) {
                return a.equal("toHaveBeenCalled");
            }
            return a.equal("ng");
        });

        Assertion.addMethod("toNotHaveBeenCalledWith", function(expected) {
            var val = this.__flags.object;
            val = val.spyArgs[0];
            var a = new chai.Assertion(val);
            var arr = Object.keys(expected);
            return a.not.contain.any.keys(arr);
        });

        Assertion.addMethod("toNotHaveBeenCalled", function() {
            var val = this.__flags.object;
            var a = new chai.Assertion("toNotHaveBeenCalled");
            if (val.spyArgs) {
                return a.equal("ng");
            }
            return a.equal("toNotHaveBeenCalled");
        });

        Assertion.addMethod("toA", function(expected) {
            return this.to.be.a(expected);
        });

        Assertion.addMethod("toBe", function(expected) {
            return this.equal(expected);
        });

        Assertion.addMethod("toMatch", function(expected) {
            return this.match(new RegExp(expected));
        });

        Assertion.addMethod("toInstanceOf", function(clazz) {
            return this.to.be.an.instanceof(clazz);
        });

        //拥有特定的某个属性名
        Assertion.addMethod("toHaveProperty", function(a) {
            return this.to.have.property(a);
        });

        Assertion.addMethod("toHaveKeys", function(arr) {
            return this.to.contain.any.keys(arr);
        });

        Assertion.addMethod("toBeDefined", function() {
            return this.not.undefined;
        });

        Assertion.addMethod("toBeUndefined", function() {
            return this.undefined;
        });

        Assertion.addMethod("toBeNull", function() {
            return this.null;
        });

        Assertion.addMethod("toBeFalsy", function() {
            return this.not.ok;
        });

        Assertion.addMethod("toBeTruthy", function() {
            return this.ok;
        });

        Assertion.addMethod("toContain", function(expected) {
            return this.deep.contain(expected);
        });

        Assertion.addMethod("toBeLessThan", function(expected) {
            return this.lessThan(expected);
        });

        Assertion.addMethod("toBeGreaterThan", function(expected) {
            return this.greaterThan(expected);
        });

        Assertion.addMethod("toBeCloseTo", function(expected, precision) {
            return this.closeTo(expected, precision);
        });

        Assertion.addMethod("toThrow", function(expected) {
            return this.throw(expected);
        });
        Assertion.addMethod("toThrowError", function(expected) {
            var val = this.__flags.object;
            var a = new chai.Assertion(11);
            try {
                val();
            } catch (e) {
                console.warn(expected);
                return a.equal(11);
            }
            return a.equal(0);
        });
        console.log("添加jasmine风格的断言方法");
    })();
}

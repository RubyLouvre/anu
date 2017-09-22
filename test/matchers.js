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
        window.spyOn = function(obj, method) {
            var orig = obj[method];
            return {
                and: {
                    callThrough: function() {
                        var fn = (obj[method] = function() {
                            fn.spyArgs = [].slice.call(arguments);
                            fn.spyThis = obj;
                            fn.spyReturn = orig.apply(obj, fn.spyArgs);
                        });
                    }
                }
            };
        };

        Assertion.addMethod("toHaveBeenCalledWith", function(expected) {
            var val = this.__flags.object;
            val = val.spyArgs[0];
            var a = new chai.Assertion(val);
            var arr = Object.keys(expected);
            return a.contain.any.keys(arr);
        });
        
        Assertion.addMethod("toHaveBeenCalled", function(expected) {
            return this.contain.any.keys(["spyArgs"]);
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

        console.log("添加jasmine风格的断言方法");
    })();
}

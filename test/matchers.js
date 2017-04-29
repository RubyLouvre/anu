if (typeof chai !== 'undefined') {
    // http://stackoverflow.com/questions/11942085/is-there-a-way-to-add-a-jasmine-matcher-to-the-whole-environment
    (function() {

        var utils = chai.util
        var expect = chai.expect


        var Assertion = chai.Assertion,
            flag = utils.flag

        Assertion.addMethod("toEqual", function(expected) {
            return this.to.eql(expected);
        });


        Assertion.addMethod("toA", function(expected) {
            return this.to.be.a(expected);
        });
        Assertion.addMethod("toBe", function(expected) {
            return this.equal(expected);
        });


        Assertion.addMethod("toMatch", function(expected) {
            return this.match(new RegExp(expected));
        })

        Assertion.addMethod('toInstanceOf', function(clazz) {
            return this.to.be.an.instanceof(clazz);
        })

        //拥有特定的某个属性名
        Assertion.addMethod('toHaveProperty', function(a) {
            return this.to.have.property(a)
        })

        Assertion.addMethod('toHaveKeys', function(arr) {
            return this.to.contain.any.keys(arr);
        })

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
        /*
                //复杂对象的比较
                function addMethod(methodName, method) {
                    utils.addMethod(chai.Assertion.prototype, methodName, method);
                }

                addMethod('toEqual', function(b) {
                    var obj = utils.flag(this, 'object');
                    new chai.Assertion(obj).to.deep.equal(b);
                });
                //类型
                addMethod('toA', function(b) {
                    var obj = utils.flag(this, 'object');
                    new chai.Assertion(obj).to.be.a(b);
                })

                //正则
                addMethod('toMatch', function(reg) {
                    var obj = utils.flag(this, 'object');
                    new chai.Assertion(obj).to.match(reg);
                });
                //严格比较
                addMethod('toBe', function(str) {
                        var obj = utils.flag(this, 'object');
                        new chai.Assertion(obj).to.equal(str);
                    })
                    //defined
                addMethod('toBeDefined', function() {
                        var obj = utils.flag(this, 'object');
                        new chai.Assertion(obj).to.not.be.undefined;
                    })
                    //undefined
                addMethod('toBeUndefined', function() {
                        var obj = utils.flag(this, 'object');
                        new chai.Assertion(obj).to.be.undefined;
                    })
                    //null
                addMethod('toBeNull', function() {
                        var obj = utils.flag(this, 'object');
                        new chai.Assertion(obj).to.be.null;
                    })
                    // true
                addMethod('toBeTruthy', function() {
                        var obj = utils.flag(this, 'object');
                        new chai.Assertion(obj).to.be.ok;
                    })
                    //false
                addMethod('toBeFalsy', function() {
                        var obj = utils.flag(this, 'object');
                        new chai.Assertion(obj).to.not.be.ok;
                    })
                    //数组包含某元素
                addMethod('toContain', function(b) {
                        var obj = utils.flag(this, 'object');

                        new chai.Assertion(obj).to.include(b)
                    })
                    //包含多少键名
                addMethod('toHaveKeys', function(arr) {
                        var obj = utils.flag(this, 'object');

                        new chai.Assertion(obj).to.contain.any.keys(arr);
                    })
                    //是什么类的实例
                addMethod('toInstanceOf', function(clazz) {
                        var obj = utils.flag(this, 'object');

                        new chai.Assertion(obj).to.be.an.instanceof(clazz);
                    })
                    //拥有特定的某个属性名
                addMethod('toHaveProperty', function(a) {
                    var obj = utils.flag(this, 'object');
                    new chai.Assertion(obj).to.have.property(a)
                })

                addMethod('toBeLessThan', function(num) {
                    var obj = utils.flag(this, 'object');

                    new chai.Assertion(obj).to.below(num)
                })
                addMethod('toBeGreaterThan', function(num) {
                    var obj = utils.flag(this, 'object');

                    new chai.Assertion(obj).to.above(num)
                })
        */

        console.log('添加jasmine风格的断言方法')

    })();


}
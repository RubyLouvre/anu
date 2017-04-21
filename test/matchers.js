if (typeof chai !== 'undefined') {
    // http://stackoverflow.com/questions/11942085/is-there-a-way-to-add-a-jasmine-matcher-to-the-whole-environment
    (function() {

        var utils = chai.util
        var expect = chai.expect

        //复杂对象的比较
        function addMethod(methodName, method) {
            utils.addMethod(chai.Assertion.prototype, methodName, method);
        }

        addMethod('toEqual', function(b) {
            var obj = utils.flag(this, 'object');
            new chai.Assertion(obj).to.eql(b);
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


        console.log('添加jasmine风格的断言方法')

    })();


}
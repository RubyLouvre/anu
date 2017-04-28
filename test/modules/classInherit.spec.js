import {
    inherit
} from 'src/util'

describe('inherit', function () {
    it('test', () => {
        function A() {}
        A.prototype = {
            render: function () {
                console.log('111')
            },
            setState: function(){}
        }

        function B() {

        }
        inherit(B, A)
        var b = new B
        expect(b).toInstanceOf(B)
        expect(b).toInstanceOf(A)
        expect(b.render).toBe(A.prototype.render)
        expect(b.setState).toA('function')
    })

})
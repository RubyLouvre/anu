import {
    oneObject,
    extend,
    isFn,
    isStateless,
    toLowerCase,
    inherit,
    camelize,
    getInstances,
    matchInstance
} from 'src/util'
import {
    isEventName
} from 'src/event'
describe('util', function() {

    it('oneObject', function() {

        expect(oneObject('aa,bb,cc')).toEqual({
            aa: 1,
            bb: 1,
            cc: 1
        })
        expect(oneObject('')).toEqual({})
        expect(oneObject([1, 2, 3], false)).toEqual({
            1: false,
            2: false,
            3: false
        })
    })
    it('extend', function() {

        expect(extend({}, { a: 1, b: 2 })).toEqual({
            a: 1,
            b: 2
        })
        expect(extend({ a: 1 }, null)).toEqual({
            a: 1
        })

    })


    it('isFn', function() {
        expect(isFn('sss')).toBe(false)
        expect(isFn(function a() {})).toBe(true)

    })

    it('isStateless', function() {
        var a = () => {}
        var b = function() {}
        b.prototype.render = function() {}
        expect(isStateless(a)).toBe(true)
        expect(isStateless(b)).toBe(false)
    })

    it('isEventName', () => {
        expect(isEventName('onaaa')).toBe(false)
        expect(isEventName('onAaa')).toBe(true)
        expect(isEventName('xxx')).toBe(false)
    })

    it('toLowerCase', () => {
        expect(toLowerCase('onaaa')).toBe('onaaa')
        expect(toLowerCase('onA')).toBe('ona')
        expect(toLowerCase('onA')).toBe('ona')
    })
    it('inherit', () => {
        function A() {}

        function B() {}
        inherit(A, B)
        var a = new A

        expect(a instanceof A).toBe(true)
        expect(a instanceof B).toBe(true)
    })

    it('camelize', function() {

        expect(typeof camelize).toBe('function')
        expect(camelize('aaa-bbb-ccc')).toBe('aaaBbbCcc')
        expect(camelize('aaa_bbb_ccc')).toBe('aaaBbbCcc')
        expect(camelize('')).toBe('')
    })
    it('getInstances', () => {
        var a = {}
        var b = {}
        var c = {}
        a.parentInstance = b
        b.parentInstance = c
        var arr = getInstances(a)
        expect(arr.length).toBe(3)
    })

  /*  it('matchInstance', () => {
        var A = function() {}
        var a = new A
       
        var C = function() {}
        var c = { statelessRender: C }
       
        expect(matchInstance(a, A)).toBe(a)
        expect(matchInstance(c, C)).toBe(c)
    })
    */
})


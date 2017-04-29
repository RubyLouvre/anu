import {shallowEqual} from 'src/shallowEqual'

describe('shallowEqual', function () {

    it('shallowEqual', async() => {
        expect(shallowEqual(1, 1)).toBe(true)
        expect(shallowEqual(-0, + 0)).toBe(false)
        expect(shallowEqual(NaN, NaN)).toBe(true)
        expect(shallowEqual({}, {})).toBe(true)
        expect(shallowEqual({
            a: {}
        }, {a: {}})).toBe(false)
        expect(shallowEqual({
            a: 1,
            b: 2
        }, {a: 1, b:2,c: 3,d: 4})).toBe(false)
        var b = {}
        expect(shallowEqual({
            a: b
        }, {a: b})).toBe(true)

        expect(shallowEqual([
            1, 2, 3
        ], [4, 5, 6])).toBe(false)
        
        expect(shallowEqual([
            1, 2, 3
        ], [1, 2, 3])).toBe(true)})
})
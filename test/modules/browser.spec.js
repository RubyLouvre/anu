import {createDOMElement, win, fakeDoc, getNs, DOMElement} from 'src/browser'

describe('browser', function () {

    it('window', function () {

        expect(typeof win).toBe('object')
        expect(typeof win.document).toBe('object')

        expect(fakeDoc.createElementNS()).toInstanceOf(DOMElement)
        expect(fakeDoc.createTextNode()).toA('boolean')
        expect(fakeDoc.createComment()).toA('boolean')

    })
    it('createDOMElement', function () {
        var a = createDOMElement({type: 'div'})
        expect(typeof a).toBe('object')
        expect(createDOMElement({type: 'div', ns: 'xxx'}).nodeName.toLowerCase()).toBe('div')

    })
    it('getNs', function () {
        expect(getNs('svg')).toBe('http://www.w3.org/2000/svg')
        expect(getNs('use')).toBe('http://www.w3.org/2000/svg')
        expect(getNs('path')).toBe('http://www.w3.org/2000/svg')
        expect(getNs('rect')).toBe('http://www.w3.org/2000/svg')
        expect(getNs('clippath')).toBe('http://www.w3.org/2000/svg')
        expect(getNs('circle')).toBe('http://www.w3.org/2000/svg')
        expect(getNs('polyline')).toBe('http://www.w3.org/2000/svg')
        expect(getNs('polygon')).toBe('http://www.w3.org/2000/svg')
        expect(getNs('semantics')).toBe('http://www.w3.org/1998/Math/MathML')
        expect(getNs('math')).toBe('http://www.w3.org/1998/Math/MathML')
        expect(getNs('math')).toBe('http://www.w3.org/1998/Math/MathML')
        expect(getNs('mo')).toBe('http://www.w3.org/1998/Math/MathML')
        expect(getNs('menu')).toBe(void 0)
    })
    it('DOMElement', function () {
        var el = fakeDoc.createElement('div')
        expect(el).toInstanceOf(DOMElement)
        expect(el.nodeName).toBe('div')
        expect(el.children).toA('array')
        expect(el.style).toA('object')
        expect(el.contains).toA('function')
        expect(el.getAttribute).toA('function')
        expect(el.setAttribute).toA('function')
        expect(el.setAttributeNS).toA('function')
        expect(el.removeAttribute).toA('function')
        expect(el.removeAttributeNS).toA('function')
        el.removeAttribute('aaa')
        expect(el.appendChild).toA('function')
        expect(el.removeChild).toA('function')
        expect(el.insertBefore).toA('function')
        expect(el.replaceChild).toA('function')
        expect(el.addEventListener).toA('function')
        expect(el.removeEventListener).toA('function')
    })

})

import React from 'src/React'
describe('createElement', function() {
    it('type', () => {
        var el = React.createElement('p', null, 'aaa')
        expect(el.type).toBe('p')
        expect(el.props.children).toA('array')
        expect(el.props.children.length).toBe(1)
    })
    it('children', () => {
        var el = React.createElement('p', null, 'aaa', 'bbb', 'ccc')
        expect(el.props.children.length).toBe(1)

        var el = React.createElement('p', null, null)
        expect(el.props.children.length).toBe(0)
    })
})
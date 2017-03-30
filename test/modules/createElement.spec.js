import React from 'src/React'
describe('createElement', function() {
    it('type', () => {
        var el = React.createElement('p', null, 'aaa')
        expect(el.type).toBe('p')
    })
})
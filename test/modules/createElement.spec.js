import React from 'src/React'

describe('createElement', function () {
    it('type', () => {
        var el = React.createElement('p', null, 'aaa')
        expect(el.type).toBe('p')
        expect(el.props.children).toA('array')
        expect(el.props.children.length).toBe(1)
    })
    it('children', () => {
        var el = React.createElement('p', null, 'aaa', 'bbb', 'ccc')
        expect(el.props.children.length).toBe(1)

        el = React.createElement('p', null, null)
        expect(el.props.children.length).toBe(0)

        el = React.createElement('p', null, [])
        expect(el.props.children.length).toBe(0)

        el = React.createElement('p', {children: ["aaa","bbb"]})
        expect(el.props.children.length).toBe(1)

        el = React.createElement('p', null)
        expect(el.props.children.length).toBe(0)
    })
     it('Children.only', () => {
        var el = React.createElement('p', null, 'aaa', 'bbb', 'ccc')
        expect(React.Children.only(el.props.children)).toEqual({
            type:'#text',
            text: 'aaabbbccc',
            deep: 0
        })

        el = React.createElement('p', null, null)
        expect(el.props.children.length).toBe(0)

        el = React.createElement('p', null, [])
        expect(el.props.children.length).toBe(0)

        el = React.createElement('p', {children: ["aaa","bbb"]})
        expect(el.props.children.length).toBe(1)

        el = React.createElement('p', null)
        expect(el.props.children.length).toBe(0)
    })

    it('flatChildren', () => {
        var el = React.createElement('p', null, 'aaa', false, 'ccc')
        expect(el.props.children[0]).toEqual({
            type: '#text',
            text: 'aaaccc',
            deep: 0
        })

        var el = React.createElement('p', null, 'aaa', true, 'ccc')
        expect(el.props.children[0]).toEqual({
            type: '#text',
            text: 'aaaccc',
            deep: 0
        })

        var el = React.createElement('p', null, 'aaa', 111, 'ccc')
        expect(el.props.children[0]).toEqual({
            type: '#text',
            text: 'aaa111ccc',
            deep: 0
        })
        var el = React.createElement('p', null, 'aaa', {
            type: '#text',
            text: ''
        }, 'ccc')
        expect(el.props.children[0]).toEqual({
            type: '#text',
            text: 'aaaccc',
            deep: 0
        })
     
        var el = React.createElement('p', null, 'aaa', 'ccc', {
            type: '#text',
            text: ''
        })
        expect(el.props.children[0]).toEqual({
            type: '#text',
            text: 'aaaccc',
            deep: 0
        })

        var el = React.createElement('p', null, 'aaa', '', 'ccc')
        expect(el.props.children[0]).toEqual({
            type: '#text',
            text: 'aaaccc',
            deep: 0
        })

        var el = React.createElement('p', null, 111, 222, 333)
        expect(el.props.children[0]).toEqual({
            type: '#text',
            text: '111222333',
            deep: 0
        })

        var el = React.createElement('p', null, 111, {
            type: '#text',
            text: 'ddd'
        }, 333)
        expect(el.props.children[0]).toEqual({
            type: '#text',
            text: '111ddd333',
            deep: 0
        })


    })
    it('class render', () => {
        class A extends React.Component {
            render() {
                return <div id = "aaa" / >
            }
        }

        var obj = (new A()).render()
        expect(obj.props.children).toEqual([])
        expect(obj.props.id).toBe('aaa')
        expect(obj.props).toEqual({
            id: 'aaa',
            children: []
        })
        expect(obj.type).toEqual('div')
        expect(obj.key == null).toBe(true)
        expect(obj._owner == null).toBe(true)




    })
})
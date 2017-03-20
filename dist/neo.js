function createElement(type, props) {
    return {
        type: type,
        props: props,
        children: [].slice.call(arguments, 2)
    }
}
//<div><p></p>xx{111}ppp</div>
var a = createElement('div', {}, createElement('p', {}, 'xxx', 111, 'ppp'))
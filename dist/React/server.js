(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('stream')) :
        typeof define === 'function' && define.amd ? define(['stream'], factory) :
            (global.ReactDOMServer = factory(global.stream));
}(this, (function (stream) {

    var hasSymbol = typeof Symbol === 'function' && Symbol['for'];

    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var REACT_ELEMENT_TYPE = hasSymbol ? Symbol['for']('react.element') : 0xeac7;
    function Fragment(props) {
        return props.children;
    }



    function extend(obj, props) {
        for (var i in props) {
            if (hasOwnProperty.call(props, i)) {
                obj[i] = props[i];
            }
        }
        return obj;
    }


    var __type = Object.prototype.toString;
    function noop() { }




    var rword = /[^, ]+/g;
    function oneObject(array, val) {
        if (array + '' === array) {
            array = array.match(rword) || [];
        }
        var result = {},
            value = val !== void 666 ? val : 1;
        for (var i = 0, n = array.length; i < n; i++) {
            result[array[i]] = value;
        }
        return result;
    }


    var options = oneObject(['beforeProps', 'afterCreate', 'beforeInsert', 'beforeDelete', 'beforeUpdate', 'afterUpdate', 'beforePatch', 'afterPatch', 'beforeUnmount', 'afterMount'], noop);
    var numberMap = {
        '[object Boolean]': 2,
        '[object Number]': 3,
        '[object String]': 4,
        '[object Function]': 5,
        '[object Symbol]': 6,
        '[object Array]': 7
    };
    function typeNumber(data) {
        if (data === null) {
            return 1;
        }
        if (data === void 666) {
            return 0;
        }
        var a = numberMap[__type.call(data)];
        return a || 8;
    }

    function getDOMNode() {
        return this;
    }
    var pendingRefs = [];
    var Refs = {
        mountOrder: 1,
        currentOwner: null,
        controlledCbs: [],
        fireRef: function fireRef(fiber, dom, vnode) {
            if (fiber._disposed || fiber._isStateless) {
                dom = null;
            }
            var ref = vnode.ref;
            if (typeof ref === 'function') {
                return ref(dom);
            }
            if (ref && Object.prototype.hasOwnProperty.call(ref, 'current')) {
                ref.current = dom;
                return;
            }
            if (!ref) {
                return;
            }
            var owner = vnode._owner;
            if (!owner) {
                throw 'Element ref was specified as a string (' + ref + ') but no owner was set';
            }
            if (dom) {
                if (dom.nodeType) {
                    dom.getDOMNode = getDOMNode;
                }
                owner.refs[ref] = dom;
            } else {
                delete owner.refs[ref];
            }
        }
    };

    function Vnode(type, tag, props, key, ref) {
        this.type = type;
        this.tag = tag;
        if (tag !== 6) {
            this.props = props;
            this._owner = Refs.currentOwner;
            if (key) {
                this.key = key;
            }
            var refType = typeNumber(ref);
            if (refType === 3 || refType === 4 || refType === 5 || refType === 8) {
                this._hasRef = true;
                this.ref = ref;
            }
        }
        options.afterCreate(this);
    }
    Vnode.prototype = {
        getDOMNode: function getDOMNode() {
            return this.stateNode || null;
        },
        $$typeof: REACT_ELEMENT_TYPE
    };

    function createVText(type, text) {
        var vnode = new Vnode(type, 6);
        vnode.text = text;
        return vnode;
    }

    var lastText = void 0;
    var flattenIndex = void 0;
    var flattenObject = void 0;
    function flattenCb(child, key) {
        var childType = typeNumber(child);
        if (childType < 3) {
            lastText = null;
            return;
        } else if (childType < 5) {
            if (lastText) {
                lastText.text += child;
                return;
            }
            lastText = child = createVText('#text', child + '');
        } else {
            lastText = null;
        }
        if (!flattenObject['.' + key]) {
            flattenObject['.' + key] = child;
        } else {
            key = '.' + flattenIndex;
            flattenObject[key] = child;
        }
        child.index = flattenIndex++;
    }
    function fiberizeChildren(c, fiber) {
        flattenObject = {};
        flattenIndex = 0;
        if (c !== void 666) {
            lastText = null;
            operateChildren(c, '', flattenCb, isIterable(c), true);
        }
        flattenIndex = 0;
        return fiber._children = flattenObject;
    }
    function computeName(el, i, prefix, isTop) {
        var k = i + '';
        if (el) {
            if (el.type == Fragment) {
                k = el.key ? '' : k;
            } else {
                k = el.key ? '$' + el.key : k;
            }
        }
        if (!isTop && prefix) {
            return prefix + ':' + k;
        }
        return k;
    }
    function isIterable(el) {
        if (el instanceof Object) {
            if (el.forEach) {
                return 1;
            }
            if (el.type === Fragment) {
                return 2;
            }
            var t = getIteractor(el);
            if (t) {
                return t;
            }
        }
        return 0;
    }
    function operateChildren(children, prefix, callback, iterableType, isTop) {
        var key = void 0,
            el = void 0,
            t = void 0,
            iterator = void 0;
        switch (iterableType) {
            case 0:
                if (Object(children) === children && !children.call && !children.type) {
                    throw 'children中存在非法的对象';
                }
                key = prefix || (children && children.key ? '$' + children.key : '0');
                callback(children, key);
                break;
            case 1:
                children.forEach(function (el, i) {
                    operateChildren(el, computeName(el, i, prefix, isTop), callback, isIterable(el), false);
                });
                break;
            case 2:
                key = children && children.key ? '$' + children.key : '';
                key = isTop ? key : prefix ? prefix + ':0' : key || '0';
                el = children.props.children;
                t = isIterable(el);
                if (!t) {
                    el = [el];
                    t = 1;
                }
                operateChildren(el, key, callback, t, false);
                break;
            default:
                iterator = iterableType.call(children);
                var ii = 0,
                    step;
                while (!(step = iterator.next()).done) {
                    el = step.value;
                    operateChildren(el, computeName(el, ii, prefix, isTop), callback, isIterable(el), false);
                    ii++;
                }
                break;
        }
    }
    var REAL_SYMBOL = hasSymbol && Symbol.iterator;
    var FAKE_SYMBOL = '@@iterator';
    function getIteractor(a) {
        var iteratorFn = REAL_SYMBOL && a[REAL_SYMBOL] || a[FAKE_SYMBOL];
        if (iteratorFn && iteratorFn.call) {
            return iteratorFn;
        }
    }

    function DOMElement(type) {
        this.nodeName = type;
        this.style = {};
        this.children = [];
    }

    var fn = DOMElement.prototype = {
        contains: Boolean
    };
    String('replaceChild,appendChild,removeAttributeNS,setAttributeNS,removeAttribute,setAttribute' + ',getAttribute,insertBefore,removeChild,addEventListener,removeEventListener,attachEvent' + ',detachEvent').replace(/\w+/g, function (name) {
        fn[name] = function () {
            console.log('fire ' + name);
        };
    });
    var fakeDoc = new DOMElement();
    fakeDoc.createElement = fakeDoc.createElementNS = fakeDoc.createDocumentFragment = function (type) {
        return new DOMElement(type);
    };
    fakeDoc.createTextNode = fakeDoc.createComment = Boolean;
    fakeDoc.documentElement = new DOMElement('html');
    fakeDoc.body = new DOMElement('body');
    fakeDoc.nodeName = '#document';
    fakeDoc.textContent = '';
    try {
        var w = window;
        var b = !!w.alert;
    } catch (e) {
        b = false;
        w = {
            document: fakeDoc
        };
    }

    var win = w;
    var document = w.document || fakeDoc;

    var fragment = document.createDocumentFragment();


    var versions = {
        88: 7,
        80: 6,
        '00': NaN,
        '08': NaN
    };
    var msie = document.documentMode || versions[typeNumber(document.all) + '' + typeNumber(win.XMLHttpRequest)];
    var modern = /NaN|undefined/.test(msie) || msie > 8;

    function getMaskedContext(curContext, contextTypes) {
        var context = {};
        if (!contextTypes || !curContext) {
            return context;
        }
        for (var key in contextTypes) {
            if (contextTypes.hasOwnProperty(key)) {
                context[key] = curContext[key];
            }
        }
        return context;
    }
    function getUnmaskedContext(instance, parentContext) {
        var context = instance.getChildContext();
        if (context) {
            parentContext = extend(extend({}, parentContext), context);
        }
        return parentContext;
    }
    function getContextProvider(fiber) {
        do {
            var c = fiber._unmaskedContext;
            if (c) {
                return c;
            }
        } while (fiber = fiber.return);
    }

    var matchHtmlRegExp = /["'&<>]/;
    function escapeHtml(string) {
        var str = '' + string;
        var match = matchHtmlRegExp.exec(str);
        if (!match) {
            return str;
        }
        var escape;
        var html = '';
        var index = 0;
        var lastIndex = 0;
        for (index = match.index; index < str.length; index++) {
            switch (str.charCodeAt(index)) {
                case 34:
                    escape = '&quot;';
                    break;
                case 38:
                    escape = '&amp;';
                    break;
                case 39:
                    escape = '&#x27;';
                    break;
                case 60:
                    escape = '&lt;';
                    break;
                case 62:
                    escape = '&gt;';
                    break;
                default:
                    continue;
            }
            if (lastIndex !== index) {
                html += str.substring(lastIndex, index);
            }
            lastIndex = index + 1;
            html += escape;
        }
        return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
    }
    function encodeEntities(text) {
        if (typeof text === 'boolean' || typeof text === 'number') {
            return '' + text;
        }
        return escapeHtml(text);
    }

    var rnumber = /^-?\d+(\.\d+)?$/;

    var cssNumber = oneObject('animationIterationCount,columnCount,order,flex,flexGrow,flexShrink,fillOpacity,fontWeight,lineHeight,opacity,orphans,widows,zIndex,zoom');
    var cssMap = oneObject('float', 'cssFloat');

    var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
    };
    var skipAttributes = {
        ref: 1,
        key: 1,
        children: 1,
        dangerouslySetInnerHTML: 1,
        innerHTML: 1
    };
    var cssCached = {
        styleFloat: 'float',
        cssFloat: 'float'
    };
    var rXlink = /^xlink:?(.+)/;
    function cssName$$1(name) {
        if (cssCached[name]) {
            return cssCached[name];
        }
        return cssCached[name] = name.replace(/([A-Z])/g, '-$1').toLowerCase();
    }
    function stringifyClassName(obj) {
        var arr = [];
        for (var i in obj) {
            if (obj[i]) {
                arr.push(i);
            }
        }
        return arr.join(' ');
    }
    var attrCached = {};
    function encodeAttributes(value) {
        if (attrCached[value]) {
            return attrCached[value];
        }
        return attrCached[value] = '"' + encodeEntities(value) + '"';
    }
    function skipFalseAndFunction(a) {
        return a !== false && Object(a) !== a;
    }
    function stringifyStyleObject(obj) {
        var arr = [];
        for (var i in obj) {
            var val = obj[i];
            if (obj != null) {
                var unit = '';
                if (rnumber.test(val) && !cssNumber[i]) {
                    unit = 'px';
                }
                arr.push(cssName$$1(i) + ': ' + val + unit);
            }
        }
        return arr.join('; ');
    }
    var forElement = {
        select: 1,
        input: 1,
        textarea: 1
    };
    function stringifyAttributes(props, type) {
        var attrs = [];
        for (var _name in props) {
            var v = props[_name];
            if (skipAttributes[_name]) {
                continue;
            }
            var checkType = false;
            if (_name === 'className' || _name === 'class') {
                _name = 'class';
                if (v && (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object') {
                    v = stringifyClassName(v);
                    checkType = true;
                }
            } else if (_name === 'style') {
                if (Object(v) == v) {
                    v = stringifyStyleObject(v);
                    checkType = true;
                } else {
                    continue;
                }
            } else if (_name === 'defaultValue') {
                if (forElement[type]) {
                    _name = 'value';
                }
            } else if (_name === 'defaultChecked') {
                if (forElement[type]) {
                    _name = 'checked';
                    v = '';
                    checkType = true;
                }
            } else if (_name.match(rXlink)) {
                _name = _name.toLowerCase().replace(rXlink, 'xlink:$1');
            }
            if (checkType || skipFalseAndFunction(v)) {
                attrs.push(_name + '=' + encodeAttributes(v + ''));
            }
        }
        return attrs.length ? ' ' + attrs.join(' ') : '';
    }
    var regeneratorRuntime = {
        mark: function () { }
    };
    var _marked = regeneratorRuntime.mark(renderVNodeGen);
    function renderVNode(vnode, context) {
        if (!vnode) return '';
        var _vnode = vnode,
            tag = _vnode.tag,
            type = _vnode.type,
            props = _vnode.props;
        switch (type) {
            case '#text':
                return encodeEntities(vnode.text);
            case '#comment':
                return '<!--' + vnode.text + '-->';
            default:
                var innerHTML$$1 = props && props.dangerouslySetInnerHTML;
                innerHTML$$1 = innerHTML$$1 && innerHTML$$1.__html;
                if (tag === 5) {
                    if (type === 'option') {
                        for (var p = vnode.return; p && p.type !== 'select'; p = p.return) {
                        }
                        if (p && p.valuesSet) {
                            var curValue = getOptionValue(vnode);
                            if (p.valuesSet['&' + curValue]) {
                                props = Object.assign({ selected: '' }, props);
                            }
                        }
                    } else if (type === 'select') {
                        var selectValue = vnode.props.value || vnode.props.defaultValue;
                        if (selectValue != null) {
                            var values = [].concat(selectValue),
                                valuesSet = {};
                            values.forEach(function (el) {
                                valuesSet['&' + el] = true;
                            });
                            vnode.valuesSet = valuesSet;
                        }
                    }
                    var str = '<' + type + stringifyAttributes(props, type);
                    if (voidTags[type]) {
                        return str + '/>\n';
                    }
                    str += '>';

                    var cstr = '';
                    if (innerHTML$$1) {

                        str += innerHTML$$1;
                    } else {
                        var fakeUpdater = {
                            _reactInternalFiber: vnode
                        };
                        var children = fiberizeChildren(props.children, fakeUpdater);
                        for (var i in children) {
                            var child = children[i];
                            child.return = vnode;
                            cstr += renderVNode(child, context);
                        }
                        vnode.updater = fakeUpdater;
                    }
                    if (vnode.type === 'textarea' && !cstr) {
                        str += vnode.props.value || vnode.props.defaultValue || '';
                    } else {
                        str += cstr;
                    }
                    return str + '</' + type + '>\n';
                } else if (tag < 3) {
                    var data = {
                        context: context
                    };
                    vnode = toVnode(vnode, data);
                    context = data.context;
                    return renderVNode(vnode, context);
                } else if (Array.isArray(vnode)) {
                    var multiChild = '';
                    vnode.forEach(function (el) {
                        multiChild += renderVNode(el, context);
                    });
                    return multiChild;
                } else {
                    throw '数据不合法';
                }
        }
    }
    function renderVNodeGen(vnode, context) {
        var _vnode2, tag, type, props, innerHTML$$1, p, curValue, selectValue, values, valuesSet, str, fakeUpdater, children, i, child, data, multiChild;
        return regeneratorRuntime.wrap(function renderVNodeGen$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _vnode2 = vnode, tag = _vnode2.tag, type = _vnode2.type, props = _vnode2.props;
                        _context.t0 = type;
                        _context.next = _context.t0 === '#text' ? 4 : _context.t0 === '#comment' ? 7 : 10;
                        break;
                    case 4:
                        _context.next = 6;
                        return encodeEntities(vnode.text);
                    case 6:
                        return _context.abrupt('break', 40);
                    case 7:
                        _context.next = 9;
                        return '<!--' + vnode.text + '-->';
                    case 9:
                        return _context.abrupt('break', 40);
                    case 10:
                        innerHTML$$1 = props && props.dangerouslySetInnerHTML;
                        innerHTML$$1 = innerHTML$$1 && innerHTML$$1.__html;
                        if (!(tag === 5)) {
                            _context.next = 24;
                            break;
                        }
                        if (type === 'option') {
                            for (p = vnode.return; p && p.type !== 'select'; p = p.return) {
                            }
                            if (p && p.valuesSet) {
                                curValue = getOptionValue(vnode);
                                if (p.valuesSet['&' + curValue]) {
                                    props = Object.assign({ selected: '' }, props);
                                }
                            }
                        } else if (type === 'select') {
                            selectValue = vnode.props.value || vnode.props.defaultValue;
                            if (selectValue != null) {
                                values = [].concat(selectValue), valuesSet = {};
                                values.forEach(function (el) {
                                    valuesSet['&' + el] = true;
                                });
                                vnode.valuesSet = valuesSet;
                            }
                        }
                        str = '<' + type + stringifyAttributes(props, type);
                        if (!voidTags[type]) {
                            _context.next = 18;
                            break;
                        }
                        _context.next = 18;
                        return str + '/>\n';
                    case 18:
                        str += '>';
                        if (innerHTML$$1) {
                            str += innerHTML$$1;
                        } else {
                            fakeUpdater = {
                                vnode: vnode
                            };
                            children = fiberizeChildren(props.children, fakeUpdater);
                            for (i in children) {
                                child = children[i];
                                child.return = vnode;
                                str += renderVNode(child, context);
                            }
                            vnode.updater = fakeUpdater;
                        }
                        _context.next = 22;
                        return str + '</' + type + '>\n';
                    case 22:
                        _context.next = 40;
                        break;
                    case 24:
                        if (!(tag < 3)) {
                            _context.next = 32;
                            break;
                        }
                        data = {
                            context: context
                        };
                        vnode = toVnode(vnode, data);
                        context = data.context;
                        _context.next = 30;
                        return renderVNode(vnode, context);
                    case 30:
                        _context.next = 40;
                        break;
                    case 32:
                        if (!Array.isArray(vnode)) {
                            _context.next = 39;
                            break;
                        }
                        multiChild = '';
                        vnode.forEach(function (el) {
                            multiChild += renderVNode(el, context);
                        });
                        _context.next = 37;
                        return multiChild;
                    case 37:
                        _context.next = 40;
                        break;
                    case 39:
                        throw '数据不合法';
                    case 40:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _marked, this);
    }
    function getOptionValue(option) {
        if ('value' in option.props) {
            return option.props.value;
        } else {
            var a = option.props.children;
            if (a + '' === 'a') {
                return a;
            } else {
                return a.text;
            }
        }
    }
    var voidTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
    function toVnode(vnode, data) {
        var parentContext = data.context,
            Type = vnode.type,
            instance,
            rendered;
        if (vnode.tag < 3) {
            var props = vnode.props;
            var instanceContext = getMaskedContext(parentContext, Type.contextTypes);
            if (vnode.tag === 1) {
                rendered = Type(props, instanceContext);
                if (rendered && rendered.render) {
                    rendered = rendered.render();
                }
                instance = {};
            } else {
                instance = new Type(props, instanceContext);
                instance.props = instance.props || props;
                instance.context = instance.context || instanceContext;
                if (instance.componentWillMount) {
                    try {
                        instance.componentWillMount();
                    } catch (e) {
                    }
                }
                rendered = instance.render();
            }
            rendered = fixVnode(rendered);
            if (instance.componentWillMount) {
                instance.componentWillMount();
            }
            if (instance.getChildContext) {
                data.context = getUnmaskedContext(instance, parentContext);
            }
            if (Array.isArray(rendered)) {
                return rendered.map(function (el) {
                    return toVnode(el, data, instance);
                });
            } else {
                return toVnode(rendered, data, instance);
            }
        } else {
            return vnode;
        }
    }
    function fixVnode(vnode) {
        var number = typeNumber(vnode);
        if (number < 3) {
            return {
                tag: 6,
                text: '',
                type: '#text'
            };
        } else if (number < 5) {
            return {
                tag: 6,
                text: vnode + '',
                type: '#text'
            };
        } else {
            return vnode;
        }
    }
    function renderToString(vnode, context) {
        return renderVNode(fixVnode(vnode), context || {});
    }
    function renderToNodeStream(vnode, context) {
        var rs = new stream.Readable();
        var it = renderVNodeGen(vnode, context || {});
        rs._read = function () {
            var v = it.next();
            if (!v.done) {
                rs.push(v.value.toString());
            } else {
                rs.push(null);
            }
        };
        return rs;
    }
    var index = {
        renderToString: renderToString,
        renderToStaticMarkup: renderToString,
        renderToNodeStream: renderToNodeStream,
        renderToStaticNodeStream: renderToNodeStream
    };

    return index;

})));

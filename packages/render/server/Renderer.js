/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import {
    Children
} from 'react-core/Children';
import {
    isFn,
    emptyObject,
    typeNumber,
    miniCreateClass,
    oneObject
} from 'react-core/util';
import {
    createOpenTagMarkup
} from './html';
import {
    duplexMap
} from './duplex';
import {
    isValidElement
} from 'react-core/createElement';

/*
import {
    REACT_FORWARD_REF_TYPE,
    REACT_FRAGMENT_TYPE,
    REACT_STRICT_MODE_TYPE,
    REACT_ASYNC_MODE_TYPE,
    REACT_PORTAL_TYPE,
    REACT_PROFILER_TYPE,
    REACT_PROVIDER_TYPE,
    REACT_CONTEXT_TYPE
} from 'shared/ReactSymbols';
*/
function AsyncMode(children) {
    return children;
}

function StrictMode(children) {
    return children;
}

function Fragment(children) {
    return children;
}

import {
    encodeEntities
} from './encode';
import {
    Namespaces,
    getIntrinsicNamespace,
    getChildNamespace
} from './namespaces';

function invariant(a, condition) {
    if (a === false) {
        console.warn(condition);
    }
}

const omittedCloseTags = oneObject(
    'area,base,br,col,embed,hr,img,input,keygen,link,meta,param,source,track,wbr'
);

// Based on reading the React.Children implementation. TODO: type this somewhere?
const toArray = Children.toArray;

//https://html.com/tags/listing/
const newlineEatingTags = oneObject('listing,pre,textarea');

function shouldConstruct(Component) {
    return Component.prototype && Component.prototype.isReactComponent;
}

function getNonChildrenInnerMarkup(props) {
    const innerHTML = props.dangerouslySetInnerHTML;
    if (innerHTML != null) {
        if (innerHTML.__html != null) {
            return innerHTML.__html;
        }
    } else {
        const content = props.children;
        var n = typeNumber(content)
        if (n === 3 || n === 4) {
            return encodeEntities(content);
        }
    }
    return null;
}

//数组扁平化
function flattenTopLevelChildren(children) {
    if (!isValidElement(children)) {
        return toArray(children);
    }
    const element = children;
    if (element.type !== REACT_FRAGMENT_TYPE) {
        return [element];
    }
    const fragmentChildren = element.props.children;
    if (!isValidElement(fragmentChildren)) {
        return toArray(fragmentChildren);
    }
    return [fragmentChildren];
}

function processContext(type, context) {
    const contextTypes = type.contextTypes;
    if (!contextTypes) {
        return emptyObject;
    }
    const maskedContext = {};
    for (const contextName in contextTypes) {
        maskedContext[contextName] = context[contextName];
    }
    return maskedContext;
}

function ReactDOMServerRenderer(children, makeStaticMarkup) {
    const flatChildren = flattenTopLevelChildren(children);

    const topFrame = {
        type: null,
        // Assume all trees start in the HTML namespace (not totally true, but
        // this is what we did historically)
        domNamespace: Namespaces.html,
        children: flatChildren,
        childIndex: 0,
        context: emptyObject,
        footer: ''
    };

    this.stack = [topFrame];
    this.exhausted = false;
    this.currentSelectValue = null;
    this.previousWasTextNode = false;
    this.makeStaticMarkup = makeStaticMarkup;

    // Context (new API)
    this.contextIndex = -1;
    this.contextStack = [];
    this.contextValueStack = [];
}
ReactDOMServerRenderer.prototype = {
    constructor: ReactDOMServerRenderer,
    /**
     * Note: We use just two stacks regardless of how many context providers you have.
     * Providers are always popped in the reverse order to how they were pushed
     * so we always know on the way down which provider you'll encounter next on the way up.
     * On the way down, we push the current provider, and its context value *before*
     * we mutated it, onto the stacks. Therefore, on the way up, we always know which
     * provider needs to be "restored" to which value.
     * https://github.com/facebook/react/pull/12985#issuecomment-396301248
     */

    pushProvider(provider) {
        const index = ++this.contextIndex;
        const context = provider.type._context;
        const previousValue = context._currentValue;

        // Remember which value to restore this context to on our way up.
        this.contextStack[index] = context;
        this.contextValueStack[index] = previousValue;

        // Mutate the current value.
        context._currentValue = provider.props.value;
    },

    popProvider() {
        const index = this.contextIndex;

        const context = this.contextStack[index];
        const previousValue = this.contextValueStack[index];

        // "Hide" these null assignments from Flow by using `any`
        // because conceptually they are deletions--as long as we
        // promise to never access values beyond `this.contextIndex`.
        this.contextStack[index] = null;
        this.contextValueStack[index] = null;

        this.contextIndex--;

        // Restore to the previous value we stored as we were walking down.
        context._currentValue = previousValue;
    },

    read(bytes) {
        if (this.exhausted) {
            return null;
        }

        let out = '';
        while (out.length < bytes) {
            if (this.stack.length === 0) {
                this.exhausted = true;
                break;
            }
            const frame = this.stack[this.stack.length - 1];
            if (frame.childIndex >= frame.children.length) {
                const footer = frame.footer;
                out += footer;
                if (footer !== '') {
                    this.previousWasTextNode = false;
                }
                this.stack.pop();
                if (frame.type === 'select') {
                    this.currentSelectValue = null;
                } else if (
                    frame.type != null &&
                    frame.type.type != null &&
                    frame.type.type.$$typeof === REACT_PROVIDER_TYPE
                ) {
                    const provider = frame.type;
                    this.popProvider(provider);
                }
                continue;
            }
            const child = frame.children[frame.childIndex++];

            out += this.render(child, frame.context, frame.domNamespace);
        }
        return out;
    },

    render(child, context, parentNamespace) {
        var t  = typeNumber(child)
        if (t === 3 || t === 4) {
            const text = '' + child;
            if (text === '') {
                return '';
            }
            if (this.makeStaticMarkup) {
                return encodeEntities(text);
            }
            if (this.previousWasTextNode) {
                return '<!-- -->' + encodeEntities(text);
            }
            this.previousWasTextNode = true;
            return encodeEntities(text);
        } else {
            let nextChild;
            ({
                child: nextChild,
                context
            } = resolve(child, context));
            if (nextChild === null || nextChild === false) {
                return '';
            } else if (!isValidElement(nextChild)) {
                if (nextChild != null && nextChild.$$typeof != null) {
                    // Catch unexpected special types early.
                    const $$typeof = nextChild.$$typeof;
                    invariant(
                        $$typeof !== REACT_PORTAL_TYPE,
                        'Portals are not currently supported by the server renderer. ' +
                        'Render them conditionally so that they only appear on the client render.'
                    );
                    // Catch-all to prevent an infinite loop if React.Children.toArray() supports some new type.
                    invariant(
                        false,
                        'Unknown element-like object type: ' + $$typeof + '. This is likely a bug in React. ' +
                        'Please file an issue.'
                    );
                }
                const nextChildren = toArray(nextChild);
                const frame = {
                    type: null,
                    domNamespace: parentNamespace,
                    children: nextChildren,
                    childIndex: 0,
                    context: context,
                    footer: ''
                };

                this.stack.push(frame);
                return '';
            }
            // Safe because we just checked it's an element.
            const nextElement = nextChild;
            const elementType = nextElement.type;

            if (typeNumber(elementType) === 4) {
                return this.renderDOM(nextElement, context, parentNamespace);
            }

            switch (elementType) {
                case REACT_STRICT_MODE_TYPE:
                case REACT_ASYNC_MODE_TYPE:
                case REACT_PROFILER_TYPE:
                case REACT_FRAGMENT_TYPE:
                    {
                        const nextChildren = toArray(nextChild.props.children);
                        const frame = {
                            type: null,
                            domNamespace: parentNamespace,
                            children: nextChildren,
                            childIndex: 0,
                            context: context,
                            footer: ''
                        };

                        this.stack.push(frame);
                        return '';
                    }
                    // eslint-disable-next-line-no-fallthrough
                default:
                    break;
            }
            if (typeof elementType === 'object' && elementType !== null) {
                switch (elementType.$$typeof) {
                    case REACT_FORWARD_REF_TYPE:
                        {
                            const element = nextChild;
                            const nextChildren = toArray(
                                elementType.render(element.props, element.ref)
                            );
                            const frame = {
                                type: null,
                                domNamespace: parentNamespace,
                                children: nextChildren,
                                childIndex: 0,
                                context: context,
                                footer: ''
                            };

                            this.stack.push(frame);
                            return '';
                        }
                    case REACT_PROVIDER_TYPE:
                        {
                            const provider = nextChild;
                            const nextProps = provider.props;
                            const nextChildren = toArray(nextProps.children);
                            const frame = {
                                type: provider,
                                domNamespace: parentNamespace,
                                children: nextChildren,
                                childIndex: 0,
                                context: context,
                                footer: ''
                            };

                            this.pushProvider(provider);

                            this.stack.push(frame);
                            return '';
                        }
                    case REACT_CONTEXT_TYPE:
                        {
                            const consumer = nextChild;
                            const nextProps = consumer.props;
                            const nextValue = consumer.type._currentValue;

                            const nextChildren = toArray(nextProps.children(nextValue));
                            const frame = {
                                type: nextChild,
                                domNamespace: parentNamespace,
                                children: nextChildren,
                                childIndex: 0,
                                context: context,
                                footer: ''
                            };

                            this.stack.push(frame);
                            return '';
                        }
                    default:
                        break;
                }
            }

            let info = '';

            invariant(
                false,
                'Element type is invalid: expected a string (for built-in ' +
                'components) or a class/function (for composite components) ' +
                'but got: %s.%s',
                elementType == null ? elementType : typeof elementType,
                info
            );
        }
    },

    renderDOM(element, context, parentNamespace) {
        const tag = element.type.toLowerCase();

        let namespace = parentNamespace;
        if (parentNamespace === Namespaces.html) {
            namespace = getIntrinsicNamespace(tag);
        }

        let props = element.props;
        //input,select,textarea,option元素需要特殊处理
        if (isFn(duplexMap[tag])) {
            props = duplexMap[tag](props, this);
        }

        let out = createOpenTagMarkup(
            element.type,
            tag,
            props,
            namespace,
            this.makeStaticMarkup,
            this.stack.length === 1
        );
        let footer = '';
        if (omittedCloseTags.hasOwnProperty(tag)) {
            out += '/>';
        } else {
            out += '>';
            footer = '</' + element.type + '>';
        }
        let children;
        const innerMarkup = getNonChildrenInnerMarkup(props);
        if (innerMarkup != null) {
            children = [];
            if (newlineEatingTags[tag] && innerMarkup.charAt(0) === '\n') {
                // text/html ignores the first character in these tags if it's a newline
                // Prefer to break application/xml over text/html (for now) by adding
                // a newline specifically to get eaten by the parser. (Alternately for
                // textareas, replacing "^\n" with "\r\n" doesn't get eaten, and the first
                // \r is normalized out by HTMLTextAreaElement#value.)
                // See: <http://www.w3.org/TR/html-polyglot/#newlines-in-textarea-and-pre>
                // See: <http://www.w3.org/TR/html5/syntax.html#element-restrictions>
                // See: <http://www.w3.org/TR/html5/syntax.html#newlines>
                // See: Parsing of "textarea" "listing" and "pre" elements
                //  from <http://www.w3.org/TR/html5/syntax.html#parsing-main-inbody>
                out += '\n';
            }
            out += innerMarkup;
        } else {
            children = toArray(props.children);
        }
        const frame = {
            domNamespace: getChildNamespace(parentNamespace, element.type),
            type: tag,
            children,
            childIndex: 0,
            context: context,
            footer: footer
        };
        this.stack.push(frame);
        this.previousWasTextNode = false;
        return out;
    }
};

function resolve(child, context) {
    while (isValidElement(child)) {
        // Safe because we just checked it's an element.
        let element = child;
        let Component = element.type;

        if (!isFn(Component)) {
            break;
        }
        processChild(element, Component);
    }

    // Extra closure so queue and replace can be captured properly
    function processChild(element, Component) {
        let publicContext = processContext(Component, context);

        let queue = [];
        let replace = false;
        let updater = {
            isMounted: function() {
                return false;
            },
            enqueueForceUpdate: function() {
                if (queue === null) {
                    return null;
                }
            },
            enqueueReplaceState: function(publicInstance, completeState) {
                replace = true;
                queue = [completeState];
            },
            enqueueSetState: function(publicInstance, currentPartialState) {
                if (queue === null) {
                    return null;
                }
                queue.push(currentPartialState);
            }
        };

        let inst;
        var hasGSFP = isFn(Component.getDerivedStateFromProps);
        //创建实例
        if (shouldConstruct(Component)) {
            inst = new Component(element.props, publicContext, updater);
            if (hasGSFP) {
                let partialState = Component.getDerivedStateFromProps.call(
                    null,
                    element.props,
                    inst.state
                );
                if (partialState != null) {
                    inst.state = Object.assign({}, inst.state, partialState);
                }
            }
        } else {
            inst = Component(element.props, publicContext, updater);
            if (inst == null || inst.render == null) {
                child = inst;
                return;
            }
        }

        inst.props = element.props;
        inst.context = publicContext;
        inst.updater = updater;

        let initialState = inst.state;
        if (initialState === undefined) {
            inst.state = initialState = null;
        }
        //执行componentWillMount钩子
        var willMountHook = hasGSFP ?
            'UNSAFE_componentWillMount' :
            'componentWillMount';

        if (isFn(inst[willMountHook])) {
            inst[willMountHook]();
            if (queue.length) {
                let oldQueue = queue;
                let oldReplace = replace;
                queue = null;
                replace = false;

                if (oldReplace && oldQueue.length === 1) {
                    inst.state = oldQueue[0];
                } else {
                    let nextState = oldReplace ? oldQueue[0] : inst.state;
                    let dontMutate = true;
                    for (let i = oldReplace ? 1 : 0; i < oldQueue.length; i++) {
                        let partial = oldQueue[i];
                        let partialState = isFn(partial) ?
                            partial.call(inst, nextState, element.props, publicContext) :
                            partial;
                        if (partialState != null) {
                            if (dontMutate) {
                                dontMutate = false;
                                nextState = Object.assign({}, nextState, partialState);
                            } else {
                                Object.assign(nextState, partialState);
                            }
                        }
                    }
                    inst.state = nextState;
                }
            } else {
                queue = null;
            }
        }
        //执行render
        child = inst.render();
        //执行getChildContext
        if (isFn(inst.getChildContext)) {
            let childContext = inst.getChildContext();
            if (childContext) {
                context = Object.assign({}, context, childContext);
            }
        }
    }
    return {
        child,
        context
    };
}

export default ReactDOMServerRenderer;
(function umd(root, factory) {
    if (typeof exports === "object" && typeof module === "object") {
        module.exports = factory(require("react"));
    } else if (typeof define === "function" && define.amd) {
        define(["react"], factory);
    } else if (typeof exports === "object") {
        exports["ReactTestUtils"] = factory(require("react"));
    } else {
        root["ReactTestUtils"] = factory(root["React"]);
    }
})(this, function(React) {
    function findAllInRenderedTree1(inst, test, ret) {
        ret = ret || [];
        if (!inst) {
            return ret;
        }
        if (inst.vtype === 0) {
            //如果是文本，注释
            return ret;
        } else if (inst.vtype === 1) {
            //如果是元素虚拟DOM
            var dom = inst._hostNode;
            if (dom && test(dom)) {
                ret.push(dom);
            }
            var children = inst.props.children;
            if (children) {
                if (children.vtype) {
                    findAllInRenderedTree1(children, test, ret);
                } else if (Array.isArray(children)) {
                    children.forEach(function(el) {
                        if (el && el.vtype) {
                            findAllInRenderedTree1(children, test, ret);
                        }
                    });
                }
            }
        } else if (inst.vtype > 1) {
            //如果是组件虚拟DOM
            var instance = inst._instance;
            findAllInRenderedTree1(getRendered(instance), test, ret);
        } else if (inst.refs) {
            //组件实例都带有refs对象
            var vnode = getRendered(inst);
            findAllInRenderedTree1(vnode, test, ret);
        }
        return ret;
    }

    function findAllInRenderedTree2(target, test, ret) {
        ret = ret || [];
        if (!target) {
            return ret;
        }
        if (target.refs) {
            //组件实例都带有refs对象
            var vnode = target.updater.vnode;
            return findAllInRenderedTree2(vnode, test, ret);
        }

        if (target.vtype <= 1) {
            var dom = target.stateNode;
            if (dom && dom.nodeType === 1 && test(dom)) {
                ret.push(dom);
            }
            findAllInRenderedTree2(target.child, test, ret);
        } else if (target.vtype > 1) {
            //如果是组件虚拟DOM
            findAllInRenderedTree2(target.child, test, ret);
        }
        findAllInRenderedTree2(target.sibling, test, ret);
        return ret;
    }
    var findAllInRenderedTree = React.createPortal ? findAllInRenderedTree2 : findAllInRenderedTree1;

    function getRendered(instance) {
        //1.1.2之前，组件实例有一个__rendered属性，1.1.2时，就将私有属性统统塞到updater对象上
        return instance.updater ? instance.updater.rendered : instance.__rendered;
    }
    var ReactTestUtils = {
        renderIntoDocument: function(element) {
            var div = document.createElement("div");
            return React.render(element, div);
        },

        isElement: function(element) {
            return React.isValidElement(element);
        },

        isElementOfType: function(inst, convenienceConstructor) {
            return React.isValidElement(inst) && inst.type === convenienceConstructor;
        },

        isDOMComponent: function(inst) {
            return !!(inst && inst.nodeType === 1 && inst.tagName);
        },

        isDOMComponentElement: function(inst) {
            //是否为元素节点
            return !!(inst && React.isValidElement(inst) && !!inst.tagName);
        },

        isCompositeComponent: function(inst) {
            //是否为组件实例
            if (ReactTestUtils.isDOMComponent(inst)) {
                return false;
            }
            return inst != null && typeof inst.render === "function" && typeof inst.setState === "function";
        },

        isCompositeComponentWithType: function(inst, type) {
            if (!ReactTestUtils.isCompositeComponent(inst)) {
                return false;
            }

            return inst.constructor === type;
        },

        isCompositeComponentElement: function(inst) {
            if (!React.isValidElement(inst)) {
                return false;
            }

            var prototype = inst.constructor.prototype;
            return typeof prototype.render === "function" && typeof prototype.setState === "function";
        },

        isCompositeComponentElementWithType: function(inst, type) {
            var constructor = inst.constructor;

            return !!(ReactTestUtils.isCompositeComponentElement(inst) && constructor === type);
        },

        getRenderedChildOfCompositeComponent: function(inst) {
            if (!ReactTestUtils.isCompositeComponent(inst)) {
                return null;
            }
            return inst.__rendered;
        },

        findAllInRenderedTree: function(inst, fn) {
            if (!inst) {
                return [];
            }
            return findAllInRenderedTree(inst, fn);
        },

        /**
         * 找出所有匹配指定className的节点
         */
        scryRenderedDOMComponentsWithClass: function(root, classNames) {
            return ReactTestUtils.findAllInRenderedTree(root, function(inst) {
                if (ReactTestUtils.isDOMComponent(inst)) {
                    var className = inst.className;
                    if (typeof className !== "string") {
                        // SVG, probably.
                        className = inst.getAttribute("class") || "";
                    }
                    var classList = className.split(/\s+/);
                    if (!Array.isArray(classNames)) {
                        classNames = classNames.split(/\s+/);
                    }
                    return classNames.every(function(name) {
                        return classList.indexOf(name) !== -1;
                    });
                }
                return false;
            });
        },

        /**
         *与scryRenderedDOMComponentsWithClass用法相同，但只返回一个节点，如有零个或多个匹配的节点就报错
         */
        findRenderedDOMComponentWithClass: function(root, className) {
            var all = ReactTestUtils.scryRenderedDOMComponentsWithClass(root, className);
            if (all.length !== 1) {
                throw new Error("Did not find exactly one match (found: " + all.length + ") " + "for class:" + className);
            }
            return all[0];
        },

        /**
         * 找出所有匹配指定标签的节点
         */
        scryRenderedDOMComponentsWithTag: function(root, tagName) {
            return ReactTestUtils.findAllInRenderedTree(root, function(inst) {
                return ReactTestUtils.isDOMComponent(inst) && inst.tagName.toUpperCase() === tagName.toUpperCase();
            });
        },

        /**
         * 与scryRenderedDOMComponentsWithTag用法相同，但只返回一个节点，如有零个或多个匹配的节点就报错
         */
        findRenderedDOMComponentWithTag: function(root, tagName) {
            var all = ReactTestUtils.scryRenderedDOMComponentsWithTag(root, tagName);
            if (all.length !== 1) {
                throw new Error("Did not find exactly one match (found: " + all.length + ") " + "for tag:" + tagName);
            }
            return all[0];
        },

        /**
         * 找出所有符合指定子组件的实例
         */
        scryRenderedComponentsWithType: function(root, componentType) {
            return ReactTestUtils.findAllInRenderedTree(root, function(inst) {
                return ReactTestUtils.isCompositeComponentWithType(inst, componentType);
            });
        },

        /**
         * 与scryRenderedComponentsWithType用法相同，但只返回一个节点，如有零个或多个匹配的节点就报错
         */
        findRenderedComponentWithType: function(root, componentType) {
            var all = ReactTestUtils.scryRenderedComponentsWithType(root, componentType);
            if (all.length !== 1) {
                throw new Error("Did not find exactly one match (found: " + all.length + ") " + "for componentType:" + componentType);
            }
            return all[0];
        },

        mockComponent: function(module, mockTagName) {
            mockTagName = mockTagName || module.mockTagName || "div";

            module.prototype.render.mockImplementation(function() {
                return React.createElement(mockTagName, null, this.props.children);
            });

            return this;
        },

        simulateNativeEventOnNode: function(topLevelType, node, fakeNativeEvent) {
            fakeNativeEvent.target = node;
            fakeNativeEvent.simulated = true;
            React.eventSystem.dispatchEvent(fakeNativeEvent, topLevelType);
        },

        simulateNativeEventOnDOMComponent: function(topLevelType, comp, fakeNativeEvent) {
            ReactTestUtils.simulateNativeEventOnNode(topLevelType, React.findDOMNode(comp), fakeNativeEvent);
        },

        nativeTouchData: function(x, y) {
            return {
                touches: [{ pageX: x, pageY: y }]
            };
        },

        Simulate: {},
        SimulateNative: {}
    };
    // ReactTestUtils.Simulate.click(element, options)
    "click,change,keyDown,keyUp,KeyPress,mouseDown,mouseUp,mouseMove,input".replace(/\w+/g, function(name) {
        ReactTestUtils.Simulate[name] = function(node, opts) {
            if (!node || node.nodeType !== 1) {
                throw "第一个参数必须为元素节点";
            }
            var fakeNativeEvent = opts || {};

            fakeNativeEvent.target =  fakeNativeEvent.target || node;
            fakeNativeEvent.simulated = true;
            var eventName = name.toLowerCase();
            fakeNativeEvent.type = eventName;
            var fn = node["on" + eventName];
           
            React.eventSystem.dispatchEvent(fakeNativeEvent, eventName);
            if (fn) {
                try{
                    fn.call(node, fakeNativeEvent);
                }catch(e){}
            }
            
        };
    });
    return ReactTestUtils;
});

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
})(this, function (React) {


    function getFiber(inst) {
        return inst._reactInternalFiber || inst.updater;
    }
    //收集符合条件的元素节点
    function findChildren(fiber, callback, ret) {

        for (var i in fiber.children) {
            var a = fiber.children[i];
            findAllInRenderedTreeImpl(a, callback, ret);
        }
    }
    function findAllInRenderedTreeImpl(target, callback, ret) {
        if (!target) {
            return;
        } else if (target.nodeType) {
            if (callback(target)) {
                ret.push(target);
            }
        } else if (target.render) {//实例
            var fiber = getFiber(target);
            findChildren(fiber, callback, ret);
        } else if (target.tag + 0 === target.tag) {
            var instance = target.stateNode;
            if (callback(instance)) {
                ret.push(instance);
            }
            if (instance.render) {//实例
                findChildren(getFiber(instance), callback, ret);
            } else if (target.tag == 5) {
                findChildren(target, callback, ret);
            }
        }
    }


    var ReactTestUtils = {
        renderIntoDocument: function (element) {
            var div = document.createElement("div");
            return ReactDOM.render(element, div);
        },

        isElement: function (element) {
            return React.isValidElement(element);
        },

        isElementOfType: function (inst, convenienceConstructor) {
            return React.isValidElement(inst) && inst.type === convenienceConstructor;
        },

        isDOMComponent: function (inst) {
            return !!(inst && inst.nodeType === 1 && inst.tagName);
        },

        isDOMComponentElement: function (inst) {
            //是否为元素节点
            return !!(inst && React.isValidElement(inst) && !!inst.tagName);
        },

        isCompositeComponent: function (inst) {
            //是否为组件实例
            if (ReactTestUtils.isDOMComponent(inst)) {
                return false;
            }
            return inst != null && typeof inst.render === "function" && typeof inst.setState === "function";
        },

        isCompositeComponentWithType: function (inst, type) {
            if (!ReactTestUtils.isCompositeComponent(inst)) {
                return false;
            }

            return inst.constructor === type;
        },

        isCompositeComponentElement: function (inst) {
            if (!React.isValidElement(inst)) {
                return false;
            }

            var prototype = inst.constructor.prototype;
            return typeof prototype.render === "function" && typeof prototype.setState === "function";
        },

        isCompositeComponentElementWithType: function (inst, type) {

            if (!ReactTestUtils.isCompositeComponent(inst)) {
                return false;
            }
            const fiber = inst._reactInternalFiber || {};
            return fiber.type = type;
        },

        findAllInRenderedTree: function (inst, fn) {
            var ret = [];
            if (!inst) {
                return ret;
            }
            findAllInRenderedTreeImpl(inst, fn, ret);
            return ret;
        },

        /**
         * 相当于getElementsByClassName
         */
        scryRenderedDOMComponentsWithClass: function (root, classNames) {

            return ReactTestUtils.findAllInRenderedTree(root, function (inst) {
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
                    return classNames.every(function (name) {
                        return classList.indexOf(name) !== -1;
                    });
                }
                return false;
            });
        },

        /**
         *相当于getElementByClassName(注意最多返回一个)，不等于1个就抛错
         */
        findRenderedDOMComponentWithClass: function (root, className) {
            var all = ReactTestUtils.scryRenderedDOMComponentsWithClass(root, className);
            if (all.length !== 1) {
                throw new Error("Did not find exactly one match (found: " + all.length + ") " + "for class:" + className);
            }
            return all[0];
        },

        /**
         * 相当于getElementsByTag
         */
        scryRenderedDOMComponentsWithTag: function (root, tagName) {
            return ReactTestUtils.findAllInRenderedTree(root, function (inst) {
                return ReactTestUtils.isDOMComponent(inst) && inst.tagName.toUpperCase() === tagName.toUpperCase();
            });
        },

        /**
         * 相当于getElementByTag(注意最多返回一个)，不等于1个就抛错
         */
        findRenderedDOMComponentWithTag: function (root, tagName) {
            var all = ReactTestUtils.scryRenderedDOMComponentsWithTag(root, tagName);
            if (all.length !== 1) {
                throw new Error("Did not find exactly one match (found: " + all.length + ") " + "for tag:" + tagName);
            }
            return all[0];
        },

        /**
         * 找出所有符合指定子组件的实例
         */
        scryRenderedComponentsWithType: function (root, componentType) {
            return ReactTestUtils.findAllInRenderedTree(root, function (inst) {
                return ReactTestUtils.isCompositeComponentWithType(inst, componentType);
            });
        },

        /**
         * 与scryRenderedComponentsWithType用法相同，但只返回一个节点，如有零个或多个匹配的节点就报错
         */
        findRenderedComponentWithType: function (root, componentType) {
            var all = ReactTestUtils.scryRenderedComponentsWithType(root, componentType);
            if (all.length !== 1) {
                throw new Error("Did not find exactly one match (found: " + all.length + ") " + "for componentType:" + componentType);
            }
            return all[0];
        },

        mockComponent: function (module, mockTagName) {
            mockTagName = mockTagName || module.mockTagName || "div";

            module.prototype.render.mockImplementation(function () {
                return React.createElement(mockTagName, null, this.props.children);
            });

            return this;
        },

        simulateNativeEventOnNode: function (topLevelType, node, fakeNativeEvent) {
            fakeNativeEvent.target = node;
            fakeNativeEvent.simulated = true;
            if(topLevelType.indexOf("top") === 0){
                topLevelType = topLevelType.slice(3).toLowerCase()
            }

            React.eventSystem.dispatchEvent(fakeNativeEvent, topLevelType);
        },

        simulateNativeEventOnDOMComponent: function (topLevelType, comp, fakeNativeEvent) {
            ReactTestUtils.simulateNativeEventOnNode(topLevelType, React.findDOMNode(comp), fakeNativeEvent);
        },

        nativeTouchData: function (x, y) {
            return {
                touches: [{ pageX: x, pageY: y }]
            };
        },

        Simulate: {},
        SimulateNative: {}
    };
    // ReactTestUtils.Simulate.click(element, options)
    "click,change,keyDown,keyUp,KeyPress,mouseDown,mouseUp,mouseMove,input,focus,blur".replace(/\w+/g, function (name) {
        ReactTestUtils.Simulate[name] = function (node, opts) {
            if (!node || node.nodeType !== 1) {
                throw "第一个参数必须为元素节点";
            }
            var fakeNativeEvent = opts || {};
           
            var fakeTarget = fakeNativeEvent.target;
            if(fakeTarget && !fakeTarget.appendChild){
                for(var i in fakeTarget){
                    node[i] = fakeTarget[i];
                }
            }
            
            fakeNativeEvent.target = node;
           

            fakeNativeEvent.simulated = true;
            var eventName = name.toLowerCase();
            fakeNativeEvent.type = eventName;
            var fn = node["on" + eventName];

            React.eventSystem.dispatchEvent(fakeNativeEvent, eventName);
            if (fn) {
                try {
                    fn.call(node, fakeNativeEvent);
                } catch (e) { }
            }

        };
    });
    ReactTestUtils.SimulateNative = ReactTestUtils.Simulate;
    return ReactTestUtils;
});

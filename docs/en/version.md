## 1.4.3 (2018.06.14)

1. miniCreateClass default to using IEComponent in the old IE,
2. Fix bug that createClass does not continue mixin
3. Remove all element nodes below the option element
4. Remove NULLREF task, add DUPLEX task, ahead of all dom related tasks
5. Built-in router supports IE8 hashchange
6. updateContext renamed updateContent, this is a mistake

## 1.4.2 (2018.06.07)

1. add miniCreateClass, and use it to recreate createClass, Unbatch, PureComponent, createContext
2. Add a WORKING task to avoid whole tree updates
3. Fix IE8-compatible BUG for option in controlled component
4. Add a built-in router

## 1.4.1 (2018.06.04)

The content of the text node is directly replaced with fiber.props
2. Fix input pinyin input method BUG
3. Fix the bug in updateHostComponent that overrides the children object
4. Fixed createClass BUG
5. Correct SSR BUG
6. Simplify the commitDFS loop

## 1.4.0 (2018.05.30)

1. Test all changed to jest
2. The cwu hook must be removed when calling
3. When updating batches, each component can only be updated once
4. Reconfigure the controlled components. They will be delayed and executed in batchedUpdate. Run all the tests.
5. emptyElement is no longer recursively removed, but recursively flushes the data attached to the element node to prevent memory leaks.
6. Move createClass out of the core library
7. Reconstruct the error boundary, the border component with captureValues, catchError, catchError flag, and put into the global boundaryaries
8. Reconstruct the contextStack, after the setState is guaranteed, restore the previous stack from the unmaskedContext of the current component.


## 1.3.2 (2018.04.16)

1. Handling the onChange event BUG of the Chinese input method under the mobile terminal

## 1.3.1 (2018.03.18)

1. React.Fragment support key attribute
2. Fixed an update bug that had a `lifecycle stateless component`
3. Implement React.createRef and React.forwardRef
4. new packages createResource and createSubscription processing state, put in lib
5. Var changes collectively to let const

## 1.3.0 (2018.03.06)

1. Support createContext new API for React 16.3
2. Add a lot of React.Fragment test, fix some edge bugs
3. Upgrade diff mechanism, compare old and new vnodes, change to fiber and compare new vnodes, use new vnode data to update fiber and view
4. Added input[type=search] onChange event support
5. Fixed an edge bug in the antd3.0 portal (repeatedly inserted twice, resulting in the text node disappearing)
6. Major changes to property names and method names, and React16‘s Fiber close
   * `vnode.vtype` --> fiber.tag
   * `instance.__isStateless` --> fiber._isStateless
   * `updater` --> fiber
   * `updater.vnode` --> fiber._reactInternalFiber
   * `updater.willReceive` --> fiber._willReceive
   * `updater.children` --> fiber._children
   * `updater.isMounted()` --> fiber._isMounted()
   * `updater.insertCarrier` --> fiber._mountCarrier
   * `updater.insertPoint` --> fiber._mountPoint
   * `updater.parentContext` --> fiber._unmaskedContext
   * `getChildContext` --> getUnmaskedContext
   * `getContextByTypes` --> is getMaskedContext
   * `CompositeUpdater.js` --> ComponentFiber.js`
   * `DOMUpdater.js` --> HostFiber.js

## 1.2.9 (2018.02.06)

1. Fix focus/blur event implementation
2. Fix IE6-8 under onchange because it is implemented with onproperty, it will cause infinite loop BUG
3. Fixed the bug that diffProps could not modify the type attribute of the input element and instead immediately added the type attribute to the createElement method

## 1.2.8 (2018.02.02)

1. Simplify the implementation of focus/blur events, IE7-8 implementation is more streamlined
2. Correct the calculation of the properties of the wheel event, consistent with the official
3. In order to support react-hot-loader, vnode.updater.vnode is renamed vnode.updater._reactInnerFiber, and vtype is renamed to tag.
4. Test tools and debugging tools have some property adjustments

## 1.2.7 (2018.02.01)

1. Correct the execution condition of componentWillReceiveProps
2. Support children as functions
3. Modify the position of the _disposed switch
4. Fix focus system, it will only execute in browser insertElement, removeElement
5. Fix the binding of focus/blur events, and need to mask internal events when capturing
6. Fixed an invalid DOM insert operation in insertElement and insertElement passed in CompositeUpdatet.hydrate

## 1.2.6 (2018.01.26)

Fixed an error pointing to the context object in unstable_renderSubtreeIntoContainer

## 1.2.5 (2018.01.23)

1. Fixed BUG of controlled component radio, which could not modify value

## 1.2.4 (2018.01.22)

1. Solve the mobile side scroll event

## 1.2.3 (2018.01.12)

1. Resolve mobile click events

## 1.2.2 (2018.01.05)

1. Solve the problem of PropTypes share
2. Fix the inherit BUG of utils
3. Add renderToNodeStream support for backend rendering
4. Component adds isReactCompent method to enhance support for third parties

## 1.2.2 (2017.12.30)

1. The cloneElement needs to handle the disposed element
2. cloneElement copy the virtual DOM of the props
3. Set the timing of attributes in advance


## 1.2.1 (2017.12.27)

1. Optimize fiberizeChildren's performance
2. Fix the BUG of the controlled component in the textarea, radio, and put the controlled event into the user?
3. Add focus system support (global focus, blur event listens in advance, remove the Refs.nodeOperate start node)
4. Resolve the bug in option.async of the event system when React is introduced multiple times.
5. Simplify the implementation of createPortal
6. Fragment syntax sugar supporting React 16.2


## 1.2.0(2017.12.17) Support React16

1. Reconstruct findDOMNode, encountered comment node returns null
2. Support React component returns any data type, such as arrays, strings, numbers, Boolean, but for undefined, null, boolean does not generate a real DOM
3. Support logic for componentDidCatch hooks and entire error boundaries
4. support createPortal
5. Detach the Vndoe module with its node relationship attribute (return, sibling, child),
   * return is equivalent to the previous _hostParent,
   * sibling is equivalent to nextSibling,
   * child is equivalent to firstChild,
6. Mimic React16 and use the `stateNode attribute` instead of the old _hostNode and _instance.
7. The method of React.Children and flattenChilden underlying dependencies is changed from _flattenChildren to operatedChildren to make it more versatile.
   flattenChilden is renamed to fiberizeChildren and produces an array with a linked list structure.
8. New architecture: element virtual DOM and component virtual DOM have their own updated objects, simplify the matching algorithm
9. Simplify the Refs module
10. Fixed bug that namespaceURI is missing when updating virtual DOM
11. componentDidUpdate now only has two parameters, lastProps and lastState


## 1.1.4 (2017.10.20)

1. Fix updater object leaks in flushUpdaters (requires clearArray)
2. Optimize the diffChildren's logic to prevent parentNode equal to null (like fetching firstChild for text nodes)
3. Simplified ControlledComponent and dispose modules
4. Dealing with the same reference in the updateElement method for two virtual DOMs when the old vchildren is lost when flattenChildren is called
5. Remove createStringRef, createInsanceRef, add fireRef in Refs,
   Refactor detachRef, clearRefs, cloneElement, createElement ref parts to minimize the use of closures
6. Remove the updateQueue array from all diff methods and merge them into the scheduler

## 1.1.3 (2017.10.08)

1. Abstract an Update class that encapsulates all private data on a component instance
2. Abstract an instantiateComponente for instantiating stateful and stateless components at the same time, no more mountStateless, updateStateless methods
3. Fix the checkpoint point triggers two bugs onChange
4. Add ReceiveComponent detection mechanism, if the context, props, then will not perform the receive, render, update hooks
5. Modify the logic to detect empty objects
6. Simplify the logic of the task scheduling system

## 1.1.2 (2017.10.01)

1. Fixed onChange event
2. Refactoring the implementation of the diffProps module
3. Support component isMounted method
4. Add beforePatch, afterPatch hook
5. Add lib/ReactInputSelection.js
6. Unify the parameters of all methods that operate on the virtual DOM (mountXXX, updateXXX, alignXXX series)

>1 The first parameter is the old real DOM or the old virtual DOM
>2 The second parameter is the new virtual DOM
>3 The third parameter is the parent virtual DOM (may not exist, then directly followed by the fourth, fifth)
>4 The fourth parameter is the context object
>5 The fifth parameter is the task scheduling system

7. Get a new namespace for the element's namespace
8. On-line new node sorting algorithm (diffChildren)
9. renderByAnu should empty CurrentOwner.cur after global rendering to prevent affecting other virtual DOM
10. Perfect createStringRef method, should be able to throw wrong and delete useless data
11. New on-line task scheduling system
12. Refactoring the unmountComponentAtNode method
13. Add a reference to the contextType of the child component to determine whether to update it if adding references to both virtual DOMs is the same
14. The stateless component supports module mode (returns a pure object with life cycle hooks. These methods are invoked like stateful components)
15. Relax shouldComponentUpdate's limit and return any false value to prevent descendants from updating
16. Correct the ref update method
17. When shouldComponentUpdate returns a false value, the current virtual DOM should absorb useful information of the old virtual DOM

## 1.1.1 (2017.9.9)

Simplify createClass
2. Fixed flattenHooks BUG, ​​if there is only one function in hooks, there is no need to include a layer
3. The implementation of the reconstructed virtual DOM tree, consistent with the official React, that props.children is now a variety of forms, only to create a vchildren for comparison when delayed to diff
4. Fixed disposeElement. If there is dangerously setInnerHTML, it is necessary to clear the interior of the element, without going through the branch of the sub-virtual DOM.
5. Fixed diffProps, SVG elements are case sensitive as viewBox preserveAspectRation
6. When the component is updated, it is detected whether the context changes
7. Implement the persist method for the event object
8. Fixed this pointing to the callback of unstable_renderSubtreeIntoContainer
9. Fixed unmountComponentAtNode BUG, ​​#text changed to #comment
10. Fix the cloneElement BUG to ensure that children and _owner are correctly passed in
11. Fix the ref mechanism, if it is a string, pass the current ref, owner via the createStringRef method, and return a curry method when in cloneElement
    The method created by createStringRef is then integrated into the new ref method to ensure that the old owner is updated again
12. Fixed implementation of getNs method (originally using hash table for exhaustive, but svg document also has a, script, style elements, resulting in indistinguishable)
13. The user is using setState in componentDidUpdate is improper operation, leading to enter the infinite loop, use the timer to slow down the call frequency, prevent the page stuck (the official React also exists a similar mechanism)

## 1.1.0 (2017.08.28)

1. The disabled element cannot trigger a click event
2. Fix bug in mouseenter/mouseleave in IE6-8, related to correct acquisition of TargetTarget and LCA processing
3. Simplify the logic of alignVnode and reduce the generation of insert queues
4. Reconstruct setStateImpl,
5. `_component` is renamed to `__component`, `_currentElement` is renamed to `__current`
6. Add some simple peripheral modules to react/lib, such as ReactComponentWithPureRenderMixin, shallowCompare, sliceChildren


## 1.0.8 (2017.08.18)

1. event.originalEvent renamed event.nativeEvent
2. Fixed Bug of forEach in polyfill
Remove the scheduler module
4. Remove the instanceMap module
5. Fix the bug that typeNumber is under iE6-8
6. `eventSystem.addGlobalEventListener` renamed to eventSystem.addGlobalEvent
7. Avoid the problem that insertBfore cannot be undefined in IE8.
8. Fix the bug that the ref delays execution. If the vnode of the component has the ref attribute, it should be put in the `__pendingRefs` array of this component instead of the `__pendingRefs` array of the parent component.
   In addition the elements in the `__pendingRefs` array are changed from objects to functions
9. After the componentDidMount hook executes setState in the component, all callbacks should be delayed outside componentDidUpdate
10. Make sure the instance in mountComponent should be saved to vnode as soon as possible
11. Fixed a bug that only executed dangeroussetInnerHTML in the updateElement method
12. Handling mouseenter/mouseleave compatibility issues
13. Handling focus/blur compatibility issues

## 1.0.7 (2017.07.29)

1. Handle the user in the render method return this.props.children, you need to convert the array to a single virtual DOM
2. The case where two component virtual DOMs are not instantiated
3. Only recycle text nodes
4. Support mouseenter/mouseleave and reconstruct event system


## 1.0.6 (2017.07.24)

1. Re-support Chrome DevTools
2. Add support for Immutable.js
3. Fix the bug that the user executed setState to cause an infinite loop in the componentWillUpdate/shouldComponentUpdate/componentDidUpdate hook


## 1.0.5 (2017.07.14)

1. Optimize the scheduler mechanism
2 to achieve support for createFactory
3. Optimize dispose module
4. Use typeNumber instead of typeof keyword to reduce the packaged volume


## 1.0.4 (2017.07.07)

1. Fix errors to preventdefault inside passive event listener due to target
   This is chrome51+. To improve performance, the problem caused by the preventDefault method is disabled by default for the touchmove/mousemove/mousewheel event.
2. Destroy element nodes and completely clear the _component and __events references
3. Cancel refs.xxx = null operation, to ensure that the component may be animated after destruction, there will be no error DOM operation
4. Enhance props.children to support more legal types
5 to achieve support for createClass
6. Implementing support for mixins

## 1.0.3 (2017.07.25)

1. Implements unstable_renderSubtreeIntoContainer, findDOMNode, isValidElement methods
2. Implement complete support for Children (only, count, forEach, map, toArray)
3. Compatible with focus, blur, wheel
4. BUG with no defaultProps added when updating components
5. Fixed some typos in diffProps
6. Compatible with event object pagex, pageY, which, currentTarget
7. Fix the bug that user invokes setState when componentWillMount is called
8. The cloneElement should be able to process the array and remove its first element.
9. Cancel the transaction mechanism and change it to a scheduled task

## 1.0.2 (2017.06.20)

1. Compatible with IE to implement the corresponding polyfill file
2. Implement change, input, and submit events for IE6-8
3. Add processing for select.value


## 1.0.1 (2017.06.09)

1. Supports cloneElement


## 1.0.0 (2017.06.05)
1. Post anu
点击图标下载 App

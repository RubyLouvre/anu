window.ydoc_plugin_search_json = {
  "English": [
    {
      "title": "anu",
      "content": "\n\nanujs is a highly React16-compliant Mini React framework that is compatible with  React16.3.0, runs through the official 788 test cases, and supports 99% of the React ecosystem's components and UI libraries.Chinese users can join QQ group: 370262116As we all know, React has been criticized for being too big, so I re-implemented React on the basis of reading its source code, and only one third of React+ReactDOM after gz. For detailed data, see https://bundlephobia.com/, anu@1.4.3 is only 13.1 kb, react@16.4.1 is 2.3 kb, and react-dom@16.4.1 is 30.5 kb. If a router is used, react-router-dom@4.3.1 is 11 kb and reach@1.0.1 is 4.3 kb.",
      "url": "/en/index.html",
      "children": [
        {
          "title": "volume ratio",
          "url": "/en/index.html#volume-ratio",
          "content": "volume ratioNow React Family Bucket has the following common packagesPackage 1:react + react-dom + react-router-dom + redux + react-redux + redux-saga,Volume is 2.3 + 30.5 + 11 + 5 + 4.3 + 8.4 = 61.4 kb\nSuitable for just getting startedPackage 2:react + react-dom + react-router-dom + mobx + mobx-reactVolume is 2.3 + 30.5 + 11 + 13.8 + 6.4 = 64 kb\nSuitable for people who complain about reduxPackage 3: anujs + reach + redux + react-redux + rematchVolume is 13.1 + 6 + 2.5 + 5 + 4.3 = 31 kb\nSuitable for people with requirements for volume, compatibility and ease of useThe measurement tools for the above code are gzip-size-cli, jsize and https://bundlephobia.com/"
        },
        {
          "title": "Compared to other mini reacts",
          "url": "/en/index.html#compared-to-other-mini-reacts",
          "content": "Compared to other mini reactsThe main competition products are inferno, preact, rax, react-lite, nervjs, the first two are overseas, and the last three are Chinese. China has a relatively high volume due to the state of the Internet.inferno, need to add inferno-compat, in order to be consistent with the official API, but in the case of component suites, the execution order of the life cycle hooks is inconsistent with the official, so it is not compatible with most of React's UI library. Older IE is not supported.preact requires preact-compat to be consistent with the official API. However, in the case of component components, the execution sequence of lifecycle hooks is inconsistent with that of the official. Therefore, it is not compatible with most of React's UI libraries. Preact-compat internally uses Object.definePropety, so it cannot be used in IE8, and it also causes its performance to be severely degraded.**rax\"\", launched by China's Alibaba Group, supports most APIs of React16, does not support IE8, can run some React UI libraries.**react-lite\"\", launched by China's Ctrip Group, is only compatible with React15, supports IE8, and runs some React UI libraries.nervjs, launched by China's Jingdong Group, supports most of the React16 APIs, code is very similar to inferno, rax, there is no case to prove that it is compatible with IE8, performance indicators are also very suspicious."
        },
        {
          "title": "anujs advantage",
          "url": "/en/index.html#anujs-advantage",
          "content": "anujs advantageSupports various new features of React16, Fragment, componentDidCatch, creactContext, createRef, forwardRef...\nRun nearly more than 800 official unit tests (other mini-banks cannot run official tests)\nSupport React Family Reactor (react-redux, react-router-red, react-router-redux, react-lazy-load, react-hot-loader...)\nSupport 99% antd component (antd is China's most famous React UI library)\n"
        },
        {
          "title": "Testing",
          "url": "/en/index.html#testing",
          "content": "Testingnpm test"
        }
      ]
    },
    {
      "title": "Install",
      "content": "npm i anujsHow to use in projects that already use React, modify webpack.config.jsconst es3ifyPlugin = require('es3ify-webpack-plugin');\nresolve: {\n    alias: {\n       'react': 'anujs',\n       'react-dom': 'anujs',\n         // For compatibility with IE please use the following configuration\n         // 'react': 'anujs/dist/ReactIE',\n         // 'react-dom': 'anujs/dist/ReactIE',\n         // If you reference prop-types or create-react-class\n         // Need to add the following alias\n         'prop-types': 'anujs/lib/ReactPropTypes',\n         'create-react-class': 'anujs/lib/createClass',\n         // If you use the onTouchTap event on the mobile side\n         'react-tap-event-plugin': 'anujs/lib/injectTapEventPlugin',\n    }\n},\nplugins: [ new es3ifyPlugin()]\n",
      "url": "/en/install.html",
      "children": []
    },
    {
      "title": "about the author",
      "content": "Shitou Nasami,front-end architect of China's Qunar.com\nproficient in DOM and JS\ncreated front-end frameworks such as mass, avalon, anus,\nauthor of the book \"javascript framework design\"\nand wrote more than 800 blog posts at https://www.cnblogs.com/\nLooking for overseas work\n",
      "url": "/en/author.html",
      "children": []
    },
    {
      "title": "Why create anujs",
      "content": "Each country has its own specific national conditions, mainly because the Chinese network is too slow, and there are a lot of old computers in China. They are preloaded with window XP, and Internet Explorer can only upgrade to IE8. For reasons, we need a smaller, more compatible React. And before Facebook also plagued the issue of LICENSE, it was also the promotion of Chinese Internet companies to determine their own R&D framework and strive to get rid of dependence on foreign frameworks.For our company, a travel company, online booking train tickets, air tickets, attractions tickets, providing tourism Raiders, there are a large number of IE users on the PC side.With the rapid development of mobile phone users in China, we also use React to develop touch-end pages, which also require a more mini React.Our company is working hard on React, trying to achieve a set of code that can run on iOS, Android, www pages, touch pages, WeChat applets, Huawei's light applications, and Xiaomi's fast applications.",
      "url": "/en/intention.html",
      "children": []
    },
    {
      "title": "Compatibility",
      "content": "",
      "url": "/en/compat.html",
      "children": [
        {
          "title": "language patches",
          "url": "/en/compat.html#language-patches",
          "content": "language patchesArray.isArray\nObject.assign\nJSON.stringify\nconsole-polyfill\nObject.keys\nObject.is\nArray.prototype.forEach\nFunction.prototype.bind\nOr directly use the dynamic patching scheme provided by https://polyfill.io/"
        },
        {
          "title": "Replace Core Library",
          "url": "/en/compat.html#replace-core-library",
          "content": "Replace Core LibraryThe core library should be changed from dist/React.js to dist/ReactIE.jsIt just added some special events compatible patch and innerHTML repair process on React.js.The IE event patch is for the repair of some non-bubble events (input, change, submit, focus, blur), and the handling of some specific event attributes (pageX, pageY of the mouse event, which of the keyboard events, wheelDetla of the scroll event)http://www.cnblogs.com/rubylouvre/p/5080464.html"
        },
        {
          "title": "Animation",
          "url": "/en/compat.html#animation",
          "content": "AnimationIf the user uses an animation library such as react-transition-group, please note the patch that introduces requestAnimationFrame"
        },
        {
          "title": "Uglify",
          "url": "/en/compat.html#uglify",
          "content": "UglifyIf you use compression, you need to deal with uglify-js, because IE6-8, for map.delete(\"ddd\"), modulex.default will write syntax errorBecause keywords cannot be attribute names and method names. We can handle it with es3ify-webpack-plugin or ʻes3ify-loader`.//npm install uglifyjs-webpack-plugin@1.0.0-beta.2  //UglifyJs3\nnew UglifyJsPlugin({\n    parallel: {\n        cache: true,\n        workers: 4,\n    },\n    uglifyOptions: {\n        mangle: {\n            eval: true,\n            toplevel: true,\n        },\n        parse: {\n            html5_comments: false,\n        },\n        output: {\n            comments: false,\n            ascii_only: true,\n            beautify: false,\n        },\n        ecma: 5,\n        ie8: false,\n        compresqs: {\n            properties: true,\n            unsafe: true,\n            unsafe_comps: true,\n            unsafe_math: true,\n            unsafe_proto: true,\n            unsafe_regexp: true,\n            unsafe_Func: true,\n            dead_code: true,\n            unused: true,\n            conditionals: true,\n            keep_fargs: false,\n            drop_console: true,\n            drop_debugger: true,\n            reduce_vars: true,\n            if_return: true,\n            comparisons: true,\n            evaluate: true,\n            booleans: true,\n            typeofs: false,\n            loops: true,\n            toplevel: true,\n            top_retain: true,\n            hoist_funs: true,\n            hoist_vars: true,\n            inline: true,\n            join_vars: true,\n            cascade: true,\n            collapse_vars: true,\n            reduce_vars: true,\n            negate_iife: true,\n            pure_getters: true,\n            pure_funcs: true,\n            // arrows: true,\n            passes: 3,\n            ecma: 5,\n        },\n    },\n    sourceMap: false,\n}),\n"
        },
        {
          "title": "React.createClass",
          "url": "/en/compat.html#react.createclass",
          "content": "React.createClassReact15 uses createClass to create the class. If you need this API, you can include anujs/lib/createClass.js in webpack."
        }
      ]
    },
    {
      "title": "",
      "content": "",
      "url": "/en/version.html",
      "children": [
        {
          "title": "1.4.3 (2018.06.14)",
          "url": "/en/version.html#1.4.3-2018.06.14",
          "content": "1.4.3 (2018.06.14)miniCreateClass default to using IEComponent in the old IE,\nFix bug that createClass does not continue mixin\nRemove all element nodes below the option element\nRemove NULLREF task, add DUPLEX task, ahead of all dom related tasks\nBuilt-in router supports IE8 hashchange\nupdateContext renamed updateContent, this is a mistake\n"
        },
        {
          "title": "1.4.2 (2018.06.07)",
          "url": "/en/version.html#1.4.2-2018.06.07",
          "content": "1.4.2 (2018.06.07)add miniCreateClass, and use it to recreate createClass, Unbatch, PureComponent, createContext\nAdd a WORKING task to avoid whole tree updates\nFix IE8-compatible BUG for option in controlled component\nAdd a built-in router\n"
        },
        {
          "title": "1.4.1 (2018.06.04)",
          "url": "/en/version.html#1.4.1-2018.06.04",
          "content": "1.4.1 (2018.06.04)The content of the text node is directly replaced with fiber.props2. Fix input pinyin input method BUG\n3. Fix the bug in updateHostComponent that overrides the children object\n4. Fixed createClass BUG\n5. Correct SSR BUG\n6. Simplify the commitDFS loop"
        },
        {
          "title": "1.4.0 (2018.05.30)",
          "url": "/en/version.html#1.4.0-2018.05.30",
          "content": "1.4.0 (2018.05.30)Test all changed to jest\nThe cwu hook must be removed when calling\nWhen updating batches, each component can only be updated once\nReconfigure the controlled components. They will be delayed and executed in batchedUpdate. Run all the tests.\nemptyElement is no longer recursively removed, but recursively flushes the data attached to the element node to prevent memory leaks.\nMove createClass out of the core library\nReconstruct the error boundary, the border component with captureValues, catchError, catchError flag, and put into the global boundaryaries\nReconstruct the contextStack, after the setState is guaranteed, restore the previous stack from the unmaskedContext of the current component.\n"
        },
        {
          "title": "1.3.2 (2018.04.16)",
          "url": "/en/version.html#1.3.2-2018.04.16",
          "content": "1.3.2 (2018.04.16)Handling the onChange event BUG of the Chinese input method under the mobile terminal\n"
        },
        {
          "title": "1.3.1 (2018.03.18)",
          "url": "/en/version.html#1.3.1-2018.03.18",
          "content": "1.3.1 (2018.03.18)React.Fragment support key attribute\nFixed an update bug that had a lifecycle stateless component\nImplement React.createRef and React.forwardRef\nnew packages createResource and createSubscription processing state, put in lib\nVar changes collectively to let const\n"
        },
        {
          "title": "1.3.0 (2018.03.06)",
          "url": "/en/version.html#1.3.0-2018.03.06",
          "content": "1.3.0 (2018.03.06)Support createContext new API for React 16.3\nAdd a lot of React.Fragment test, fix some edge bugs\nUpgrade diff mechanism, compare old and new vnodes, change to fiber and compare new vnodes, use new vnode data to update fiber and view\nAdded input[type=search] onChange event support\nFixed an edge bug in the antd3.0 portal (repeatedly inserted twice, resulting in the text node disappearing)\nMajor changes to property names and method names, and React16‘s Fiber close\n* vnode.vtype --> fiber.tag\n\ninstance.__isStateless --> fiber._isStateless\nupdater --> fiber\nupdater.vnode --> fiber._reactInternalFiber\nupdater.willReceive --> fiber._willReceive\nupdater.children --> fiber._children\nupdater.isMounted() --> fiber._isMounted()\nupdater.insertCarrier --> fiber._mountCarrier\nupdater.insertPoint --> fiber._mountPoint\nupdater.parentContext --> fiber._unmaskedContext\ngetChildContext --> getUnmaskedContext\ngetContextByTypes --> is getMaskedContext\nCompositeUpdater.js --> ComponentFiber.js`\nDOMUpdater.js --> HostFiber.js\n\n"
        },
        {
          "title": "1.2.9 (2018.02.06)",
          "url": "/en/version.html#1.2.9-2018.02.06",
          "content": "1.2.9 (2018.02.06)Fix focus/blur event implementation\nFix IE6-8 under onchange because it is implemented with onproperty, it will cause infinite loop BUG\nFixed the bug that diffProps could not modify the type attribute of the input element and instead immediately added the type attribute to the createElement method\n"
        },
        {
          "title": "1.2.8 (2018.02.02)",
          "url": "/en/version.html#1.2.8-2018.02.02",
          "content": "1.2.8 (2018.02.02)Simplify the implementation of focus/blur events, IE7-8 implementation is more streamlined\nCorrect the calculation of the properties of the wheel event, consistent with the official\nIn order to support react-hot-loader, vnode.updater.vnode is renamed vnode.updater._reactInnerFiber, and vtype is renamed to tag.\nTest tools and debugging tools have some property adjustments\n"
        },
        {
          "title": "1.2.7 (2018.02.01)",
          "url": "/en/version.html#1.2.7-2018.02.01",
          "content": "1.2.7 (2018.02.01)Correct the execution condition of componentWillReceiveProps\nSupport children as functions\nModify the position of the _disposed switch\nFix focus system, it will only execute in browser insertElement, removeElement\nFix the binding of focus/blur events, and need to mask internal events when capturing\nFixed an invalid DOM insert operation in insertElement and insertElement passed in CompositeUpdatet.hydrate\n"
        },
        {
          "title": "1.2.6 (2018.01.26)",
          "url": "/en/version.html#1.2.6-2018.01.26",
          "content": "1.2.6 (2018.01.26)Fixed an error pointing to the context object in unstable_renderSubtreeIntoContainer"
        },
        {
          "title": "1.2.5 (2018.01.23)",
          "url": "/en/version.html#1.2.5-2018.01.23",
          "content": "1.2.5 (2018.01.23)Fixed BUG of controlled component radio, which could not modify value\n"
        },
        {
          "title": "1.2.4 (2018.01.22)",
          "url": "/en/version.html#1.2.4-2018.01.22",
          "content": "1.2.4 (2018.01.22)Solve the mobile side scroll event\n"
        },
        {
          "title": "1.2.3 (2018.01.12)",
          "url": "/en/version.html#1.2.3-2018.01.12",
          "content": "1.2.3 (2018.01.12)Resolve mobile click events\n"
        },
        {
          "title": "1.2.2 (2018.01.05)",
          "url": "/en/version.html#1.2.2-2018.01.05",
          "content": "1.2.2 (2018.01.05)Solve the problem of PropTypes share\nFix the inherit BUG of utils\nAdd renderToNodeStream support for backend rendering\nComponent adds isReactCompent method to enhance support for third parties\n"
        },
        {
          "title": "1.2.2 (2017.12.30)",
          "url": "/en/version.html#1.2.2-2017.12.30",
          "content": "1.2.2 (2017.12.30)The cloneElement needs to handle the disposed element\ncloneElement copy the virtual DOM of the props\nSet the timing of attributes in advance\n"
        },
        {
          "title": "1.2.1 (2017.12.27)",
          "url": "/en/version.html#1.2.1-2017.12.27",
          "content": "1.2.1 (2017.12.27)Optimize fiberizeChildren's performance\nFix the BUG of the controlled component in the textarea, radio, and put the controlled event into the user?\nAdd focus system support (global focus, blur event listens in advance, remove the Refs.nodeOperate start node)\nResolve the bug in option.async of the event system when React is introduced multiple times.\nSimplify the implementation of createPortal\nFragment syntax sugar supporting React 16.2\n"
        },
        {
          "title": "1.2.0(2017.12.17) Support React16",
          "url": "/en/version.html#1.2.02017.12.17-support-react16",
          "content": "1.2.0(2017.12.17) Support React16Reconstruct findDOMNode, encountered comment node returns null\nSupport React component returns any data type, such as arrays, strings, numbers, Boolean, but for undefined, null, boolean does not generate a real DOM\nSupport logic for componentDidCatch hooks and entire error boundaries\nsupport createPortal\nDetach the Vndoe module with its node relationship attribute (return, sibling, child),\n   * return is equivalent to the previous _hostParent,\n   * sibling is equivalent to nextSibling,\n   * child is equivalent to firstChild,\nMimic React16 and use the stateNode attribute instead of the old _hostNode and _instance.\nThe method of React.Children and flattenChilden underlying dependencies is changed from _flattenChildren to operatedChildren to make it more versatile.\n   flattenChilden is renamed to fiberizeChildren and produces an array with a linked list structure.\nNew architecture: element virtual DOM and component virtual DOM have their own updated objects, simplify the matching algorithm\nSimplify the Refs module\nFixed bug that namespaceURI is missing when updating virtual DOM\ncomponentDidUpdate now only has two parameters, lastProps and lastState\n"
        },
        {
          "title": "1.1.4 (2017.10.20)",
          "url": "/en/version.html#1.1.4-2017.10.20",
          "content": "1.1.4 (2017.10.20)Fix updater object leaks in flushUpdaters (requires clearArray)\nOptimize the diffChildren's logic to prevent parentNode equal to null (like fetching firstChild for text nodes)\nSimplified ControlledComponent and dispose modules\nDealing with the same reference in the updateElement method for two virtual DOMs when the old vchildren is lost when flattenChildren is called\nRemove createStringRef, createInsanceRef, add fireRef in Refs,\n   Refactor detachRef, clearRefs, cloneElement, createElement ref parts to minimize the use of closures\nRemove the updateQueue array from all diff methods and merge them into the scheduler\n"
        },
        {
          "title": "1.1.3 (2017.10.08)",
          "url": "/en/version.html#1.1.3-2017.10.08",
          "content": "1.1.3 (2017.10.08)Abstract an Update class that encapsulates all private data on a component instance\nAbstract an instantiateComponente for instantiating stateful and stateless components at the same time, no more mountStateless, updateStateless methods\nFix the checkpoint point triggers two bugs onChange\nAdd ReceiveComponent detection mechanism, if the context, props, then will not perform the receive, render, update hooks\nModify the logic to detect empty objects\nSimplify the logic of the task scheduling system\n"
        },
        {
          "title": "1.1.2 (2017.10.01)",
          "url": "/en/version.html#1.1.2-2017.10.01",
          "content": "1.1.2 (2017.10.01)Fixed onChange event\nRefactoring the implementation of the diffProps module\nSupport component isMounted method\nAdd beforePatch, afterPatch hook\nAdd lib/ReactInputSelection.js\nUnify the parameters of all methods that operate on the virtual DOM (mountXXX, updateXXX, alignXXX series)\n1 The first parameter is the old real DOM or the old virtual DOM\n2 The second parameter is the new virtual DOM\n3 The third parameter is the parent virtual DOM (may not exist, then directly followed by the fourth, fifth)\n4 The fourth parameter is the context object\n5 The fifth parameter is the task scheduling system\nGet a new namespace for the element's namespace\nOn-line new node sorting algorithm (diffChildren)\nrenderByAnu should empty CurrentOwner.cur after global rendering to prevent affecting other virtual DOM\nPerfect createStringRef method, should be able to throw wrong and delete useless data\nNew on-line task scheduling system\nRefactoring the unmountComponentAtNode method\nAdd a reference to the contextType of the child component to determine whether to update it if adding references to both virtual DOMs is the same\nThe stateless component supports module mode (returns a pure object with life cycle hooks. These methods are invoked like stateful components)\nRelax shouldComponentUpdate's limit and return any false value to prevent descendants from updating\nCorrect the ref update method\nWhen shouldComponentUpdate returns a false value, the current virtual DOM should absorb useful information of the old virtual DOM\n"
        },
        {
          "title": "1.1.1 (2017.9.9)",
          "url": "/en/version.html#1.1.1-2017.9.9",
          "content": "1.1.1 (2017.9.9)Simplify createClass\nFixed flattenHooks BUG, ​​if there is only one function in hooks, there is no need to include a layer\nThe implementation of the reconstructed virtual DOM tree, consistent with the official React, that props.children is now a variety of forms, only to create a vchildren for comparison when delayed to diff\nFixed disposeElement. If there is dangerously setInnerHTML, it is necessary to clear the interior of the element, without going through the branch of the sub-virtual DOM.\nFixed diffProps, SVG elements are case sensitive as viewBox preserveAspectRation\nWhen the component is updated, it is detected whether the context changes\nImplement the persist method for the event object\nFixed this pointing to the callback of unstable_renderSubtreeIntoContainer\nFixed unmountComponentAtNode BUG, ​​#text changed to #comment\nFix the cloneElement BUG to ensure that children and _owner are correctly passed in\nFix the ref mechanism, if it is a string, pass the current ref, owner via the createStringRef method, and return a curry method when in cloneElement\n    The method created by createStringRef is then integrated into the new ref method to ensure that the old owner is updated again\nFixed implementation of getNs method (originally using hash table for exhaustive, but svg document also has a, script, style elements, resulting in indistinguishable)\nThe user is using setState in componentDidUpdate is improper operation, leading to enter the infinite loop, use the timer to slow down the call frequency, prevent the page stuck (the official React also exists a similar mechanism)\n"
        },
        {
          "title": "1.1.0 (2017.08.28)",
          "url": "/en/version.html#1.1.0-2017.08.28",
          "content": "1.1.0 (2017.08.28)The disabled element cannot trigger a click event\nFix bug in mouseenter/mouseleave in IE6-8, related to correct acquisition of TargetTarget and LCA processing\nSimplify the logic of alignVnode and reduce the generation of insert queues\nReconstruct setStateImpl,\n_component is renamed to __component, _currentElement is renamed to __current\nAdd some simple peripheral modules to react/lib, such as ReactComponentWithPureRenderMixin, shallowCompare, sliceChildren\n"
        },
        {
          "title": "1.0.8 (2017.08.18)",
          "url": "/en/version.html#1.0.8-2017.08.18",
          "content": "1.0.8 (2017.08.18)event.originalEvent renamed event.nativeEvent\nFixed Bug of forEach in polyfill\nRemove the scheduler module\nRemove the instanceMap module\nFix the bug that typeNumber is under iE6-8\neventSystem.addGlobalEventListener renamed to eventSystem.addGlobalEvent\nAvoid the problem that insertBfore cannot be undefined in IE8.\nFix the bug that the ref delays execution. If the vnode of the component has the ref attribute, it should be put in the __pendingRefs array of this component instead of the __pendingRefs array of the parent component.\n   In addition the elements in the __pendingRefs array are changed from objects to functions\nAfter the componentDidMount hook executes setState in the component, all callbacks should be delayed outside componentDidUpdate\nMake sure the instance in mountComponent should be saved to vnode as soon as possible\nFixed a bug that only executed dangeroussetInnerHTML in the updateElement method\nHandling mouseenter/mouseleave compatibility issues\nHandling focus/blur compatibility issues\n"
        },
        {
          "title": "1.0.7 (2017.07.29)",
          "url": "/en/version.html#1.0.7-2017.07.29",
          "content": "1.0.7 (2017.07.29)Handle the user in the render method return this.props.children, you need to convert the array to a single virtual DOM\nThe case where two component virtual DOMs are not instantiated\nOnly recycle text nodes\nSupport mouseenter/mouseleave and reconstruct event system\n"
        },
        {
          "title": "1.0.6 (2017.07.24)",
          "url": "/en/version.html#1.0.6-2017.07.24",
          "content": "1.0.6 (2017.07.24)Re-support Chrome DevTools\nAdd support for Immutable.js\nFix the bug that the user executed setState to cause an infinite loop in the componentWillUpdate/shouldComponentUpdate/componentDidUpdate hook\n"
        },
        {
          "title": "1.0.5 (2017.07.14)",
          "url": "/en/version.html#1.0.5-2017.07.14",
          "content": "1.0.5 (2017.07.14)Optimize the scheduler mechanism\n2 to achieve support for createFactory\nOptimize dispose module\nUse typeNumber instead of typeof keyword to reduce the packaged volume\n"
        },
        {
          "title": "1.0.4 (2017.07.07)",
          "url": "/en/version.html#1.0.4-2017.07.07",
          "content": "1.0.4 (2017.07.07)Fix errors to preventdefault inside passive event listener due to target\n   This is chrome51+. To improve performance, the problem caused by the preventDefault method is disabled by default for the touchmove/mousemove/mousewheel event.\nDestroy element nodes and completely clear the _component and __events references\nCancel refs.xxx = null operation, to ensure that the component may be animated after destruction, there will be no error DOM operation\nEnhance props.children to support more legal types\n5 to achieve support for createClass\nImplementing support for mixins\n"
        },
        {
          "title": "1.0.3 (2017.07.25)",
          "url": "/en/version.html#1.0.3-2017.07.25",
          "content": "1.0.3 (2017.07.25)Implements unstable_renderSubtreeIntoContainer, findDOMNode, isValidElement methods\nImplement complete support for Children (only, count, forEach, map, toArray)\nCompatible with focus, blur, wheel\nBUG with no defaultProps added when updating components\nFixed some typos in diffProps\nCompatible with event object pagex, pageY, which, currentTarget\nFix the bug that user invokes setState when componentWillMount is called\nThe cloneElement should be able to process the array and remove its first element.\nCancel the transaction mechanism and change it to a scheduled task\n"
        },
        {
          "title": "1.0.2 (2017.06.20)",
          "url": "/en/version.html#1.0.2-2017.06.20",
          "content": "1.0.2 (2017.06.20)Compatible with IE to implement the corresponding polyfill file\nImplement change, input, and submit events for IE6-8\nAdd processing for select.value\n"
        },
        {
          "title": "1.0.1 (2017.06.09)",
          "url": "/en/version.html#1.0.1-2017.06.09",
          "content": "1.0.1 (2017.06.09)Supports cloneElement\n"
        },
        {
          "title": "1.0.0 (2017.06.05)",
          "url": "/en/version.html#1.0.0-2017.06.05",
          "content": "1.0.0 (2017.06.05)Post anu\n点击图标下载 App\n"
        }
      ]
    },
    {
      "title": "Server Sid Render",
      "content": "",
      "url": "/en/ssr.html",
      "children": [
        {
          "title": "Prepare",
          "url": "/en/ssr.html#prepare",
          "content": "Prepare1, install nodejs and install expressInstall the nodejs tutorial: http://www.cnblogs.com/pigtail/archive/2013/01/08/2850486.htmlInstall express tutorial: http://www.expressjs.com.cn/starter/installing.html2, install node-jsx (make nodejs support jsx syntax)$ npm install node-jsx3, install ejs template engine$ npm install ejsCreate an app.js in the project, entervar express = require('express');var app = express();\n\napp.get('/', function (req, res) {\n  res.send('Hello World!');\n});\n\nvar server = app.listen(3000, function () {\n    console.log (\"Please visit the browser: http://localhost:3000/\");\n});\nStart this application with the following command:$ node app.jsOpen the browser and enter localhost:3000 to see the effect.Using the template engine, we are creating a test directory, which will build a views directory. The module files are placed inside.var express = require(\"express\");var app = express();\n\n// specify the template engine\napp.set(\"view engine\", 'ejs');\n//Specify the template location\napp.set('views', __dirname + '/test/views');\n\n// Render as html using the template file home.ejs\napp.get(\"/\", function(req, res) {\n    res.render('home.ejs', {\n        name: 'Situ Zhengmei'\n    });\n});\n\nvar server = app.listen(3000, function() {\n    console.log (\"Please visit the browser: http://localhost:3000/\");\n});\nThen we module home.ejs\nmy ejs template\n\n\n\n    Hi \n\n\nIf you dislike the ejs suffix file, your editor cannot know it (no syntax highlighting), you can improve it, and change home.ejs to home.htmlvar express = require(\"express\");var app = express();\n\n// specify the template engine\nvar ejs = require('ejs');\napp.set(\"view engine\", 'ejs');\n//Specify the template location\napp.set('views', __dirname + '/test/views');\n// Use ejs template engine to parse html view file\napp.engine('.html',ejs.__express);\n\n// Render as html using the template file home.ejs\napp.get(\"/\", function(req, res) {\n    res.render('home.html', {//specify the file name here\n        name: 'Situ Zhengmei'\n    });\n});\n\nvar server = app.listen(3000, function() {\n    console.log (\"Please visit the browser: http://localhost:3000/\");\n});\nLet's take a look at how the official react15.3 implements backend renderingNpm install reactNpm install react-dom\nCreate a components directory in the Test directory, built a Test.js, said this is a classvar React=require(\"react\");class Test extends React.Component{\n      render(){\n          return {this.props.name};\n      }\n  }\nmodule.exports = Test\nThen modify app.jsvar express = require(\"express\");var app = express();\n\n// specify the template engine\nvar ejs = require('ejs');\napp.set(\"view engine\", 'ejs');\n//Specify the template location\napp.set('views', __dirname + '/test/views');\n// Use ejs template engine to parse html view file\napp.engine('.html',ejs.__express);\n\n//................\n\n// install \"node-jsx\", install the module can make nodejs compatible jsx syntax\nrequire(\"node-jsx\").install()\n\n\nvar React = global.React = require(\"react\");\nvar ReactDOMServer = require('react-dom/server')\nvar Test = require('./test/component/Test.js') // Introduce React component\n  \n// Render as html using the template file home.ejs\napp.get(\"/\", function(req, res) {\n    res.render('home.html', {//specify the file name here\n        component: ReactDOMServer.renderToString( React.createElement( Test,{name:\"Situ Zhengmei\"}) )\n    })\n})\n//................\n\nvar server = app.listen(3000, function() {\n    console.log (\"Please visit the browser: http://localhost:3000/\");\n});\nThen change the template\n\n    \n    \n    react backend rendering\n\n\n\n    \n        \n    \n    \n\n\n\nIf you want to use anu's backend rendering scheme, the main change isvar express = require(\"express\");var app = express();\n\n// specify the template engine\nvar ejs = require('ejs');\napp.set(\"view engine\", 'ejs');\n//Specify the template location\napp.set('views', __dirname + '/test/views');\n// Use ejs template engine to parse html view file\napp.engine('.html',ejs.__express);\n\n\n//................\n\n// Install \"node-jsx\", install the module can make nodejs compatible jsx syntax\nrequire(\"node-jsx\").install()\n\n\nvar React = global.React = require(\"./dist/React\");\n//var ReactDOMServer = require('react-dom/server')\nvar ReactDOMServer = require('./dist/ReactDOMServer')\n\nvar Test = require('./test/components/Test.js') // Introduce React component\n// Render as html using the template file home.ejs\n\napp.get(\"/\", function(req, res) {\n    res.render('home.html', {//specify the file name here\n        component: ReactDOMServer.renderToString( React.createElement( Test,{name:\"Situ Zhengmei\"}) )\n    })\n})\n//................\n\n\nvar server = app.listen(3000, function() {\n    console.log (\"Please visit the browser: http://localhost:3000/\");\n});\nBut now the front end is a static page, there is no JS, we let it moveSet static directory, I put React.js, babel.js here//app.jsapp.use(express.static('dist'));\nRewrite the Test directory to have eventsvar React = require(\"../../dist/React\");Class Test extends React.Component{\n      click(){\n          console.log('=========')\n      }\n      render(){\n          return {this.props.name}\n              Events\n          ;\n      }\n  }\nmodule.exports = Test\nhome.html also changed\n\n    \n    \n    react backend rendering\n    \n      \n       \n\n Class Test extends React.Component{\n      click(){\n          Console.log('=========')\n      }\n      render(){\n          Return {this.props.name}\n          Events\n          ;\n      }\n  }\n  window.onload = function(){\n      ReactDOM.render(, document.getElementById('container'))\n  }\n   \n\n\n\n    \n        \n    \n    \n\n\n\nWhat is the difference between this back-end rendering and front-end rendering? The back-end rendering will add two attributes data-reactroot and data-react-checksum to the labels generated by your root component. The latter is for compatibility with the official website React. Anu only needs the former. In the front-end ReactDOM.render method, anu detects all immediate children at the insertion location, determines whether it has the data-reactroot attribute, and enters the alignment mode. The alignment mode is different from the traditional creation mode.The creation mode is to create a real DOM tree based on the virtual DOM, then remove all the children of the original container and insert it.The alignment mode is because the backend has created all the children directly, but it may have more text nodes. At this point, it only compares the virtual DOM's type with the real DOM's node.toLowerCase(). The speed is surely a few orders of magnitude faster.In the actual project, we can use Babel to package Test (which will remove the module.export = Test) and other code, which will not be directly written on the page. In this way, you can share a set of code before and after.Https://cnodejs.org/topic/5660f8f9d0bc14ae27939b37\nHttp://blog.csdn.net/mqy1023/article/details/55051788\nHttp://imweb.io/topic/5547892e73d4069201d83e6c\nHttp://blog.techbridge.cc/2016/08/27/react-redux-immutablejs-node-server-isomorphic-tutorial/\nhttps://blog.coding.net/blog/React-Server-Side-Rendering-for-SPA-SEO\n"
        }
      ]
    },
    {
      "title": "",
      "content": "",
      "url": "/en/router.html",
      "children": [
        {
          "title": "router",
          "url": "/en/router.html#router",
          "content": "routeranujs works perfectly with react-router.However, it is strongly recommended that you use reach router, which is better than react-router.anujs also modified it to allow it to support IE8's hashchangeReach the official websiteHttps://reach.tech/routerresolve: {    alias: {\n       react: \"anujs\",\n       \"react-dom\": \"anujs\",\n       router: \"anujs/dist/Router.js\"\n      \n    }\n},\n"
        }
      ]
    },
    {
      "title": "State Management",
      "content": "It is recommended to use the rematch package based on redux. Anujs also comes with this framework.Rematch's official websiteHttps://github.com/rematch/rematchresolve: {    alias: {\n       react: \"anujs\",\n       \"react-dom\": \"anujs\",\n       rematch: \"anujs/dist/Rematch.js\"\n      \n    }\n},\n",
      "url": "/en/store.html",
      "children": []
    }
  ],
  "中文": [
    {
      "title": "anu",
      "content": "\n\nnpm install anujsanujs是一个高级兼容React16的迷你React 框架，它兼容React16.3.0的99%接口， 跑通了官方788个case， 支持React生态圈的99％的组件与UI库。中国用户可以加QQ交流学习群：  370262116众所周知， React 一直存在体积过大的诟病， 因此我在熟读其源码的基础上，重新实现了React， gz后只有React+ReactDOM的三分之一。详细数据见 https://bundlephobia.com/, anu@1.4.3只有 13.1 kb， react@16.4.1为 2.3 kb, react-dom@16.4.1为 30.5 kb。如果使用路由器，react-router-dom@4.3.1为11 kb， reach@1.0.1为 4.3kb。",
      "url": "/ch/index.html",
      "children": [
        {
          "title": "体积比对",
          "url": "/ch/index.html#体积比对",
          "content": "体积比对现在React全家桶有如下常用套餐套餐1：react + react-dom + react-router-dom + redux + react-redux + redux-saga,体积为 2.3 + 30.5 + 11 + 5 + 4.3 + 8.4 = 61.4 kb\n合适于刚入门的人群套餐2：react + react-dom + react-router-dom + mobx + mobx-react体积为 2.3 + 30.5 + 11 + 13.8 + 6.4 = 64 kb\n合适于对redux怨言的人群套餐3：anujs + reach + redux + react-redux + rematch体积为 13.1 + 6 + 2.5 + 5 + 4.3 = 31 kb\n合适于体积、兼容性、易用性有要求的人群上述代码的测量工具为gzip-size-cli， jsize 及 https://bundlephobia.com/"
        },
        {
          "title": "与其他迷你react的比较",
          "url": "/ch/index.html#与其他迷你react的比较",
          "content": "与其他迷你react的比较主要竞品有 inferno, preact, rax, react-lite, nervjs, 前两个是海外的， 后三个是中国的，中国由于网络的状况，对体积要来比较高。inferno, 需要加上inferno-compat， 才能与官方的API保持一致， 但组件套组件的情况下， 生命周期钩子的执行顺序与官方不一致， 因此不兼容React的绝大多数的UI库。不支持旧式IE。preact, 需要加上preact-compat， 才能与官方的API保持一致， 但组件套组件的情况下， 生命周期钩子的执行顺序与官方不一致， 因此不兼容React的绝大多数的UI库。 并且preact-compat内部使用了Object.definePropety，因此无法运用于IE8， 也造成它的性能严重劣化。rax， 中国的阿里巴巴集团推出，支持React16大多数API，不支持IE8， 能跑一些React UI库。react-lite, 中国的携程集团推出，只兼容React15, 支持IE8，能跑一些React UI库。nervjs, 中国的京东集团推出，支持React16大多数API，代码与inferno, rax很相近， 没有case证明其兼容IE8，性能指标也很可疑。"
        },
        {
          "title": "anujs优势",
          "url": "/ch/index.html#anujs优势",
          "content": "anujs优势支持React16的各种新功能，Fragment, componentDidCatch, creactContext, createRef, forwardRef...\n跑通官方近800多个单元测试（其他迷你库都无法跑官方测试）\n支持React全家桶（react-redux, react-router-dom, react-router-redux， react-lazy-load， react-hot-loader...）\n支持99％的antd组件 （antd为中国最有名的React UI 库）\n"
        },
        {
          "title": "测试",
          "url": "/ch/index.html#测试",
          "content": "测试npm test"
        }
      ]
    },
    {
      "title": "安装",
      "content": "npm i anujs如何在已经使用了React的项目中使用，修改webpack.config.jsconst es3ifyPlugin = require('es3ify-webpack-plugin');\nresolve: {\n   alias: {\n      'react': 'anujs',\n      'react-dom': 'anujs',\n        // 若要兼容 IE 请使用以下配置\n        // 'react': 'anujs/dist/ReactIE',\n        // 'react-dom': 'anujs/dist/ReactIE',\n        // 如果引用了 prop-types 或 create-react-class\n        // 需要添加如下别名\n        'prop-types': 'anujs/lib/ReactPropTypes',\n        'create-react-class': 'anujs/lib/createClass',\n        //如果你在移动端用到了onTouchTap事件\n        'react-tap-event-plugin': 'anujs/lib/injectTapEventPlugin',  \n   }\n},\nplugins: [ new es3ifyPlugin()]\n",
      "url": "/ch/install.html",
      "children": []
    },
    {
      "title": "作者介绍",
      "content": "司徒正美中国的去哪儿网的前端架构师，\n精通DOM与JS，\n编写过mass, avalon, anus等前端框架，\n著有《javascript框架设计》一书，\n在 https://www.cnblogs.com/ 写了800多篇博文, 在知乎， segementFault也有专栏\n赞助",
      "url": "/ch/author.html",
      "children": []
    },
    {
      "title": "为什么要创建anujs",
      "content": "每一个国家的都有其特殊国情，主要是原因是中国的网络太慢，及中国存在大量老旧的计算机，它们预装着window XP，IE浏览器最高只能升级到IE8， 出于这两方面的原因，我们需要一个体积更少，兼容性更好的React。并且之前facebook也闹过LICENSE问题，更是促进中国互联网公司决定自主研发框架，努力摆脱对外国框架的依赖。对于我们公司而言，一个旅游公司， 在线上订火车票，飞机票， 景点门票， 提供旅游攻略， 在PC端也有大量IE用户。中国手机用户的迅猛发展，我们公司也用React开发touch端页面，这也需要一个更迷你的React。我们公司努力研究React，力图实现一套代码能跑在iOS, 安卓， 3W页面， touch页面，微信小程序， 华为的轻应用， 小米的快应用上。",
      "url": "/ch/intention.html",
      "children": []
    },
    {
      "title": "兼容性",
      "content": "",
      "url": "/ch/compat.html",
      "children": [
        {
          "title": "语言补丁",
          "url": "/ch/compat.html#语言补丁",
          "content": "语言补丁Array.isArray\nObject.assign\nJSON.stringify\nconsole-polyfill\nObject.keys\nObject.is\nArray.prototype.forEach\nFunction.prototype.bind\n或者直接使用https://polyfill.io/ 提供的动态补丁方案"
        },
        {
          "title": "更换核心库",
          "url": "/ch/compat.html#更换核心库",
          "content": "更换核心库核心库应该由dist/React.js改成dist/ReactIE.js它只是在React.js上添加了一些特殊事件的兼容补丁与innerHTML的修复处理。IE事件补丁是针对一些不冒泡事件的修复（input, change, submit, focus, blur），及一些特定事件属性的处理(鼠标事件的pageX, pageY, 键盘事件的which, 滚轮事件的wheelDetla)http://www.cnblogs.com/rubylouvre/p/5080464.html"
        },
        {
          "title": "动画",
          "url": "/ch/compat.html#动画",
          "content": "动画如果用户用到react-transition-group这样的动画库，请注意引入requestAnimationFrame的补丁https://github.com/darius/requestAnimationFrame"
        },
        {
          "title": "压缩",
          "url": "/ch/compat.html#压缩",
          "content": "压缩如果你用到压缩，就需要处理 uglify-js产生问题，因为IE6-8 ,对于map.delete(\"ddd\"), modulex.default这样的写法会报语法错误因为关键字不能做属性名与方法名。我们可以用es3ify-webpack-plugin或es3ify-loader进行处理。//npm install uglifyjs-webpack-plugin@1.0.0-beta.2  //UglifyJs3\nnew UglifyJsPlugin({\n    parallel: {\n        cache: true,\n        workers: 4,\n    },\n    uglifyOptions: {\n        mangle: {\n            eval: true,\n            toplevel: true,\n        },\n        parse: {\n            html5_comments: false,\n        },\n        output: {\n            comments: false,\n            ascii_only: true,\n            beautify: false,\n        },\n        ecma: 5,\n        ie8: false,\n        compresqs: {\n            properties: true,\n            unsafe: true,\n            unsafe_comps: true,\n            unsafe_math: true,\n            unsafe_proto: true,\n            unsafe_regexp: true,\n            unsafe_Func: true,\n            dead_code: true,\n            unused: true,\n            conditionals: true,\n            keep_fargs: false,\n            drop_console: true,\n            drop_debugger: true,\n            reduce_vars: true,\n            if_return: true,\n            comparisons: true,\n            evaluate: true,\n            booleans: true,\n            typeofs: false,\n            loops: true,\n            toplevel: true,\n            top_retain: true,\n            hoist_funs: true,\n            hoist_vars: true,\n            inline: true,\n            join_vars: true,\n            cascade: true,\n            collapse_vars: true,\n            reduce_vars: true,\n            negate_iife: true,\n            pure_getters: true,\n            pure_funcs: true,\n            // arrows: true,\n            passes: 3,\n            ecma: 5,\n        },\n    },\n    sourceMap: false,\n}),\n"
        },
        {
          "title": "React.createClass",
          "url": "/ch/compat.html#react.createclass",
          "content": "React.createClassReact15使用createClass来创建类，如果需要这个API，可以在babel中引入 anujs/lib/createClass.jshttps://github.com/magicapple/anujs-webpack4-ie7-8\n"
        }
      ]
    },
    {
      "title": "",
      "content": "",
      "url": "/ch/version.html",
      "children": [
        {
          "title": "1.5.0(2019.1.21)",
          "url": "/ch/version.html#1.5.02019.1.21",
          "content": "1.5.0(2019.1.21)fix dist/Router.js中newHash变量不存在的BUG，改成to变量\nfix require(\"react-dom/server\") 找不到，无法别名的BUG\n重构React.createContext的实现\n"
        },
        {
          "title": "1.4.9(2018.11.17)",
          "url": "/ch/version.html#1.4.92018.11.17",
          "content": "1.4.9(2018.11.17)重构小程序dispathEvent与dispatchEventQuick的实现\n重构 快应用toStyleQuick\n修复miniCreateClass 不能继承父类的类成员的BUG（PC中的React内部的组件继承用到它，及小程序的各种React的toClass方法的本体就是它）\n修复事件回调函数中调用e.preventDefault()后，e.defaultPrevented 仍然为 false\n修复用iframe打开一个新页面 document.adctiveElement 抛出异常，导致无法渲染的BUG\n修复 devtools 的两个问题\n\n点击 Unbatch 后开发者工具变为空白。\ndevtools 中 Text 节点的文字显示为 undefined。\n\n\n"
        },
        {
          "title": "1.4.8(2018.11.7)",
          "url": "/ch/version.html#1.4.82018.11.7",
          "content": "1.4.8(2018.11.7)支持编译成支付宝小程序，通过在这种机制解决支付宝小程序的实例生成顺序与React实例生成顺序不一致的问题\n修复快应用的文本节点不显示问题，自动为它添加标签包含它\n添加patchComponent机制\n修复样式表中的@assets别名问题\n"
        },
        {
          "title": "1.4.7(2018.10.29)",
          "url": "/ch/version.html#1.4.72018.10.29",
          "content": "1.4.7(2018.10.29)微信小程序的组件机制由template改成自定义组件机制实现， 解决文本节点保留换行符的问题\n支持编译成百度智能小程序\n支持编译成快应用\n模板的开发目录改成source，生产目录视构建目标有所不同\n"
        },
        {
          "title": "1.4.6(2018.10.20)",
          "url": "/ch/version.html#1.4.62018.10.20",
          "content": "1.4.6(2018.10.20)修复支付宝的事件对象不支持x,y属性的BUG ，解决方法pageX, pageY代替它们\n修复支付宝的自定义组件不在json.usingComponents引用它们，就不会在组件JS 中引入Component的BUG ，解决方法，在子类的json.usingComponents添加父类的引用\n修复无狀态组件的wxml, axml, swan生成错误，原因是两次进入render.exit方法，导致重复重成，第二次时jsx变成h方法，解决方法，通过modules.registerStatement是否为假值进行隔离\n修复中文unicode化的问题\n美化wxml, swan, awxml, ux文件，解决方法，引入 js-beautify模块\n"
        },
        {
          "title": "1.4.5(2018.10.15)",
          "url": "/ch/version.html#1.4.52018.10.15",
          "content": "1.4.5(2018.10.15)React.createContext 无法通过 Provider \b传入数据\n修复ReactIE unstable_renderSubtreeIntoContainer BUG\n支持编译成支付宝小程序\n"
        },
        {
          "title": "1.4.4(2018.10.1)",
          "url": "/ch/version.html#1.4.42018.10.1",
          "content": "1.4.4(2018.10.1)修改 getWinodw BUG\n支持编译成微信小程序\n为减少小程序的体积，render中的React.createElement会改用h变量进行替换\n内置三套模板\nhttps://github.com/RubyLouvre/anu/issues/133"
        },
        {
          "title": "1.4.3(2018.06.14)",
          "url": "/ch/version.html#1.4.32018.06.14",
          "content": "1.4.3(2018.06.14)miniCreateClass在老式IE下取不到名字默认使用IEComponent,\n修复createClass没有继续mixin的BUG\n移除option元素下面所有元素节点\n去掉NULLREF任务，添加DUPLEX任务，提前所有dom相关任务\n内置的路由器支持IE8的hashchange\nupdateContext改名updateContent，这是一直以来的笔误\n"
        },
        {
          "title": "1.4.2(2018.06.07)",
          "url": "/ch/version.html#1.4.22018.06.07",
          "content": "1.4.2(2018.06.07)add miniCreateClass, 并用它重构createClass, Unbatch, PureComponent, createContext\n添加一个WORKING任务，避免整棵树更新\n修复受控组件中option的IE8-的兼容BUG\n添加一个内置的路由器\n"
        },
        {
          "title": "1.4.1(2018.06.04)",
          "url": "/ch/version.html#1.4.12018.06.04",
          "content": "1.4.1(2018.06.04)文本节点的内容直接用fiber.props代替\n修正input的拼音输入法BUG\n修正updateHostComponent中覆盖children对象的BUG\n修正createClass BUG\n修正SSR的BUG\n简化commitDFS循环\n"
        },
        {
          "title": "1.4.0(2018.05.30)",
          "url": "/ch/version.html#1.4.02018.05.30",
          "content": "1.4.0(2018.05.30)测试全部改成jest\ncWU钩子在调用时必须移除\n批量更新时，每个组件只能更新一次\n重构受控组件，它们会延后在batchedUpdate中执行，跑通所有测试\nemptyElement不再递归移除，但会递归清空附于元素节点上的数据，以防内存泄露\n将createClass移出核心库\n重构错误边界，边界组件带有capturedValues，catchError, caughtError标识，并放进全局的boundaries\n重构contextStack，保证setState后，从当前组件的unmaskedContext中还原之前的栈\n"
        },
        {
          "title": "1.3.2(2018.04.16)",
          "url": "/ch/version.html#1.3.22018.04.16",
          "content": "1.3.2(2018.04.16)处理移动端下中文输入法的onChange事件BUG"
        },
        {
          "title": "1.3.1(2018.03.18)",
          "url": "/ch/version.html#1.3.12018.03.18",
          "content": "1.3.1(2018.03.18)React.Fragment支持key属性\n修正有生命周期的无状态组件的更新BUG\n实现React.createRef与React.forwardRef\n实现createResource与createSubscription这两个处理狀态的新包，放于lib下\nvar 集体更改为let const\n"
        },
        {
          "title": "1.3.0(2018.03.06)",
          "url": "/ch/version.html#1.3.02018.03.06",
          "content": "1.3.0(2018.03.06)支持React16.3的createContext new API\n添加大量React.Fragment测试，修正一些边缘的BUG\n升级diff机制，由新旧vnode进行比较，改成fiber与新vnode进行比较，用新vnode的数据更新fiber与视图\n添加input[type=search]的onChange事件支持\n修正传送门在antd3.0的一个边\b缘BUG（重复插入两次，导致文本节点消失）\n属性名与方法名大改动，与React16的Fiber靠近\n\nvnode.vtype --> fiber.tag\ninstance.__isStateless --> fiber._isStateless\nupdater --> fiber\nupdater.vnode --> fiber._reactInternalFiber\nupdater.willReceive --> fiber._willReceive\nupdater.children --> fiber._children\nupdater.isMounted() --> fiber._isMounted()\nupdater.insertCarrier --> fiber._mountCarrier\nupdater.insertPoint --> fiber._mountPoint\nupdater.parentContext --> fiber._unmaskedContext\ngetChildContext --> getUnmaskedContext\ngetContextByTypes --> 为getMaskedContext\nCompositeUpdater.js --> ComponentFiber.js`\nDOMUpdater.js --> HostFiber.js\n\n\n"
        },
        {
          "title": "1.2.9(2018.02.06)",
          "url": "/ch/version.html#1.2.92018.02.06",
          "content": "1.2.9(2018.02.06)修正focus/blur事件的实现\n修正IE6－8下onchange因为是用onproperty实现，会引发无限循环的BUG\n修正diffProps无法修改input元素的type属性的BUG，改为在createElement方法中立即添加type属性\n"
        },
        {
          "title": "1.2.8(2018.02.02)",
          "url": "/ch/version.html#1.2.82018.02.02",
          "content": "1.2.8(2018.02.02)简化focus/blur事件的实现，IE7－8的实现更加精简了\n修正wheel事件的属性计算方式，与官方保持一致\n为了支持react-hot-loader, vnode.updater.vnode更名为vnode.updater._reactInnerFiber, vtype更名为tag\n测试工具与调试工具进行了部分属性调整\n"
        },
        {
          "title": "1.2.7(2018.02.01)",
          "url": "/ch/version.html#1.2.72018.02.01",
          "content": "1.2.7(2018.02.01)修正componentWillReceiveProps 的执行条件\n支持children为函数\n修改_disposed开关的位置\n修正焦点系统，它只会在browser的insertElement, removeElement中执行\n修正focus/blur事件的绑定方式，捕获时需要屏蔽内部的事件\n修正insertElement中多执行一次无效的DOM插入操作及CompositeUpdatet.hydrate的insertElement传参错误\n"
        },
        {
          "title": "1.2.6(2018.01.26)",
          "url": "/ch/version.html#1.2.62018.01.26",
          "content": "1.2.6(2018.01.26)修正 unstable_renderSubtreeIntoContainer 中context对象的错误指向"
        },
        {
          "title": "1.2.5(2018.01.23)",
          "url": "/ch/version.html#1.2.52018.01.23",
          "content": "1.2.5(2018.01.23)修正受控组件 radio的BUG，它导致无法修改value\n"
        },
        {
          "title": "1.2.4（2018.01.22）",
          "url": "/ch/version.html#1.2.4（2018.01.22）",
          "content": "1.2.4（2018.01.22）解决移动端scroll事件\n"
        },
        {
          "title": "1.2.3（2018.01.12）",
          "url": "/ch/version.html#1.2.3（2018.01.12）",
          "content": "1.2.3（2018.01.12）解决移动端点击事件\n"
        },
        {
          "title": "1.2.2(2018.01.05)",
          "url": "/ch/version.html#1.2.22018.01.05",
          "content": "1.2.2(2018.01.05)解决PropTypes的share问题\n修复utils的inherit BUG\n添加后端渲染的renderToNodeStream支持\nComponent添加isReactCompent方法，增强对第三方的支持\n"
        },
        {
          "title": "1.2.2(2017.12.30)",
          "url": "/ch/version.html#1.2.22017.12.30",
          "content": "1.2.2(2017.12.30)cloneElement需要处理disposed元素\ncloneElement 对于props的虚拟DOM进行复制\n设置属性的时机提前\n"
        },
        {
          "title": "1.2.1 (2017.12.27)",
          "url": "/ch/version.html#1.2.1-2017.12.27",
          "content": "1.2.1 (2017.12.27)优化fiberizeChildren的性能\n修复受控组件在textarea, radio的BUG，将受控事件放到用户\b事件后集中执行\n添加焦点系统的支持（全局focus,blur事件提前监听，移除添加节点的Refs.nodeOperate开头）\n解决多次引入React时，事件系统的option.async有问题的BUG\n简化createPortal的实现\n支持React16.2的Fragment语法糖\n"
        },
        {
          "title": "1.2.0(2017.12.17) 支持React16",
          "url": "/ch/version.html#1.2.02017.12.17-支持react16",
          "content": "1.2.0(2017.12.17) 支持React16重构findDOMNode,遇到注释节点返回null\n支持React组件返回任何数据类型，如数组，字符串，数字，布尔,但对于undefined, null, boolean不会生成真实DOM\n支持componentDidCatch钩子与整个错误边界的逻辑\n支持createPortal\n分离出Vndoe模块，并且附带其节点关系属性（return, sibling, child），\n\nreturn相当于之前的_hostParent,\nsibling相当于nextSibling,\nchild相当于firstChild，\n\n\n模仿React16，使用stateNode属性代替旧有的_hostNode与_instance。\nReact.Children与flattenChilden底层依赖的方法由_flattenChildren改为operateChildren，让其更具通用性，\nflattenChilden更名为fiberizeChildren，产出一个带链表结构的数组。\n新的架构：元素虚拟DOM与组件虚拟DOM都有自己的更新对象，简化匹配算法\n简化Refs模块\n修复更新虚拟DOM时，namespaceURI丢失的BUG\ncomponentDidUpdate现在只有两个参数，lastProps与lastState\n"
        },
        {
          "title": "1.1.4（2017.10.20）",
          "url": "/ch/version.html#1.1.4（2017.10.20）",
          "content": "1.1.4（2017.10.20）修正flushUpdaters中updater对象的泄露问题（需要clearArray一下）\n优化diffChildren的逻辑，防止出现parentNode等于null的情况（比如为文本节点取firstChild）\n简化ControlledComponent与dispose模块\n处理updateElement方法中两个虚拟DOM的引用一样时，调用flattenChildren时，旧的vchildren丢失的情况\n移除Refs中的createStringRef，createInsanceRef，添加fireRef,\n重构detachRef,clearRefs,cloneElement,createElement有关ref的部分，尽量减少闭包的应用\n将updateQueue数组移出所有diff方法，合并到调度器中\n"
        },
        {
          "title": "1.1.3（2017.10.08）",
          "url": "/ch/version.html#1.1.3（2017.10.08）",
          "content": "1.1.3（2017.10.08）抽象出一个Update类，用于封装组件实例上的所有私有数据\n抽象出一个instantiateComponente用于同时实例化有状态与无状态组件，从此再没有mountStateless, updateStateless方法\n修正checkbox点一下会触发两次onChange的BUG\n添加ReceiveComponent检测机制，如果context,props一样，那么就不会执行receive, render, update等钩子\n修改检测空对象的逻辑\n简化任务调度系统的逻辑\n"
        },
        {
          "title": "1.1.2（2017.10.01）",
          "url": "/ch/version.html#1.1.2（2017.10.01）",
          "content": "1.1.2（2017.10.01）修正 onChange 事件\n重构 diffProps 模块的实现\n支持组件的isMounted方法\n添加beforePatch , afterPatch钩子\n添加lib/ReactInputSelection.js\n统一所有操作虚拟DOM的方法的参数(mountXXX, updateXXX, alignXXX系列)\n1 第一个参数为旧真实DOM或旧虚拟DOM\n2 第二个参数为新虚拟DOM\n3 第三个参数为父虚拟DOM(可能不存在，那么后面直接跟第四，第五)\n4 第四个参数为上下文对象\n5 第五个参数为任务调度系系统的列队\n使用全新的方式获取元素的命名空间\n上线全新的节点排序算法(diffChildren)\nrenderByAnu在全局渲染后应该置空CurrentOwner.cur, 防止影响其他虚拟DOM\n完善createStringRef方法，应该能抛错与删除无用数据\n上线全新的任务调度系统\n重构unmountComponentAtNode方法\n添加对两个虚拟DOM的引用都相同的情况下，检测子组件的contextType决定是否更新的策略\n无状态组件支持模块模式（返回一个带生命周期钩子的纯对象，这些方法会像有状态组件那样被调用）\n放松shouldComponentUpdate的限制，返回任何假值都阻止子孙更新\n修正ref的更新方式\nshouldComponentUpdate返回假值时，当前的虚拟DOM应该吸纳旧虚拟DOM的有用信息\n"
        },
        {
          "title": "1.1.1（2017.9.9）",
          "url": "/ch/version.html#1.1.1（2017.9.9）",
          "content": "1.1.1（2017.9.9）简化createClass\n修正flattenHooks BUG， 如果hooks中只有一个函数，就不用再包一层\n重构虚拟DOM树的实现，与官方React保持一致，即props.children现在是多种形态，延迟到diff时才创建用于比较的vchildren\n修正disposeElement，如果存在dangerouslySetInnerHTML的情况，需要清空元素内部，不走遍历子虚拟DOM的分支\n修正diffProps, SVG的元素是区分大小写 如viewBox preserveAspectRation\n组件更新时，要检测context是否改变\n为事件对象实现persist方法\n修正unstable_renderSubtreeIntoContainer的回调的this指向问题\n修正unmountComponentAtNode BUG， #text改为 #comment\n修正cloneElement BUG， 确保children与_owner正确传入\n修正ref机制，如果为字符串时，通过createStringRef方法将当前ref, owner传入，返回一个curry方法，在cloneElement时\ncreateStringRef创建的方法会再被整合到新ref方法的内部，确保旧的owner再次被更新\n修正getNs方法的实现（原先是使用hash表进行穷举，但svg文档也有a, script ,style元素，导致无法区分）\n用户在componentDidUpdate使用setState是不当操作，导致进入死循环，改用定时器减缓调用频率，防止页面卡死（官方React也存在类似的机制）\n"
        },
        {
          "title": "1.1.0（2017.08.28）",
          "url": "/ch/version.html#1.1.0（2017.08.28）",
          "content": "1.1.0（2017.08.28）disabled的元素不能触发点击事件\n修正mouseenter/mouseleave在IE6－8中的BUG，涉及到relatedTarget的正确获取与LCA处理\n简化alignVnode的逻辑，减少插入列队的生成\n重构setStateImpl,\n_component更名为__component, _currentElement更名为__current\nreact/lib中添加一些简用的外围模块，如ReactComponentWithPureRenderMixin，shallowCompare，sliceChildren\n"
        },
        {
          "title": "1.0.8（2017.08.18）",
          "url": "/ch/version.html#1.0.8（2017.08.18）",
          "content": "1.0.8（2017.08.18）event.originalEvent更名为 event.nativeEvent\n修正polyfill中forEach的BUG\n移除scheduler模块\n移除instanceMap模块\n修正typeNumber在iE6－8下的BUG\neventSystem.addGlobalEventListener更名为eventSystem.addGlobalEvent\n规避insertBfore在IE8下第二参数不能为 undefined的问题\n修正ref延迟执行的BUG，组件所在的vnode如果有ref属性，那么它应该放到此组件的__pendingRefs数组中，而不是放在父组件的__pendingRefs数组\n此外__pendingRefs数组里的元素由对象改成函数\n确保组件在componentDidMount钩子执行setState后，所有回调应延迟到componentDidUpdate外执行\n确保mountComponent中实例应该尽快保存到vnode中\n修正updateElement方法中只执行一次dangerouslySetInnerHTML的BUG\n处理mouseenter/mouseleave的兼容问题\n处理focus/blur的兼容问题\n"
        },
        {
          "title": "1.0.7（2017.07.29）",
          "url": "/ch/version.html#1.0.7（2017.07.29）",
          "content": "1.0.7（2017.07.29）处理用户在render方法 return this.props.children 的情况，需要将数组转换为单个虚拟DOM\n处理两个组件虚拟DOM都没有实例化的情况\n只回收文本节点\n支持mouseenter/mouseleave及重构事件系统\n"
        },
        {
          "title": "1.0.6（2017.07.24）",
          "url": "/ch/version.html#1.0.6（2017.07.24）",
          "content": "1.0.6（2017.07.24）重新支持chrome DevTools\n添加对Immutable.js的支持\n修复用户在componentWillUpdate/shouldComponentUpdate/componentDidUpdate钩子中执行setState引发死循环的BUG\n"
        },
        {
          "title": "1.0.5（2017.07.14）",
          "url": "/ch/version.html#1.0.5（2017.07.14）",
          "content": "1.0.5（2017.07.14）优化scheduler机制\n实现对createFactory的支持\n优化dispose模块\n使用typeNumber代替typeof关键字，减少打包后的体积\n"
        },
        {
          "title": "1.0.4 （2017.07.07）",
          "url": "/ch/version.html#1.0.4-（2017.07.07）",
          "content": "1.0.4 （2017.07.07）修正 unable to preventdefault inside passive event listener due to target 的错误处理，\n这是chrome51+, 为了提高性能，默认对touchmove/mousemove/mousewheel事件禁用preventDefault方法引发的问题\n销毁元素节点，彻底清除_component与__events引用\n取消refs.xxx = null 操作，确保组件销毁后可能还进行动画，这时会有DOM操作不会报错\n对props.children进行增强，支持更多合法的类型\n实现对createClass的支持\n实现对mixin的支持\n"
        },
        {
          "title": "1.0.3 （2017.07.25）",
          "url": "/ch/version.html#1.0.3-（2017.07.25）",
          "content": "1.0.3 （2017.07.25）实现unstable_renderSubtreeIntoContainer, findDOMNode, isValidElement方法\n实现对Children的完整支持 (only, count, forEach,map, toArray)\n实现focus, blur, wheel的兼容处理，\n修正更新组件时，没有添加defaultProps的BUG\n修正diffProps一些错别字\n实现事件对象pagex,pageY,which,currentTarget的兼容\n修正用户在componentWillMount时调用 setState引发的BUG\ncloneElement应该能处理数组并取出其第一个元素进制复制\n取消事务机制，改成调度任务\n"
        },
        {
          "title": "1.0.2 （2017.06.20）",
          "url": "/ch/version.html#1.0.2-（2017.06.20）",
          "content": "1.0.2 （2017.06.20）兼容IE，实现对应的polyfill文件\n实现对IE6－8的change, input, submit事件\n添加对select.value的处理\n"
        },
        {
          "title": "1.0.1 （2017.06.09）",
          "url": "/ch/version.html#1.0.1-（2017.06.09）",
          "content": "1.0.1 （2017.06.09）支持cloneElement\n"
        },
        {
          "title": "1.0.0 （2017.06.05）",
          "url": "/ch/version.html#1.0.0-（2017.06.05）",
          "content": "1.0.0 （2017.06.05）发布anu\n"
        }
      ]
    },
    {
      "title": "服务端渲染",
      "content": "",
      "url": "/ch/ssr.html",
      "children": [
        {
          "title": "准备动作",
          "url": "/ch/ssr.html#准备动作",
          "content": "准备动作1、安装nodejs与安装express安装nodejs教程:http://www.cnblogs.com/pigtail/archive/2013/01/08/2850486.html安装express教程:http://www.expressjs.com.cn/starter/installing.html2、安装node-jsx（使nodejs支持jsx语法）$ npm install node-jsx3、安装ejs模板引擎$ npm install ejs在项目中建立一个app.js，输入var express = require('express');var app = express();\n\napp.get('/', function (req, res) {\n  res.send('Hello World!');\n});\n\nvar server = app.listen(3000, function () {\n    console.log(\"请在浏览器访问：http://localhost:3000/\");\n});\n通过如下命令启动此应用：$ node app.js打开浏览器，输入localhost:3000就看到效果了。使用模板引擎，我们在建立一个test目录，里面再建一个views目录，模块文件都放里面。var express = require(\"express\");var app = express();\n\n//指定模板引擎\napp.set(\"view engine\", 'ejs');\n//指定模板位置\napp.set('views', __dirname + '/test/views');\n\n//利用模板文件home.ejs渲染为html\napp.get(\"/\", function(req, res) {\n    res.render('home.ejs', {\n        name: '司徒正美'\n    });\n});\n\nvar server = app.listen(3000, function() {\n    console.log(\"请在浏览器访问：http://localhost:3000/\");\n});\n然后我们模块home.ejs\nmy ejs template\n\n\n\n    Hi \n\n\n如果你嫌弃ejs后缀文件，你的编辑器无法别识（没有语法高亮），可以改进一下，将home.ejs改为home.htmlvar express = require(\"express\");var app = express();\n\n//指定模板引擎\nvar ejs = require('ejs');\napp.set(\"view engine\", 'ejs');\n//指定模板位置\napp.set('views', __dirname + '/test/views');\n//使用ejs模板引擎解析html视图文件\napp.engine('.html',ejs.__express);   \n\n//利用模板文件home.ejs渲染为html\napp.get(\"/\", function(req, res) {\n    res.render('home.html', {//这里指定文件名\n        name: '司徒正美'\n    });\n});\n\nvar server = app.listen(3000, function() {\n    console.log(\"请在浏览器访问：http://localhost:3000/\");\n});\n我们先看一下官方react15.3如何实现后端渲染的npm install reactnpm install react-dom\n在Test目录下建立一个components目录，里面建一个Test.js，表示这里是一个类var React=require(\"react\");class Test extends React.Component{\n      render(){\n          return {this.props.name};\n      }\n  }\n module.exports =  Test\n然后修改app.jsvar express = require(\"express\");var app = express();\n\n//指定模板引擎\nvar ejs = require('ejs');\napp.set(\"view engine\", 'ejs');\n//指定模板位置\napp.set('views', __dirname + '/test/views');\n//使用ejs模板引擎解析html视图文件\napp.engine('.html',ejs.__express);  \n\n//................\n\n//安装\"node-jsx\"，安装该模块可以使nodejs兼容jsx语法\nrequire(\"node-jsx\").install()\n\n\nvar React = global.React = require(\"react\");\nvar ReactDOMServer = require('react-dom/server')\nvar Test = require('./test/component/Test.js') //引入React组件\n  \n//利用模板文件home.ejs渲染为html\napp.get(\"/\", function(req, res) {\n    res.render('home.html', {//这里指定文件名\n        component: ReactDOMServer.renderToString( React.createElement( Test,{name:\"司徒正美\"}) )\n    })\n})\n//................\n\nvar server = app.listen(3000, function() {\n    console.log(\"请在浏览器访问：http://localhost:3000/\");\n});\n然后将模板改一下\n\n    \n    \n    react 后端渲染\n\n\n\n    \n        \n    \n    \n\n\n\n如果想使用anu的后端渲染方案，主要改一下链接就是var express = require(\"express\");var app = express();\n\n//指定模板引擎\nvar ejs = require('ejs');\napp.set(\"view engine\", 'ejs');\n//指定模板位置\napp.set('views', __dirname + '/test/views');\n//使用ejs模板引擎解析html视图文件\napp.engine('.html',ejs.__express);  \n\n\n//................\n\n//安装\"node-jsx\"，安装该模块可以使nodejs兼容jsx语法\nrequire(\"node-jsx\").install()\n\n\nvar React = global.React = require(\"./dist/React\");\n//var ReactDOMServer = require('react-dom/server')\nvar ReactDOMServer = require('./dist/ReactDOMServer')\n\nvar Test = require('./test/components/Test.js') //引入React组件\n//利用模板文件home.ejs渲染为html\n\napp.get(\"/\", function(req, res) {\n    res.render('home.html', {//这里指定文件名\n        component: ReactDOMServer.renderToString( React.createElement( Test,{name:\"司徒正美\"}) )\n    })\n})\n//................\n\n\nvar server = app.listen(3000, function() {\n    console.log(\"请在浏览器访问：http://localhost:3000/\");\n});\n但现在前端是一个静态页面，没有JS ，我们让它能活动起来设置一下静态资态的目录，我把React.js, babel.js什么放到这里上//app.jsapp.use(express.static('dist'));\n重写一下Test目录，让它有事件var React=require(\"../../dist/React\");class Test extends React.Component{\n      click(){\n          console.log('=========')\n      }\n      render(){\n          return {this.props.name}\n          事件\n          ;\n      }\n  }\n module.exports =  Test\nhome.html也改一下\n\n    \n    \n    react 后端渲染\n    \n      \n       \n\n class Test extends React.Component{\n      click(){\n          console.log('=========')\n      }\n      render(){\n          return {this.props.name}\n          事件\n          ;\n      }\n  }\n  window.onload = function(){\n      ReactDOM.render(, document.getElementById('container'))\n  }\n      \n\n\n\n    \n        \n    \n    \n\n\n\n这个后端渲染与前端渲染有什么区别呢？后端渲染会为你的根组件生成的标签添加两个属性data-reactroot与 data-react-checksum。其中后者是为了兼容官网React，anu只需要前者就行了。在前端的ReactDOM.render方法里面，anu会检测插入位置的所有直接孩子，判定它有没有data-reactroot属性，有则进入对齐模式。对齐模式与传统的创建模式不一样。创建模式是根据虚拟DOM创建一棵真实DOM树，然后移除原容器的所有孩子，插入其中。对齐模式是因为后端已经将所有孩子直接创建好，但可能会多出一些文本节点。这时它只根据虚拟DOM 的type与真实DOM 的**node.toLowerCase()**进行比较就是。速度肯定快上几个数量级。而在实际项目中，我们可以通过babel将Test（会去掉里面的module.export = Test）及其他代码进行打包，不会直接写在页面上的。这样一来 ,就可以达到前后共享一套代码。Https://cnodejs.org/topic/5660f8f9d0bc14ae27939b37\nHttp://blog.csdn.net/mqy1023/article/details/55051788\nHttp://imweb.io/topic/5547892e73d4069201d83e6c\nHttp://blog.techbridge.cc/2016/08/27/react-redux-immutablejs-node-server-isomorphic-tutorial/\nhttps://blog.coding.net/blog/React-Server-Side-Rendering-for-SPA-SEO\n"
        }
      ]
    },
    {
      "title": "",
      "content": "",
      "url": "/ch/router.html",
      "children": [
        {
          "title": "路由器",
          "url": "/ch/router.html#路由器",
          "content": "路由器anu可以完美与react-router搭配使用。但强烈建议使用reach router, 这个比react router更好用。anujs也对它进行改造，让它支持IE8的hashchangereach的官网https://reach.tech/routerresolve: {   alias: {\n      react: \"anujs\",\n      \"react-dom\": \"anujs\",\n      router: \"anujs/dist/Router.js\"\n      \n   }\n},\n"
        }
      ]
    },
    {
      "title": "状态管理",
      "content": "建议使用基于redux封装出来的rematch, anujs也自带了这个框架。rematch的官网https://github.com/rematch/rematchresolve: {   alias: {\n      react: \"anujs\",\n      \"react-dom\": \"anujs\",\n      rematch: \"anujs/dist/Rematch.js\"\n      \n   }\n},\n",
      "url": "/ch/store.html",
      "children": []
    }
  ]
}
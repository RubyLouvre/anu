
import { eventSystem } from './eventSystem';
import { createElement } from 'react-core/createElement';

var registerComponents = {};
export function useComponent(props) {
    var is = props.is;
    var clazz = registerComponents[is];
    delete props.is;
    var args = [].slice.call(arguments, 2);
    args.unshift(clazz, props);
    console.log('使用组件', is);
    return createElement.apply(null, args);
}
export function registerComponent(userComponent, path) {
    registerComponents[path] = userComponent;
    userComponent.instances = [];
    console.log('注册组件', path);
    return {
        data: {
            props: {},
            state: {},
            context: {},
        },
        methods: {
            dispatchEvent: eventSystem.dispatchEvent,
        },
        lifetimes: {
            created: function() {
                userComponent.instances.push(this);
            },
            // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
            attached: function() {
                console.log('attached');
            },
            detached: function() {
                console.log('detached');
            },
        },
    };
}

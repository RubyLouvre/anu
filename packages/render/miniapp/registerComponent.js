import { eventSystem } from './eventSystem';
import { createElement } from 'react-core/createElement';
import { updateView } from './utils';
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
export function registerComponent(type, name) {
    registerComponents[name] = type;
    var instances = (type.instances = []);
    console.log('注册组件', name);
    return {
        data: {
            props: {},
            state: {},
            context: {}
        },
        methods: {
            dispatchEvent: eventSystem.dispatchEvent
        },
        lifetimes: {
            created() {
                var instance = instances.shift();
                if (instance) {
                    instance.wx = this;
                    this.reactInstance = instance;
                }
            },
            attached() {
                updateView(this.reactInstance, 'attached');
                console.log('attached');
            },
            detached() {
                console.log('detached');
            }
        }
    };
}

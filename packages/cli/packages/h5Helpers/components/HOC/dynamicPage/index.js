import React from '@react';
import cssTransitionWrapper from '../cssTransitionWrapper';
import ErrorBoundary from '../../ErrorBoundary';

export default function dynamicPage(Comp) {
    return cssTransitionWrapper(class DynamicPage extends React.Component {
        constructor(props) {
            super(props);
            this.$app = props.app;
            this.Ref = React.createRef();
            this.triggerLifeCycle('onLoad');
        }
        componentWillUnmount() {
            this.triggerLifeCycle('onUnload');
        }
        componentDidMount() {
            this.triggerLifeCycle('onShow');
            this.triggerLifeCycle('onReady');
        }
        triggerLifeCycle(name, ...args) {
            const instance = this.Ref.current;
            const appInstance = this.$app;
            const globalName = name.replace(/^on/, '$&Global');
            appInstance && appInstance[globalName] &&
                appInstance[globalName].call(appInstance, ...args);
      
            instance && instance[name] && instance[name].call(instance, ...args);
        }
        render() {
            return <ErrorBoundary>
                <Comp ref={this.Ref} {...this.props} />
            </ErrorBoundary>;
        }
    });
}
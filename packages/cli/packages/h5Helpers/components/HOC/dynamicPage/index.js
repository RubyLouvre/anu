import React from '@react';
import cssTransitionWrapper from '../cssTransitionWrapper';
import ErrorBoundary from '../../ErrorBoundary';
import PullDownLoading from '../../PullDownLoading';

export default function dynamicPage(Comp) {
    return cssTransitionWrapper(class DynamicPage extends React.Component {
        constructor(props) {
            super(props);
            this.$app = props.app;
            this.Ref = React.createRef();
            this.state = {
                containerOffsetTop: 0,
                onPullRefreshRelease: true
            };
            this.resetContainer.bind(this);
            this.touchCoordinate = {
                pageY: 0
            };
            this.triggerLifeCycle('onLoad');
        }
        static maxPullRefreshDistance = 75;
        static maxPullRefreshTime = 3000;
        static extractCoordinate(event) {
            const {
                nativeEvent: {
                    changedTouches: [{ pageY }]
                }
            } = event;
            return { pageY };
        }
        componentWillUnmount() {
            this.triggerLifeCycle('onUnload');
        }
        componentDidMount() {
            this.triggerLifeCycle('onShow');
            this.triggerLifeCycle('onReady');
        }
        componentWillReceiveProps(nextProps) {
            if (nextProps.stopPullDownRefresh) {
                this.resetContainer();
            }
            if (nextProps.show !== this.props.show) {
                this.triggerLifeCycle(nextProps.show ? 'onShow' : 'onHide');
            }
        }
        resetContainer() {
            this.setState({
                containerOffsetTop: 0,
                onPullRefreshRelease: true
            });
        }
        onScroll() {
            console.log('onscroll');
        }
        onTouchStart(e) {
            const { pageY } = DynamicPage.extractCoordinate(e);
    
            this.touchCoordinate = {
                pageY
            };
            this.setState({
                onPullRefreshRelease: false
            });
        }
        onTouchMove(e) {
            const { scrollTop } = this.Ref;
            const deltaY = this.calculateDeltaY(e);
    
            if (scrollTop > 0 || deltaY > 0) return;
    
            this.setState({
                containerOffsetTop: Math.min(DynamicPage.maxPullRefreshDistance, -deltaY)
            });
        }
        onTouchEnd(e) {
            const deltaY = this.calculateDeltaY(e);
    
            if (deltaY > -DynamicPage.maxPullRefreshDistance) {
                this.resetContainer();
                return;
            }
            this.triggerLifeCycle('onPullDownRefresh', this.Ref);
            setTimeout(this.resetContainer.bind(this), DynamicPage.maxPullRefreshTime);
        }
        calculateDeltaY(e) {
            const { pageY } = DynamicPage.extractCoordinate(e);
            return this.touchCoordinate.pageY - pageY;
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
            return <React.Fragment>
                <div className="__internal__Page-pull-refresh __internal__Page-release-animation">
                    <PullDownLoading/>
                </div>
                <div
                    className='__internal__DynamicPage-container'
                    onScroll={this.onScroll.bind(this)}
                    onTouchStart={this.onTouchStart.bind(this)}
                    onTouchMove={this.onTouchMove.bind(this)}
                    onTouchEnd={this.onTouchEnd.bind(this)}
                    onTouchCancel={this.resetContainer.bind(this)}
                >
                    <ErrorBoundary>
                        <Comp ref={this.Ref} {...this.props} />
                    </ErrorBoundary>
                </div>
                <style jsx>
                    {`
                    .__internal__DynamicPage-container {
                        height: 100%;
                        transform: translateY(${this.state.containerOffsetTop}px);
                        ${this.state.onPullRefreshRelease ? 'transition: all .3s ease;' : ''}
                    }
                    .__internal__Page-pull-refresh {
                        position: absolute;
                        ${this.state.onPullRefreshRelease ? 'visibility: hidden;' : 'visibility: visible;'}
                        width: 100%;
                        top: ${-DynamicPage.maxPullRefreshDistance + this.state.containerOffsetTop}px;
                        height: ${DynamicPage.maxPullRefreshDistance}px;
                        line-height: ${DynamicPage.maxPullRefreshDistance}px;
                        z-index: -1;
                        text-align: center;
                        color: #999;
                    }
                    `}
                </style>
            </React.Fragment>
            
            ;
        }
    });
}
/**
 * 滚动组件
 *
 * @component Scroller
 * @version 3.0.0
 * @description 滚动组件,用来提供滚动容器。
 *
 * - 提供了横向滚动和纵向滚动。
 * - 提供了『下拉刷新』和『加载更多』功能。
 * - 提供了 `transition` 和 `requestAnimationFrame` 两种实现滚动的方式。
 * - 提供了 `transform` 和 `position:absolute` 两种实现位移的方式。
 *
 * 确定高度：Scroller 必须有一个确定的高度才能正常工作，因为它实际上就是将一系列不确定高度的子组件装进一个确定高度的容器。实现确定高度的方式有很多种：flex、指定高度、position: absolute等等。
 *
 * 内容容器：作为一个滚动组件，Scroller 会创建一个 div 作为滚动容器。如果 Scroller 的子元素只有一个，则会把这个子元素当做内容容器；否则，会创建一个 div 作为内容容器。
 * @instructions {instruInfo: ./scroller/basic.md}{instruUrl: scroller/base.html?hideIcon}
 * @instructions {instruInfo: ./scroller/refresh.md}{instruUrl: scroller/refresh.html?hideIcon}
 * @instructions {instruInfo: ./scroller/scrollevent.md}{instruUrl: scroller/scroll.html?hideIcon}
 */

// TODO: 干掉各种 magic number！！！
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import utils from './utils';
import { getElementOffsetY, getOnlyChild } from './CommonUtil';
import classNames from './classnames';
import LazyImage from './lazyimage';
import Sticky from './sticky';

const REFRESHSTATUS = {
    PULL: 'pullrefresh_pull',
    RELEASE: 'pullrefresh_release',
    LOAD: 'pullrefresh_load',
    SUCCESS: 'pullrefresh_success',
    FAIL: 'pullrefresh_fail'
};
const LOADSTATUS = {
    PULL: 'loadmore_pull',
    RELEASE: 'loadmore_release',
    LOAD: 'loadmore_load',
    NOMORE: 'loadmore_nomore'
};

const { rAF, cancelrAF } = utils.getRAF();

const defaultProps = {
    extraClass: '',
    containerExtraClass: '',
    containerExtraStyle: {},
    contentOffset: {
        x: 0,
        y: 0
    },
    disabled: false,
    scrollX: false,
    scrollY: true,
    freeScroll: false,
    directionLockThreshold: 5, // 锁定某一滚动方向的阀值
    momentum: true, // 惯性滚动
    bounce: true, // 弹性滚动
    bounceTime: 600, // 弹性滚动时间
    bounceEasing: utils.ease.circular, // 弹性滚动easing函数
    preventDefault: true, // 阻止默认事件
    preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ }, // 阻止默认事件的例外
    stopPropagation: false, // 阻止冒泡
    HWCompositing: true, // 是否开启硬件加速
    useTransition: true,
    useTransform: true,
    onScroll: null, // 滚动事件的回调
    usePullRefresh: false,
    pullRefreshHeight: 40,
    renderPullRefresh: null,
    onRefresh: null,
    useLoadMore: false,
    loadMoreHeight: 40,
    renderLoadMore: null,
    onLoad: null,
    autoRefresh: true,
    wrapper: null,
    enableLazyLoad: true,
    scrollWithouTouchStart: false,
    stickyOffset: 0
};

const propTypes = {
    /**
     * 组件额外class
     *
     * @property extraClass
     * @type String
     * @description 为组件根节点提供额外的class。
     * @default ''
     */
    extraClass: PropTypes.string,
    /**
     * 内容容器额外class
     *
     * @property containerExtraClass
     * @type String
     * @description 为组件中的内容容器提供额外的class。
     * @default ''
     */
    containerExtraClass: PropTypes.string,
    /**
     * 内容容器额外style
     *
     * @property containerExtraStyle
     * @type String
     * @description 为组件中的内容容器提供额外的style，主要用于横向滚动时，动态设置容器的宽度。
     * @default {}
     * @version 3.0.6
     */
    containerExtraStyle: PropTypes.object,
    /**
     * 内容位移
     *
     * @property contentOffset
     * @type {x: Number, y: Mumber}
     * @description 组件中内容的初始位移，这个属性变化时，会重置内容的位移。
     * @default {x: 0, y: 0}
     */
    contentOffset: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number
    }),
    /**
     * @property stickyOffset
     * @type Number
     * @description 吸顶容器偏移，如果你希望吸顶容器不位于top:0的位置，可以修改这个属性。
     * @default 0
     * @version 3.0.6
     */
    stickyOffset: PropTypes.number,
    /**
     * 是否禁止滚动
     *
     * @property disabled
     * @type Bool
     * @description 是否禁止滚动，默认允许滚动。
     * @default false
     */
    disabled: PropTypes.bool,
    /**
     * 横向滚动
     *
     * @property scrollX
     * @type Bool
     * @description 是否开启横向滚动，默认关闭。
     * @default false
     */
    scrollX: PropTypes.bool,
    /**
     * 纵向滚动
     *
     * @property scrollY
     * @type Bool
     * @description 是否开启纵向滚动,默认开启。
     * @default true
     */
    scrollY: PropTypes.bool,
    /**
     * 自由滚动
     *
     * @property freeScroll
     * @type Bool
     * @description 是否开启自由滚动。当设置为 `false` 时，只能响应某一个方向的滚动；当设置为 `true` 时，可以同时响应横向和纵向滚动（`scrollX` 和 `scrollY` 必须同时为 `true`）。
     * @default false
     * @skip
     */
    freeScroll: PropTypes.bool,
    /**
     * 方向锁定阈值
     *
     * @property directionLockThreshold
     * @type Number
     * @description 只允许单向滚动的时候，会根据这个阀值来判定响应哪个方向上的位移：某一方向位移减去另一个方向位移超过阀值，就会判定为这个方向的滚动。
     * @default 5
     */
    directionLockThreshold: PropTypes.number,
    /**
     * 惯性滚动
     *
     * @property momentum
     * @type Bool
     * @description 是否允许惯性滚动。当设置为 `true`，手指离开时，如果还有速度会继续滚动一段距离；当设置为 `false` ，手指离开时会立即停止滚动。
     * @default true
     */
    momentum: PropTypes.bool,
    /**
     * 弹性滚动
     *
     * @property bounce
     * @type Bool
     * @description 当滚动超出内容范围时，是否可以继续滚动一截。
     * @default true
     */
    bounce: PropTypes.bool,
    /**
     * 弹性滚动回弹时间
     *
     * @property bounceTime
     * @type Number
     * @description 当弹性滚动一截之后，回到滚动范围内位置的时间，单位为毫秒（ms）。
     * @default 600
     */
    bounceTime: PropTypes.number,
    /**
     * 弹性滚动回弹动画
     *
     * @property bounceEasing
     * @type Object
     * @description 弹性回滚动画。
     *
     * Scroller 提供了五种默认的动画函数：`quadratic`, `circular`, `back`, `bounce`, `elastic`，可以通过 `Scroller.ease.xxx` 来使用。
     *
     * 用户也可以自定义动画对象，比如：
     *
     * ``
     * {
     *     style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
     *     fn: function (k) {
     *         return k * ( 2 - k );
     *     }
     * }
     * ``
     * @default Scroller.ease.circular
     */
    bounceEasing: PropTypes.object,
    /**
     * transition开关
     *
     * @property useTransition
     * @type Bool
     * @description 如果设置为true,会使用transition来实现滚动效果;如果设置为false,会使用requestAnimationFrame来实现。
     * @default true
     */
    useTransition: PropTypes.bool,
    /**
     * transform开关
     *
     * @property useTransform
     * @type Bool
     * @description 如果设置为true,会使用transform来实现位移;如果设置为false,会使用left和top来实现位移（position: absolute）。
     * @default true
     */
    useTransform: PropTypes.bool,
    /**
     * 滚动事件回调
     *
     * @property onScroll
     * @type Function
     * @param {e} event 滚动事件的回调，结构为: {contentOffset: {x: x, y: y}}
     * @description (event) => void
     *
     * 滚动事件的回调。一旦设置了这个回调，为了能够监听滚动事件，会将useTransition属性强制设置为false，会由此带来一定的性能牺牲。
     */
    onScroll: PropTypes.func,
    /**
     * 自动刷新高度
     *
     * @property autoRefresh
     * @type Bool
     * @description 默认为true,在componentDidUpdate的时候会自动刷新高度;如果设置为false,则在内容发生变化时，需要用户主动调用refresh方法来刷新高度。
     * @default true
     * @skip
     */
    autoRefresh: PropTypes.bool,
    /**
     * 硬件加速
     *
     * @property HWCompositing
     * @type Bool
     * @description 是否开启硬件加速
     * @default true
     */
    HWCompositing: PropTypes.bool,
    eventPassthrough: PropTypes.bool,
    /**
     * @property preventDefault
     * @type Bool
     * @description 是否需要在Scroller容器上对所有的触摸事件（touchstart/touchmove/touchend/touchcancel）调用preventDefault。
     * 这个属性的默认值为true，这是为了避免一些安卓的兼容性问题。如果你发现一些默认效果没有被触发（例如输入框的blur），可以尝试设置这个属性为false。
     */
    preventDefault: PropTypes.bool,
    preventDefaultException: PropTypes.object,
    stopPropagation: PropTypes.bool,
    /**
     * 下拉刷新
     *
     * @property usePullRefresh
     * @type Bool
     * @description 是否开启下拉刷新功能
     * @default false
     * hasPullRefresh
     */
    usePullRefresh: PropTypes.bool,
    /**
     * 下拉刷新事件回调
     *
     * @property onRefresh
     * @type Function
     * @param {e} event 结构为: ({contentOffset: {x: x, y: y}})
     * @description (event) => void
     *
     * 下拉刷新时开始刷新的回调。
     */
    onRefresh: PropTypes.func,
    /**
     * 下拉刷新高度
     *
     * @property pullRefreshHeight
     * @type Number
     * @description 触发下拉刷新状态的高度（一般即为下拉刷新提示区域的高度）
     * @default 40
     * 可以考虑不要
     */
    pullRefreshHeight: PropTypes.number,
    /**
     * 下拉刷新渲染函数
     *
     * @property renderPullRefresh
     * @type Function
     * @returns {JSX} 用来渲染 pullRefresh 的 JSX
     * @description () => JSX
     *
     * 自定义的下拉刷新渲染函数
     */
    renderPullRefresh: PropTypes.func,
    /**
     * 加载更多
     *
     * @property useLoadMore
     * @type Bool
     * @description 是否开启加载更多功能.『加载更多』与『下拉刷新』略有不同，加载更多的提示区域是追加在内容区域的最后
     * @default false
     * hasLoadMore
     */
    useLoadMore: PropTypes.bool,
    /**
     * 加载更多事件回调
     *
     * @property onLoad
     * @type Function
     * @param {e} event 结构为: ({contentOffset: {x: x, y: y}})
     * @description (event) => void
     *
     * 加载更多时开始加载的回调。
     */
    onLoad: PropTypes.func,
    /**
     * 加载更多高度
     *
     * @property loadMoreHeight
     * @type Number
     * @description 触发加载更多状态的高度（一般即为加载更多提示区域的高度）
     * @default 40
     */
    loadMoreHeight: PropTypes.number,
    /**
     * 加载更多渲染函数
     *
     * @property renderLoadMore
     * @type Function
     * @returns {JSX} 用来渲染 loadMore 的 JSX
     * @description () => JSX
     *
     * 自定义的加载更多渲染函数
     */
    renderLoadMore: PropTypes.func,
    deceleration: PropTypes.number,
    wrapper: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string]),
    style: PropTypes.object,
    /**
     * @skip
     * @property enableLazyLoad
     * @type Bool
     * @description 是否开启图片lazyload,默认为true
     */
    enableLazyLoad: PropTypes.bool,
    /**
     * @property scrollWithoutTouchStart
     * @type Bool
     * @default false
     * @description ** 实验中的属性 **
     * 在默认情况下一次用户触发（非调用scrollTo方法）scroller的滚动需要由touchstart事件来启动，在某些情况下，例如scroller从disable状态切换到enable状态时，
     * 可能不能接收到这一瞬间的touchstart事件，这可能导致用户期待的滚动过程没有发生。
     * 开启这个属性为true以后将允许scroller用touchmove启动滚动过程，这可以解决上述场景的问题。
     * @version 3.0.2
     */
    scrollWithoutTouchStart: PropTypes.bool
};

export default class Scroller extends Component {

    static ease = utils.ease;

    static childContextTypes = {
        scroller: PropTypes.object,
        isScroller: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.x = 0;
        this.y = 0;
        this.directionX = 0;
        this.directionY = 0;
        this._scrollerStyle = {};

        this._resetProps(props, true);

        this.childLazyImages = [];
        this.stickyHeaders = [];
        this.stickyIndex = null;
        this.stickyOffset = null;
        this.wrapperOffsetTop = null;
    }

    getChildContext() {
        return { scroller: this, isScroller: this.props.enableLazyLoad };
    }

    componentDidMount() {
        this.wrapper = this.noWrapper ? this.wrapper : this.refs.wrapper;
        this.scroller = this.refs.scroller;

        // 重置 position 属性
        if (!this.useTransform) {
            if (!(/relative|absolute/i).test(this._scrollerStyle)) {
                this._scrollerStyle.position = 'relative';
            }
        }

        this.refresh();

        this._setRefreshStatus(REFRESHSTATUS.PULL);
        this._setLoadStatus(LOADSTATUS.PULL);
        this._refreshLoadMore();

        this._resetPosition();
        this.scrollTo(this.props.contentOffset.x, this.props.contentOffset.y);

        this._resize = () => {
            this.forceUpdate();
        };

        window.addEventListener('orientationchange', this._resize, false);
        window.addEventListener('resize', this._resize, false);

        this._tryLoadLazyImages();
        this._refreshSticky(true);

        if (this.stickyHeaders.length) {
            this.useTransition = false;
        }
    }

    componentWillReceiveProps(nextProps) {
        this._resetProps(nextProps);
    }

    componentDidUpdate(prevProps, prevState) {
        // 重置 contentOffset
        if (prevProps.contentOffset.x !== this.props.contentOffset.x || prevProps.contentOffset.y !== this.props.contentOffset.y) {
            this.scrollTo(this.props.contentOffset.x, this.props.contentOffset.y);
        }

        // 重置 position 属性
        if (!this.useTransform) {
            if (!(/relative|absolute/i).test(this._scrollerStyle)) {
                this._scrollerStyle.position = 'relative';
                this._setStyle(this.scroller, this._scrollerStyle);
            }
        }

        // 重新获取容器和内容尺寸
        if (this.props.autoRefresh) {
            this.refresh();
        }

        // 重置 pullRefresh 和 loadMore
        if (prevState.usePullRefresh !== this.state.usePullRefresh) {
            this._setRefreshStatus(REFRESHSTATUS.PULL);
        }
        if (prevState.useLoadMore !== this.state.useLoadMore) {
            this._setLoadStatus(LOADSTATUS.PULL);
            this._refreshLoadMore();
        }

        if (this.stickyHeaders.length) {
            this.useTransition = false;
        }

        this._tryLoadLazyImages();
        this._refreshSticky(true);
    }

    componentWillUnmount() {
        window.removeEventListener('orientationchange', this._resize, false);
        window.removeEventListener('resize', this._resize, false);
    }

    _resetProps(props, init) {
        this.state = this.state || {};

        // 重置 useTransition 和 useTransform
        this.translateZ = props.HWCompositing && utils.hasPerspective ? ' translateZ(0)' : '';
        this.useTransition = utils.hasTransition && props.useTransition;
        this.useTransform = utils.hasTransform && props.useTransform;

        if (props.onScroll) {
            this.useTransition = false;
        }

        // 重置 scrollX 和 scrollY
        this.eventPassthrough = props.eventPassthrough === true ? 'vertical' : props.eventPassthrough;
        this.preventDefault = !this.eventPassthrough && props.preventDefault;
        this.scrollY = this.eventPassthrough === 'vertical' ? false : props.scrollY;
        this.scrollX = this.eventPassthrough === 'horizontal' ? false : props.scrollX;
        this.verticalBounce = this.scrollY ? props.bounce : false;
        this.horizontalBounce = this.scrollX ? props.bounce : false;

        // 重置 下拉刷新 和 加载更多
        if (init) {
            this.state.usePullRefresh = this.scrollY && !this.scrollX && props.usePullRefresh;
            this.state.useLoadMore = this.scrollY && !this.scrollX && props.useLoadMore;
        } else {
            this.setState({
                usePullRefresh: this.scrollY && !this.scrollX && props.usePullRefresh,
                useLoadMore: this.scrollY && !this.scrollX && props.useLoadMore
            });
        }

        // 重置 wrapper（内容容器）
        // 兼容 Qreact 用 getOnlyChild(props) 替代 props.children && !props.children.length
        this.noWrapper = !!props.wrapper && getOnlyChild(props) && !this.state.usePullRefresh && !this.state.useLoadMore;

        if (this.noWrapper) {
            this.wrapper = props.wrapper;
        }

        // 如果disable状态发生了变化，需要重置initiated
        if (this.disabled !== props.disabled) {
            this.initiated = 0;
        }
        // 重置 disabled
        this.disabled = props.disabled;
        this.freeScroll = props.freeScroll && !this.eventPassthrough;
        this.directionLockThreshold = this.eventPassthrough ? 0 : props.directionLockThreshold;
    }

    _handleTouchStart(e) {
        if (this.disabled || (this.initiated && utils.eventType[e.type] !== this.initiated)) {
            return;
        }

        if (this.preventDefault && !utils.isBadAndroid && !utils.preventDefaultException(e.target, this.props.preventDefaultException)) {
            e.preventDefault();
        }
        if (this.props.stopPropagation) {
            e.stopPropagation();
        }

        const point = e.touches ? e.touches[0] : e;

        this.initiated = utils.eventType[e.type];
        this.moved = false;
        this.distX = 0;
        this.distY = 0;
        this.directionX = 0;
        this.directionY = 0;
        this.directionLocked = 0;

        this.startTime = utils.getTime();

        this.stopAnimate();

        this.startX = this.x;
        this.startY = this.y;
        this.absStartX = this.x;
        this.absStartY = this.y;
        this.pointX = point.pageX;
        this.pointY = point.pageY;

        // this._execEvent('beforeScrollStart');
    }

    _handleTouchMove(e) {
        if (this.disabled) {
            return;
        }

        if (utils.eventType[e.type] !== this.initiated) {
            if (this.props.scrollWithoutTouchStart) {
                this._handleTouchStart(e);
            } else {
                return;
            }
        }

        if (this.preventDefault) {	// increases performance on Android? TODO: check!
            e.preventDefault();
        }

        if (this.props.stopPropagation) {
            e.stopPropagation();
        }

        const point = e.touches ? e.touches[0] : e;
        const timestamp = utils.getTime();
        let deltaX = point.pageX - this.pointX;
        let deltaY = point.pageY - this.pointY;
        let newX;
        let newY;

        this.pointX = point.pageX;
        this.pointY = point.pageY;

        this.distX += deltaX;
        this.distY += deltaY;

        const absDistX = Math.abs(this.distX);
        const absDistY = Math.abs(this.distY);

        // We need to move at least 10 pixels for the scrolling to initiate
        if (timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10)) {
            return;
        }

        // If you are scrolling in one direction lock the other
        if (!this.directionLocked && !this.freeScroll) {
            if (absDistX > absDistY + this.directionLockThreshold) {
                this.directionLocked = 'h';		// lock horizontally
            } else if (absDistY >= absDistX + this.directionLockThreshold) {
                this.directionLocked = 'v';		// lock vertically
            } else {
                this.directionLocked = 'n';		// no lock
            }
        }

        if (this.directionLocked === 'h') {
            if (this.eventPassthrough === 'vertical') {
                e.preventDefault();
            } else if (this.eventPassthrough === 'horizontal') {
                this.initiated = false;
                return;
            }

            deltaY = 0;
        } else if (this.directionLocked === 'v') {
            if (this.eventPassthrough === 'horizontal') {
                e.preventDefault();
            } else if (this.eventPassthrough === 'vertical') {
                this.initiated = false;
                return;
            }

            deltaX = 0;
        }

        newX = this.x + deltaX;
        newY = this.y + deltaY;

        // Slow down if outside of the boundaries
        if (newX > 0) {
            newX = this.horizontalBounce ? this.x + deltaX / 3 : 0;
        } else if (newX < this.maxScrollX) {
            newX = this.horizontalBounce ? this.x + deltaX / 3 : this.maxScrollX;
        }

        if (newY > 0) {
            newY = this.verticalBounce ? this.y + deltaY / 3 : 0;
        } else if (newY < this.maxScrollY) {
            newY = this.verticalBounce ? this.y + deltaY / 3 : this.maxScrollY;
        }

        if (deltaX > 0) {
            this.directionX = -1;
        } else if (deltaX < 0) {
            this.directionX = 1;
        } else {
            this.directionX = 0;
        }

        if (deltaY > 0) {
            this.directionY = -1;
        } else if (deltaY < 0) {
            this.directionY = 1;
        } else {
            this.directionY = 0;
        }

        if (!this.moved) {
            this._execEvent('onScrollStart');
        }

        this.moved = true;

        this._translate(newX, newY);

        if (timestamp - this.startTime > 300) {
            this.startTime = timestamp;
            this.startX = this.x;
            this.startY = this.y;
        }

        this._execEvent('onScroll');
    }

    _handleTouchEnd(e) {
        if (this.disabled || utils.eventType[e.type] !== this.initiated) {
            return;
        }

        if (this.preventDefault && !utils.preventDefaultException(e.target, this.props.preventDefaultException)) {
            e.preventDefault();
        }

        if (this.props.stopPropagation) {
            e.stopPropagation();
        }

        let momentumX;
        let momentumY;
        const duration = utils.getTime() - this.startTime;
        let newX = Math.round(this.x);
        let newY = Math.round(this.y);
        let time = 0;

        this.isInTransition = 0;
        this.initiated = 0;
        this.endTime = utils.getTime();

        // set pullrefresh
        if (this.state.usePullRefresh && this.y >= this.props.pullRefreshHeight) {
            if (this.refreshState === REFRESHSTATUS.LOAD) {
                this.scrollTo(this.x, this.props.pullRefreshHeight, 200);
            } else {
                this._setRefreshStatus(REFRESHSTATUS.LOAD);
                this.scrollTo(this.x, this.props.pullRefreshHeight, 300);
                this._execEvent('onRefresh');
            }
            return;
        }

        // set loadmore
        // jiao.shen:此处将y<=max改成了y<max
        // 因为如果scroller正好滚到下边缘停住的时候,这时候如果scroller render,就会立刻触发loadmore,和使用习惯不符
        if (this.state.useLoadMore && this.y < this.maxScrollY) {
            if (this.loadState !== LOADSTATUS.NOMORE && this.loadState !== LOADSTATUS.LOAD) {
                this._setLoadStatus(LOADSTATUS.LOAD);
                this._execEvent('onLoad');
            }
        }

        // reset if we are outside of the boundaries
        if (this._resetPosition(this.props.bounceTime)) {
            return;
        }

        this.scrollTo(newX, newY);	// ensures that the last position is rounded

        if (!this.moved) {
            this._execEvent('onScrollCancel');
            return;
        }

        // start momentum animation if needed
        if (this.props.momentum && duration < 300) {
            momentumX = this.hasHorizontalScroll ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.horizontalBounce ? this.wrapperWidth : 0, this.props.deceleration)
                : {
                    destination: newX,
                    duration: 0
                };
            momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.verticalBounce ? this.wrapperHeight : 0, this.props.deceleration)
                : {
                    destination: newY,
                    duration: 0
                };
            newX = momentumX.destination;
            newY = momentumY.destination;
            time = Math.max(momentumX.duration, momentumY.duration);
            this.isInTransition = 1;
        }

        if (newX !== this.x || newY !== this.y) {
            let easing;

            // change easing function when scroller goes out of the boundaries
            if (newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY) {
                easing = utils.ease.quadratic;
            }

            this.scrollTo(newX, newY, time, easing);
            this._execEvent('onMomentumScrollBegin', {
                targetX: newX,
                targetY: newY
            });
            return;
        }

        this._execEvent('onScrollEnd');
    }

    _handleTransitionEnd(e) {
        if (e.target !== this.scroller || !this.isInTransition) {
            return;
        }

        this._transitionTime();
        if (!this._resetPosition(this.props.bounceTime)) {
            this.isInTransition = false;
            this._execEvent('onScrollEnd');
        }
    }

    /**
     * 尝试加载处于可视区域内的lazyimage
     * @param y
     */
    _tryLoadLazyImages() {
        if (this.childLazyImages.length) {
            this.childLazyImages.forEach((img) => this.loadImage(img));
        }
    }

    /**
     * @method loadImage
     * @param img LazyImage 实例
     * @description 判断并决定是否加载 LazyImage
     * @skip
     */
    loadImage(img) {
        const self = this;
        const _top = img.offsetTop - this.wrapperOffsetTop + this.y;
        if (_top < self.wrapperHeight) { // 出现在当前可视区域和可视区域上方都加载
            img.load(() => {
                const _height = img.props.style && img.props.style.height ? img.props.style.height : img.props.height;
                if (!_height) { // 如果设置了高度，就不再重新刷新
                    self.refresh();
                }
            });
        }
    }

    _getCurrentSticky() {
        const { stickyOffset } = this.props;
        let ret = null;
        if (this.y < 0) {
            const absY = Math.abs(this.y - stickyOffset);
            const wrapperTop = this.wrapperOffsetTop;
            const upperHeaders = this.stickyHeaders.filter(header => header.offsetTop - wrapperTop <= absY);

            if (upperHeaders.length) {
                const currentHeader = upperHeaders[upperHeaders.length - 1];
                const nextHeader = this.stickyHeaders[upperHeaders.length];
                const index = upperHeaders.length - 1;
                if (nextHeader) {
                    const distToNext = nextHeader.offsetTop - wrapperTop - absY;
                    const adjustOffset = distToNext > currentHeader.height ? 0 : -(currentHeader.height - distToNext);
                    ret = { currentHeader, adjustOffset, index };
                } else {
                    ret = { currentHeader, adjustOffset: 0, index };
                }
            } else {
                ret = null;
            }
        } else {
            ret = null;
        }
        return ret;
    }

    _refreshSticky(forceRefresh) {
        if (this.stickyHeaders.length) {
            const currentSticky = this._getCurrentSticky();
            const stickyNode = this.refs.stickyNode;

            if (currentSticky) {
                const { currentHeader, adjustOffset } = currentSticky;

                if (currentSticky.index !== this.stickyIndex
                    || currentSticky.adjustOffset !== this.stickyOffset
                    || forceRefresh) {
                    const transform = `translate(0px,${adjustOffset}px) translateZ(0px)`;
                    stickyNode.style.transform = transform;
                    stickyNode.style.webkitTransform = transform;
                    stickyNode.style.display = 'block';
                    stickyNode.className = currentHeader.stickyExtraClass;
                    ReactDOM.render(React.cloneElement(currentHeader.onlyChild), stickyNode);

                    this.stickyIndex = currentSticky.index;
                    this.stickyOffset = currentSticky.adjustOffset;
                }
            } else {
                this.stickyIndex = null;
                this.stickyOffset = null;
                stickyNode.style.display = 'none';
            }
        }
    }

    /**
     * @method stopAnimate
     * @description 停止当前的滚动动画，包括：惯性滚动、回弹、ScrollTo等。
     */
    stopAnimate() {
        if (this.useTransition && this.isInTransition) {
            this._transitionTime();
            this.isInTransition = false;

            const pos = this._getComputedPosition();

            this._translate(Math.round(pos.x), Math.round(pos.y));
            this._execEvent('onScrollEnd');
        } else if (!this.useTransition && this.isAnimating) {
            this._execEvent('onScrollEnd');
            cancelrAF(this.rAF);

            this.isAnimating = false;
        }
    }

    /**
     * @method _getComputedPosition
     * @returns {Object} 当前内容区域位移，{x: x, y: y}
     * @description 获取当前内容区域的位移
     * @skip
     */
    _getComputedPosition() {
        let matrix = window.getComputedStyle(this.scroller, null);
        let x;
        let y;

        if (this.useTransform) {
            matrix = matrix[utils.style.transform].split(')')[0].split(', ');
            x = +(matrix[12] || matrix[4]);
            y = +(matrix[13] || matrix[5]);
        } else {
            x = +matrix.left.replace(/[^-\d.]/g, '');
            y = +matrix.top.replace(/[^-\d.]/g, '');
        }

        return { x, y };
    }

    /**
     * @method _execEvent
     * @param {string} eventType 事件类型
     * @param {Object} param 参数
     * @description 触发事件回调
     * @skip
     */
    _execEvent(eventType, param) {
        // console.log(eventType)
        if (eventType === 'onScroll' || eventType === 'onScrollEnd') {
            this._tryLoadLazyImages();
            this._refreshSticky();
        }
        if (eventType === 'onScrollStart') {
            this.isScrolling = true;
        }
        if (eventType === 'onScrollEnd') {
            this.isScrolling = false;
        }
        if (this.props[eventType]) {
            this.props[eventType].apply(this, [{
                contentOffset: {
                    x: this.x,
                    y: this.y
                },
                param
            }]);
        }
    }

    /**
     * @method refresh
     * @param {Object} [refreshOption] 刷新参数，{wrapperWidth, wrapperHeight, scrollerWidth, scrollerHeight}
     * @description 刷新 Scroller，一般场景**不推荐使用**，因为当内容改变的时候，Scroller 会自动 render。
     *
     * 使用场景1：需要强制设置 Scroller 本身的宽高和内容容器的宽高时，可以通过refreshOption来传入宽高代替dom的宽高。
     *
     * 使用场景2：在某些不是通过 setState 或 Redux 等方式来改变内容导致 Scroller 不会 render 时，可以强制重新获取Scroller宽高和内容容器宽高。
     */
    refresh(refreshOption = {}, callFromList) {
        if (!callFromList) {
            this.wrapperWidth = typeof refreshOption.wrapperWidth !== 'undefined' ? refreshOption.wrapperWidth : this.wrapper.clientWidth;
            this.wrapperHeight = typeof refreshOption.wrapperHeight !== 'undefined' ? refreshOption.wrapperHeight : this.wrapper.clientHeight;
            this.scrollerWidth = typeof refreshOption.scrollerWidth !== 'undefined' ? refreshOption.scrollerWidth : this.scroller.offsetWidth;

            if (this.refs.wrapper) {
                this.wrapperOffsetTop = getElementOffsetY(this.refs.wrapper, null);
            }
        }

        this.scrollerHeight = typeof refreshOption.scrollerHeight !== 'undefined' ? refreshOption.scrollerHeight : this.scroller.offsetHeight;

        // 如果有下拉刷新，设置下拉刷新的位置，重置scrollerHeight
        if (this.state.useLoadMore && this.refs.LoadMore) {
            this.refs.LoadMore.style.visibility = this.scrollerHeight > 0 ? 'visible' : 'hidden';
            this.refs.LoadMore.style.top = `${this.scrollerHeight}px`;
            this.scrollerHeight += this.props.loadMoreHeight;
        }

        this.maxScrollX = this.wrapperWidth - this.scrollerWidth;
        this.maxScrollY = this.wrapperHeight - this.scrollerHeight;

        this.hasHorizontalScroll = this.props.scrollX && this.maxScrollX < 0;
        this.hasVerticalScroll = this.props.scrollY && this.maxScrollY < 0;

        if (!this.hasHorizontalScroll) {
            this.maxScrollX = 0;
            this.scrollerWidth = this.wrapperWidth;
        }

        if (!this.hasVerticalScroll) {
            this.maxScrollY = 0;
            this.scrollerHeight = this.wrapperHeight;
        }

        this.endTime = 0;
        this.directionX = 0;
        this.directionY = 0;
    }

    /**
     * @method _resetPosition
     * @param {Number} [time] 滚动到临界点的时间
     * @description 校正当前内容的位置，如果超出了可滚动的范围，则滚动到临界点。主要用于回弹。
     * @skip
     */
    _resetPosition(time) {
        let x = this.x;
        let y = this.y;
        const animateTime = time || 0;

        if (this.refreshState === REFRESHSTATUS.LOAD && this.y === this.props.pullRefreshHeight) {
            return false;
        }

        if (!this.hasHorizontalScroll || this.x > 0) {
            x = 0;
        } else if (this.x < this.maxScrollX) {
            x = this.maxScrollX;
        }

        if (!this.hasVerticalScroll || this.y > 0) {
            y = 0;
        } else if (this.y < this.maxScrollY) {
            y = this.maxScrollY;
        }

        if (x === this.x && y === this.y) {
            return false;
        }

        this.scrollTo(x, y, animateTime, this.props.bounceEasing);

        return true;
    }

    /**
     * @method scrollTo
     * @param {Number} x 水平位移，默认值为当前水平位移
     * @param {Number} y 垂直位移，默认值为当前垂直位移
     * @param {Number} time 滚动时间，默认值为0
     * @param {Object} [easing] 滚动动画对象。参照 `bounceEasing` 参数。
     *
     * @description 滚动到某个位置。
     */
    scrollTo(x = this.x, y = this.y, time, easing) { // TODO: 给scrollTo加上回调，由于transitionend事件并不能针对某一次的transition，所以暂时不好处理
        const _easing = easing || utils.ease.circular;
        const transitionType = this.useTransition && _easing.style;

        this.isInTransition = this.useTransition && time > 0;

        if (!time || transitionType) {
            if (transitionType) {
                this._transitionTimingFunction(_easing.style);
                this._transitionTime(time);
            }
            this._translate(x, y);
        } else {
            this._animate(x, y, time, _easing.fn);
        }
        // 由于scrollto不会触发onScroll事件，因此这里需要手动刷新一下sticky
        this._refreshSticky(true);
        this._tryLoadLazyImages();
    }

    _transitionTimingFunction(easing) {
        this._scrollerStyle[utils.style.transitionTimingFunction] = easing;
    }

    _transitionTime(time) {
        const _time = time || 0;
        const durationProp = utils.style.transitionDuration;
        if (!this.useTransition) {
            return;
        }

        if (!durationProp) {
            return;
        }
        this._scrollerStyle[durationProp] = `${_time}ms`;

        if (!_time && utils.isBadAndroid) {
            this._scrollerStyle[durationProp] = '0.0001ms';

            // remove 0.0001ms
            rAF(() => {
                if (this._scrollerStyle[durationProp] === '0.0001ms') {
                    this._scrollerStyle[durationProp] = '0s';
                }
            });
        }

        this._setStyle(this.scroller, this._scrollerStyle);
    }

    _setStyle(dom, style) {
        const _style = Object.assign({}, style);
        const _dom = dom;

        Object.keys(_style).forEach((key) => {
            _dom.style[key] = _style[key];
        });
    }

    _translate(x, y) {
        if (this.useTransform) {
            this._scrollerStyle[utils.style.transform] = `translate(${x}px,${y}px)${this.translateZ}`;

            this.x = x;
            this.y = y;

            this._setStyle(this.scroller, this._scrollerStyle);
        } else {
            const _x = Math.round(x);
            const _y = Math.round(y);

            this._scrollerStyle.left = `${_x}px`;
            this._scrollerStyle.top = `${_y}px`;

            this.x = _x;
            this.y = _y;

            this._setStyle(this.scroller, this._scrollerStyle);
        }

        if (this.state.usePullRefresh) {
            if (y >= this.props.pullRefreshHeight && this.refreshState === REFRESHSTATUS.PULL) {
                this._setRefreshStatus(REFRESHSTATUS.RELEASE);
            } else if (y < this.props.pullRefreshHeight && this.refreshState === REFRESHSTATUS.RELEASE) {
                this._setRefreshStatus(REFRESHSTATUS.PULL);
            }
        }

        if (this.state.useLoadMore) {
            if (this.maxScrollY - y > 0 && this.loadState === LOADSTATUS.PULL) {
                // this._setRefreshStatus(LOADSTATUS.RELEASE);
                this._setLoadStatus(LOADSTATUS.RELEASE);
            } else if (this.maxScrollY - y <= 0 && this.loadState === LOADSTATUS.RELEASE) {
                // this._setRefreshStatus(LOADSTATUS.PULL);
                this._setLoadStatus(LOADSTATUS.PULL);
            }
        }
    }

    _animate(destX, destY, duration, easingFn) {
        const self = this;
        const startX = this.x;
        const startY = this.y;
        const startTime = utils.getTime();
        const destTime = startTime + duration;

        const step = () => {
            const now = utils.getTime();
            const easing = easingFn((now - startTime) / duration);
            const newX = (destX - startX) * easing + startX;
            const newY = (destY - startY) * easing + startY;

            if (now >= destTime) {
                self.isAnimating = false;
                self._translate(destX, destY);

                if (!self._resetPosition(self.props.bounceTime)) {
                    self._execEvent('onScrollEnd');
                }

                return;
            }

            self._translate(newX, newY);

            this._execEvent('onScroll');

            if (self.isAnimating) {
                cancelrAF(self.rAF);
                self.rAF = rAF(step);
            }
        };

        this.isAnimating = true;
        step();
    }

    _setRefreshStatus(status) {
        if (!this.state.usePullRefresh) {
            return;
        }

        const _prevRefreshState = this.refreshState;
        this.refreshState = status;

        Object.keys(REFRESHSTATUS).forEach((item) => {
            const _ref = REFRESHSTATUS[item];
            if (this.refs[_ref]) {
                this.refs[_ref].style.display = status === _ref ? '' : 'none';
            }
        });

        const releaseIcon = this.refs[REFRESHSTATUS.RELEASE].querySelector('i');
        const pullIcon = this.refs[REFRESHSTATUS.PULL].querySelector('i');

        // todo: 为啥用了react之后，这个地方需要setTimeout才能正常动画
        setTimeout(() => {
            if (_prevRefreshState === REFRESHSTATUS.PULL && status === REFRESHSTATUS.RELEASE) {
                releaseIcon.style[utils.style.transform] = '';
                pullIcon.style[utils.style.transform] = 'rotate(180deg)';
            } else {
                releaseIcon.style[utils.style.transform] = 'rotate(-180deg)';
                pullIcon.style[utils.style.transform] = '';
            }
        }, 0);
    }

    _setLoadStatus(status) {
        if (!this.state.useLoadMore) {
            return;
        }

        const _prevLoadState = this.loadState;
        this.loadState = status;

        Object.keys(LOADSTATUS).forEach((item) => {
            const _ref = LOADSTATUS[item];
            if (this.refs[_ref]) {
                this.refs[_ref].style.display = status === _ref ? '' : 'none';
            }
        });

        const releaseIcon = this.refs[LOADSTATUS.RELEASE].querySelector('i');
        const pullIcon = this.refs[LOADSTATUS.PULL].querySelector('i');

        // todo: 为啥用了react之后，这个地方需要setTimeout才能正常动画
        setTimeout(() => {
            if (_prevLoadState === LOADSTATUS.PULL && status === LOADSTATUS.RELEASE) {
                releaseIcon.style[utils.style.transform] = '';
                pullIcon.style[utils.style.transform] = 'rotate(180deg)';
            } else {
                releaseIcon.style[utils.style.transform] = 'rotate(-180deg)';
                pullIcon.style[utils.style.transform] = '';
            }
        }, 0);
    }

    /**
     * @method resetLoadStatus
     * @param {Bool} hasLoadMore 是否能够加载更多，如果传入false，加载更多区域的文字将会变成 没有更多了，并且继续向下滚动时不会触发onLoadMore。
     * @description 重置加载更多功能。
     * @version 3.0.7
     */
    resetLoadStatus(hasLoadMore) {
        this._setLoadStatus(hasLoadMore ? LOADSTATUS.PULL : LOADSTATUS.NOMORE);
    }

    /**
     * @method startRefreshing
     * @param {Number} [time] 滚动到顶部的时间，默认为 300ms
     * @description 强制开始刷新。这个方法一般是用在切换筛选项或者关键字等场景，来达到回到顶部并且开始刷新的效果。如果是用户下拉触发 `onRefresh` 时，就不需要再调用这个方法了。
     */
    startRefreshing(time = 300) {
        if (this.state.usePullRefresh && this.refreshState !== REFRESHSTATUS.LOAD) {
            this._setRefreshStatus(REFRESHSTATUS.LOAD);
            this.scrollTo(this.x, this.props.pullRefreshHeight, time);

            this._execEvent('onRefresh');
        }
    }

    /**
     * @method stopRefreshing
     * @param {Bool} status 刷新的状态。true表示加载成功，false表示加载失败。
     * @param {Object} [config] 停止刷新的动画配置
     * @param {number} [config.duration] 回到顶部的动画时间，默认是300ms
     * @description 停止刷新，停止之后会自动滚动到顶部。
     */
    stopRefreshing(status, config = { duration: 300 }) {
        if (this.state.usePullRefresh && this.refreshState === REFRESHSTATUS.LOAD) {
            this._setRefreshStatus(status ? REFRESHSTATUS.SUCCESS : REFRESHSTATUS.FAIL);

            // 方案一：放在scrollTo的回调中处理状态，但是scrollTo的回调有时候会有问题；可以通过this.disabled = true 来禁止滚动解决现有的问题
            // this.scrollTo(this.x, 0, 300, null, ()=>{
            //     this._setRefreshStatus(REFRESHSTATUS.PULL);
            // });

            // 方案二：setTimeout的方式，但是不准确，尤其是在比较卡的机器上
            this.scrollTo(this.x, 0, config.duration);
            this.disabled = true;
            setTimeout(() => {
                this._setRefreshStatus(REFRESHSTATUS.PULL);
                this._setLoadStatus(LOADSTATUS.PULL);
                this.disabled = false;
            }, config.duration);
        }
    }

    /**
     * @method stopLoading
     * @param {Bool} status 刷新的状态。true表示加载了更多数据，false表示没有更多数据了。
     * @description 停止加载更多。
     */
    stopLoading(status) {
        if (this.state.useLoadMore && this.loadState === LOADSTATUS.LOAD) {
            this._setLoadStatus(status ? LOADSTATUS.PULL : LOADSTATUS.NOMORE);
        }
    }

    /**
     * @method _refreshLoadMore
     * @skip
     * @private
     * @description 更新useLoadMore属性时的逻辑（该逻辑必须放到refresh之后，因为refresh才会计算的到正确的scrollerHeight）
     *
     * 1. 如果是去掉useLoadMore，需要重新设置位置（因为scrollerHeight变少了）
     * 2. 如果是加上useLoadMore，需要设置LoadMore的位置（此时的scrollerHeight是包括loadMoreHeight的，所以需要减去loadMoreHHeight）
     */
    _refreshLoadMore() {
        if (!this.state.useLoadMore) {
            this._resetPosition();
        } else {
            if (this.refs.LoadMore) {
                this.refs.LoadMore.style.top = `${this.scrollerHeight - this.props.loadMoreHeight}px`;
            }
        }
    }

    render() {
        const { extraClass, containerExtraClass, pullRefreshHeight, loadMoreHeight, stickyOffset } = this.props;
        let pullRefreshContent;
        let loadMoreContent;

        if (this.state.usePullRefresh) {
            const pullRefreshTpl = (
                <div
                    ref="pullrefresh"
                    className="yo-load"
                    style={{
                        height: `${pullRefreshHeight}px`,
                        lineHeight: `${pullRefreshHeight}px`,
                        top: `${-pullRefreshHeight}px`
                    }}
                >
                    <div className="yo-loadtip" ref="pullrefresh_pull">
                        <i className="yo-ico">&#xf07b;</i>
                        <div className="text">下拉可以刷新</div>
                    </div>
                    <div className="yo-loadtip" ref="pullrefresh_release">
                        <i className="yo-ico">&#xf079;</i>
                        <div className="text">释放立即更新</div>
                    </div>
                    <div className="yo-loadtip" ref="pullrefresh_load">
                        <i className="yo-ico yo-ico-loading">&#xf089;</i>
                        <div className="text">努力加载中...</div>
                    </div>
                    <div className="yo-loadtip" ref="pullrefresh_success">
                        <i className="yo-ico yo-ico-succ">&#xf078;</i>
                        <div className="text">加载成功</div>
                    </div>
                    <div className="yo-loadtip" ref="pullrefresh_fail">
                        <i className="yo-ico yo-ico-fail">&#xf077;</i>
                        <div className="text">加载失败</div>
                    </div>
                </div>
            );

            pullRefreshContent = this.props.renderPullRefresh ? this.props.renderPullRefresh() : pullRefreshTpl;
        }

        if (this.state.useLoadMore) {
            const loadMoreTpl = (
                <div
                    ref="LoadMore"
                    className="yo-load"
                    style={{
                        height: `${loadMoreHeight}px`,
                        lineHeight: `${loadMoreHeight}px`,
                        top: `${-loadMoreHeight}px`
                    }}
                >
                    <div className="yo-loadtip" ref="loadmore_pull">
                        <i className="yo-ico">&#xf079;</i>
                        <div className="text">上拉加载更多</div>
                    </div>
                    <div className="yo-loadtip" ref="loadmore_release">
                        <i className="yo-ico">&#xf07b;</i>
                        <div className="text">释放立即加载</div>
                    </div>
                    <div className="yo-loadtip" ref="loadmore_load">
                        <i className="yo-ico yo-ico-loading">&#xf089;</i>
                        <div className="text">正在加载...</div>
                    </div>
                    <div className="yo-loadtip" ref="loadmore_nomore">
                        <div className="text">没有更多了...</div>
                    </div>
                </div>);

            loadMoreContent = this.props.renderLoadMore ? this.props.renderLoadMore() : loadMoreTpl;
        }

        let wrapperStyle = Object.assign({ overflow: 'hidden' }, this.props.style);
        let scrollerStyle = Object.assign({}, this.props.containerExtraStyle, this._scrollerStyle);
        let scrollerContent;
        let _wrapperClassName = classNames('yo-scroller', extraClass);
        let _scrollerClassName = classNames('scroller', containerExtraClass);

        // 兼容 Qreact
        const theOnlyChild = getOnlyChild(this.props);

        if (this.noWrapper) { // 1. 不需要滚动容器（只适用于特殊的、内容的宽高已知的情况）
            scrollerContent = React.cloneElement(this.props.children, {
                ref: 'scroller',
                onTouchStart: (evt) => this._handleTouchStart(evt),
                onTouchMove: (evt) => this._handleTouchMove(evt),
                onTouchEnd: (evt) => this._handleTouchEnd(evt),
                onTouchCancel: (evt) => this._handleTouchEnd(evt),
                onTransitionEnd: (evt) => this._handleTransitionEnd(evt)
            });
            // 兼容 Qreact
        } else if (theOnlyChild
            && typeof theOnlyChild.type === 'string'
            && !this.state.usePullRefresh
            && !this.state.useLoadMore) { // 2. 将内容的最外层节点当做滚动容器
            if (theOnlyChild.props && theOnlyChild.props.className) {
                _scrollerClassName = classNames('scroller', theOnlyChild.props.className);
            } else {
                _scrollerClassName = 'scroller';
            }

            let content = React.cloneElement(theOnlyChild, {
                ref: 'scroller',
                className: _scrollerClassName,
                style: scrollerStyle
            });

            scrollerContent = (
                <div
                    ref="wrapper"
                    className={_wrapperClassName}
                    onTouchStart={(evt) => this._handleTouchStart(evt)}
                    onTouchMove={(evt) => this._handleTouchMove(evt)}
                    onTouchEnd={(evt) => this._handleTouchEnd(evt)}
                    onTouchCancel={(evt) => this._handleTouchEnd(evt)}
                    onTransitionEnd={(evt) => this._handleTransitionEnd(evt)}
                    style={wrapperStyle}
                >
                    <div
                        ref="stickyNode"
                        style={{ position: 'absolute', top: stickyOffset, left: 0, right: 0, zIndex: 9999 }}
                        className="sticky"
                    />
                    {content}
                </div>
            );
        } else { // 3. 在内容的外面加一层滚动容器
            scrollerContent = (
                <div
                    ref="wrapper"
                    className={_wrapperClassName}
                    onTouchStart={(evt) => this._handleTouchStart(evt)}
                    onTouchMove={(evt) => this._handleTouchMove(evt)}
                    onTouchEnd={(evt) => this._handleTouchEnd(evt)}
                    onTouchCancel={(evt) => this._handleTouchEnd(evt)}
                    onTransitionEnd={(evt) => this._handleTransitionEnd(evt)}
                    style={wrapperStyle}
                >
                    <div
                        ref="stickyNode"
                        style={{ position: 'absolute', top: stickyOffset, left: 0, right: 0, zIndex: 9999 }}
                        className="sticky"
                    />
                    <div className={_scrollerClassName} ref="scroller" style={scrollerStyle}>
                        {this.props.children}
                        {pullRefreshContent}
                        {loadMoreContent}
                    </div>
                </div>
            );
        }

        return scrollerContent;
    }
}

Scroller.defaultProps = defaultProps;
Scroller.propTypes = propTypes;
Scroller.Sticky = Sticky;
Scroller.LazyImage = LazyImage;
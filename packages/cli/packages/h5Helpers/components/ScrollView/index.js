import React from '@react';


class ScrollView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.onScrollListener = this.onScrollListener.bind(this);   // 监听滚动条的函数
        if (this.props.onScrollToUpper) {      // 滚动到顶部处理的函数
            if (typeof this.props.onScrollToUpper !== "function") {
                throw new Error(
                    `onScrollToUpper 必须为函数类型`
                );
            }
            this.onScrollToUpper = this.debounce(this.props.onScrollToUpper, 100, this)
        }

        
        if (this.props.onScrollToLower) {   // 滚动到底部处理的函数
            if (typeof this.props.onScrollToLower !== "function") {
                throw new Error(
                    `onScrollToLower 必须为函数类型`
                );
            }
            this.onScrollToLower = this.debounce(this.props.onScrollToLower, 100, this);
        }
    }

    componentDidMount() {
        this.container = document.querySelector('.__internal__DynamicPage-container');
        this.container.addEventListener("scroll", this.onScrollListener,true);

        const scrollY = this.props["scroll-y"];     // 允许纵向滚动
        const scrollX = this.props["scroll-x"];     // 允许横向滚动	
        const scrollTop = this.props["scroll-top"];  // 设置竖向滚动条位置	 
        const scrollLeft = this.props["scroll-left"];// 设置横向滚动条位置		
        const scrollWithAnimation = this.props["scroll-with-animation"];  // 在设置滚动条位置时使用动画过渡
        const scrollIntoView = this.props["scroll-into-view"];    // 值应为某子元素id（id不能以数字开头）。设置哪个方向可滚动，则在哪个方向滚动到该元素

        if (scrollIntoView && typeof scrollIntoView !== 'string') {
            throw new Error(
                `scroll-into-view 只能是 string 类型`
            );
        }

        if (typeof scrollWithAnimation !== 'boolean') {
            throw new Error(
                `scroll-with-animation 只能是 true 或者 false`
            );
        }

        if (scrollY) {
            if (typeof scrollY !== "boolean") {
                throw new Error(
                    `scroll-y 只能是 true 或者 false`
                );
            }
            if (scrollTop) {
                if (typeof scrollTop !== 'number' && typeof scrollTop !== 'string') {
                    throw new Error(
                        `scroll-top 只能是 number 或者 string 类型`
                    );
                }
                this.scrollTo(scrollTop, 'y', scrollWithAnimation);
            } else if (scrollIntoView) {
                this.toViewTarget = this.getToViewTarget(scrollIntoView);
                this.scrollTo(this.toViewTarget.offsetTop, 'y', scrollWithAnimation);
            }
        }

        if (scrollX) {
            if (typeof scrollX !== "boolean") {
                throw new Error(
                    `scroll-x 只能是 true 或者 false`
                );
            }
            if (scrollLeft) {
                if (typeof scrollLeft !== 'number' && typeof scrollLeft !== 'string') {
                    throw new Error(
                        `scroll-left 只能是 number 或者 string 类型`
                    );
                }

                this.scrollTo(scrollLeft, 'x', scrollWithAnimation);
            } else if (scrollIntoView) {
                this.toViewTarget = this.getToViewTarget(scrollIntoView);
                this.scrollTo(this.toViewTarget.offsetLeft, 'x', scrollWithAnimation);
            }
        }

    }
    componentWillUpdate(props){

        const scrollY = this.props["scroll-y"];
        const scrollX = this.props["scroll-x"];
        const scrollTopNew = props["scroll-top"];       // 新的竖向滚动条位置
        const scrollTopOld = this.props["scroll-top"];  // 旧的竖向滚动条位置
        const scrollLeftNew = props["scroll-left"];     
        const scrollLeftOld = this.props["scroll-left"];

        const scrollWithAnimation = this.props["scroll-with-animation"];
        const scrollIntoViewNew = props["scroll-into-view"];
        const scrollIntoViewOld = this.props["scroll-into-view"];

        if (scrollY) {
          
            if (typeof scrollTopOld !== "undefined" && scrollTopNew !== scrollTopOld) {
                this.scrollTo(scrollTopNew, 'y', scrollWithAnimation);
            }

            if (scrollIntoViewOld && scrollIntoViewNew !== scrollIntoViewOld) {
                this.toViewTarget = this.getToViewTarget(scrollIntoViewNew);
                this.scrollTo(this.toViewTarget.offsetTop, 'y', scrollWithAnimation);
            }
        }

        if (scrollX) {
            if (typeof scrollLeftOld !== 'undefined' && scrollLeftNew !== scrollLeftOld) {
                this.scrollTo(scrollLeftNew, 'x', scrollWithAnimation);
            }

            if (scrollIntoViewOld && scrollIntoViewNew !== scrollIntoViewOld) {
                this.toViewTarget = this.getToViewTarget(scrollIntoViewNew);
                this.scrollTo(this.toViewTarget.offsetLeft, 'x', scrollWithAnimation);
            }
        }
    }

    throttle(fn, threshhold, scope) {
        threshhold || (threshhold = 250);
        var last,
            deferTimer;
        return function () {
          var context = scope || this;

          var now = +new Date,
              args = arguments;
          if (last && now < last + threshhold) {
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
              last = now;
              fn.apply(context, args);
            }, threshhold);
          } else {
            last = now;
            fn.apply(context, args);
          }
        };
    }

    debounce(fn, delay, thisObj) {
        var timerId = -1;
        return function(e) {
            clearTimeout(timerId);
            timerId = setTimeout(() => {
                fn.call(thisObj, e)
            }, delay || 300);  
        }
    }

    onScrollListener(event) {
        const scrollTop = event.target.scrollTop;

        const scrollY = this.props["scroll-y"];
        const scrollX = this.props["scroll-x"];
        const upperThreshold = this.props["upper-threshold"];   // 距顶部/左边多远时，触发 onScrollToupper 事件
        const lowerThreshold = this.props["lower-threshold"];  

        if (typeof this.props.onScroll === "function") {
          setTimeout(() => this.props.onScroll(event), 0);
        } else {
            throw new Error(
                `onScroll 只能为函数类型`
            );
        }
        
        if (upperThreshold && typeof upperThreshold !== 'number' && typeof upperThreshold !== 'string') {
            throw new Error(
                `upper-threshold 只能是 number 或者 string 类型`
            );
        }
        if (lowerThreshold && typeof lowerThreshold !== 'number' && typeof lowerThreshold !== 'string') {
            throw new Error(
                `lower-threshold 只能是 number 或者 string 类型`
            );
        }

        if (scrollY) {
            if (upperThreshold && scrollTop <= upperThreshold) {
                this.onScrollToUpper(event);
            }else if(lowerThreshold && (this.container.scrollTop + this.container.offsetHeight >= this.container.scrollHeight - lowerThreshold)) {
                this.onScrollToLower(event);
            }
        } else if (scrollX) {
            if (upperThreshold && this.container.scrollLeft <= upperThreshold) {
                this.onScrollToUpper(event);
            }
            if (lowerThreshold && (this.container.scrollLeft + this.container.offsetWidth >= this.container.scrollWidth - lowerThreshold)) {
                this.onScrollToLower(event);
            }
        }
    }

    getToViewTarget(id) {
        return document.getElementById(id);
    }

    scrollTo(position, direction, scrollWithoutAnimation) {
        const animation = scrollWithoutAnimation;
        if (position < 0) {
            position = 0;
        } else if (direction === 'x' && position > this.container.scrollWidth - this.container.offsetWidth) {
            position = this.container.scrollWidth - this.container.offsetWidth;
        } else if (direction === 'y' && position > this.container.scrollHeight - this.container.offsetHeight) {
            position = this.container.scrollHeight - this.container.offsetHeight;
        }

        const offset = direction === 'x' ? this.container.scrollLeft - position : this.container.scrollTop - position;

        if (offset !== 0) {
            if (animation) {
                this.scrollableInner.style.transition = 'transform .3s ease-out';
                this.scrollableInner.style.webkitTransition = '-webkit-transform .3s ease-out';

                this.scrollableInner.removeEventListener('transitionend', this.__transitionEnd);
                this.scrollableInner.removeEventListener('webkitTransitionEnd', this.__transitionEnd);

                this.__transitionEnd = this._transitionEnd.bind(this, position, direction);
                this.scrollableInner.addEventListener('transitionend', this.__transitionEnd);
                this.scrollableInner.addEventListener('webkitTransitionEnd', this.__transitionEnd);

                if (direction === 'x') {
                    this.container.style.overflowX = 'hidden';
                } else if (direction === 'y') {
                    this.container.style.overflowY = 'hidden';
                }

                const translateStyle = direction === 'x' ? 'translateX(' + offset + 'px) translateZ(0)' : 'translateY(' + offset + 'px) translateZ(0)';
                this.scrollableInner.style.transform = translateStyle;
                this.scrollableInner.style.webkitTransform = translateStyle;
            } else {
                if (direction === 'x') {
                    this.container.style.overflowX = direction === 'x' ? 'auto' : 'hidden';
                    this.container.scrollLeft = position;
                } else if (direction === 'y') {
                    this.container.style.overflowY = direction === 'y' ? 'auto' : 'hidden';
                    this.container.scrollTop = position;
                }
            }
        }
    }

    _transitionEnd(position, direction) {
        this.scrollableInner.style.transition = '';
        this.scrollableInner.style.webkitTransition = '';

        this.scrollableInner.style.transform = '';
        this.scrollableInner.style.webkitTransform = '';

        if (direction === 'x') {
            this.container.style.overflowX = direction === 'x' ? 'auto' : 'hidden';
            this.container.scrollLeft = position;
        } else if (direction === 'y') {
            this.container.style.overflowY = direction === 'y' ? 'auto' : 'hidden';
            this.container.scrollTop = position;
        }

        this.scrollableInner.removeEventListener('transitionend', this.__transitionEnd);
        this.scrollableInner.removeEventListener('webkitTransitionEnd', this.__transitionEnd);
    }


    render() {
        const scrollY = this.props["scroll-y"];
        const scrollX = this.props["scroll-x"];

        let outerDivStyle = {};
        if (scrollY) {
            if (this.props.style) {
                outerDivStyle = {
                   ...this.props.style,
                   overflowY: 'auto',
                   webkitOverflowScrolling: 'touch'
                };
            }
        } else if (scrollX) {
            if (this.props.style) {
                outerDivStyle = {
                   ...this.props.style,
                   overflowX: 'auto',
                   webkitOverflowScrolling: 'touch'
                };
            }
            outerDivStyle.whiteSpace = "nowrap";
        } else {
            outerDivStyle.overflow = "hidden";
            outerDivStyle.whiteSpace = "nowrap";
        }

        return (
            <div style={outerDivStyle} ref={scrollable => (this.scrollable = scrollable)}>
                <div ref={scrollableInner => (this.scrollableInner = scrollableInner)}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

ScrollView.defaultProps = {
    "scroll-with-animation": false,
    "scroll-x": false,
    "scroll-y": false,
    "upper-threshold": 50,
    "lower-threshold": 50,
    "onScrollToUpper": () => {},
    "onScrollToLower": () => {},
    "onScroll": () => {}
};

export default ScrollView;

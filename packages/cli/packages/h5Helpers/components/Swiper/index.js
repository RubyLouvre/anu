// 1. autoplay
// componentDidMount、componentWillUpdate 的时候判断是否执行 autoplay
// componentWillUnmount 的时候清除可能还在运行的 autoplay 定时器
// 2. onChange
// 每次 goto 结束后执行
// 3. onTransition
// 4. circular
// circular 和 非 circular 其实一样的模式，只不过在原有 SwiperItem 前渲染了一份一摸一样的列表
// 当滑动的边界的时候，将位移重新定位来达到模拟衔接滚动的效果
// 要注意的是，这个时候的 current 是正常的一倍，需要处理，由于多出来的都是复制的相同的，所以不会有其他的区别
// 5. translate
// 位移统一使用 translate
// 6. vertical
// 逻辑相同，取不同的值，pageX/pageY
// 7. 没有实现 previousMargin、nextMargin、skipHiddenItemLayout

import React, { Component } from '@react';
import './index.scss';
import util from './util';

const { rAF, cancelrAF } = util.getRAF();

class Swiper extends Component {
  constructor(props) {
    super(props);

    // this.state.current 与 this.current 不一定相同
    // 在 circular 模式下，由于衔接滚动是使用两组列表来模拟的
    // 对于列表 | 0 | 1 | 2 | ，circular 模式下实际上是 | 0 | 1 | 2 | 0(3) | 1(4) | 2(5) |
    // 对于 0 来说，它实际 index 可能是 0 或 3
    // 内部使用 0~5 ，用 this.current
    // 对外使用 0~2 ，用 this.state.current (减少 setState 次数)
    this.state = {
      current: props.current
    };

    this.swiper = null; // h5-swiper DOM
    this.wrapper = null; // h5-swiper-wrapper DOM
    this.touching = false; // 是否处于滑动过程
    this.isAnimating = false; // 是否处于 animate 动画过程
    this.current = props.current; // 当前滑块 index
    this.currentItemId = props.currentItemId || ''; // 当前滑块 itemId，优先级高于 current
    this.items = []; // SwiperItem 的实例
    this.swiperLength = 0; // swiper 在滑动方向的长度 offsetWidth | offsetHeight
    this.pageX = 0; // 上次记录点坐标
    this.translateX = 0; // wrapper 当前 translate 值
    this.translateXStart = 0; // 记录滑动开始时 wrapper 的 translate 值，用于计算 dx/dy
    this.intervalId = null; // autoplay 定时器id
    this.translateRange = { min: 0, max: 0 }; // swiper-wrapper 非 circular 情况下 translate 范围

    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }

  handleTouchStart(e) {
    const point = e.touches ? e.touches[0] : e;
    this.translateXStart = this.translateX;
    this.pageX = this.props.vertical ? point.pageY : point.pageX;
    this.touching = true;
  }

  handleTouchMove(e) {
    e.preventDefault(); // 防止带动外层滑动
    const { vertical, circular, displayMultipleItems } = this.props;
    const point = e.touches ? e.touches[0] : e;
    const pointX = vertical ? point.pageY : point.pageX;
    const deltaX = pointX - this.pageX; // 与上次记录点偏差
    let target = this.translateX + deltaX;
    if (!circular) {
      if (
        this.translateX > this.translateRange.max ||
        this.translateX < this.translateRange.min
      ) {
        target = this.translateX + deltaX / 8;
      }
    } else {
      // circular 模拟改变了 translate ，需要对 translateXStart 做补正
      if (this.translateX > 0) {
        this.translateXStart -=
          (this.swiperLength / displayMultipleItems) * (this.items.length / 2);
        this.goto({
          index: this.items.length / 2,
          source: null,
          animation: false
        });
        return;
      } else if (this.translateX < this.translateRange.min) {
        this.translateXStart +=
          (this.swiperLength / displayMultipleItems) * (this.items.length / 2);
        this.goto({
          index: this.items.length / 2 - displayMultipleItems,
          source: null,
          animation: false
        });
        return;
      }
    }
    this.translate(target);
    this.pageX = pointX;
  }

  handleTouchEnd() {
    const { displayMultipleItems } = this.props;
    const itemLength = this.swiperLength / displayMultipleItems;
    this.touching = false;
    this.goto({
      index: Math.round(Math.abs(this.translateX) / itemLength),
      source: 'touch'
    });
  }

  autoPlay() {
    const { interval, circular } = this.props;
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.intervalId = setInterval(() => {
      const { displayMultipleItems } = this.props;
      let current =
        (this.current + 1) % (this.items.length - displayMultipleItems + 1);
      this.translateXStart = this.translateX;
      if (!this.touching) {
        let cb = () => {};
        // circular 模式下如果需要更新位置了，在动画结束后更新位置，目前 autoplay 是向左滑动，如果有向右滑动的，还需要特殊处理
        if (circular && current === this.items.length - displayMultipleItems) {
          cb = () => {
            this.touching ||
              this.goto({
                index: this.items.length / 2 - displayMultipleItems,
                source: null,
                animation: false
              });
          };
        }
        this.goto({
          index: current,
          source: 'autoplay',
          cb
        });
      }
    }, interval);
  }

  /**
   *
   * @param {Number} index 滑动到对应 index 的滑块
   * @param {String} source swiper 变更的原因 autoplay | touch | '' | null(表示不需要更新indicators和触发onChange)
   * @param {Function} cb 传给 this.animate ，在动画结束后执行
   * @param {Boolean} animation 滑动是否需要动画效果
   */
  goto({ index, source, cb, animation = true }) {
    const { displayMultipleItems, onChange, circular } = this.props;
    const prevCurrent = this.current;
    // 非 circular 下限制  0 <= index <= this.items.length - displayMultipleItems
    // 如果 displayMultipleItems === this.items.length，不能进行滑动
    if (displayMultipleItems === this.items.length) {
      return;
    }
    // index 限制在 [0, SwiperItem 个数]
    if (index < 0) {
      index = 0;
    } else if (index > this.items.length - displayMultipleItems) {
      index = this.items.length - displayMultipleItems;
    }

    this.current = index;
    this.currentItemId = this.items[index] && this.items[index].itemId || '';
    let current = this.current;
    // circular 模式下更新位置的时候，并不需要更新 indicators和触发 onChange，此时 source 传 null
    // circular 模式下需要处理 current
    if (current !== prevCurrent && source !== null) {
      if (circular) {
        const trueLength = this.items.length / 2;
        if (current >= trueLength) {
          current -= trueLength;
        }
      }
      this.setState({ current });
      onChange &&
        onChange({
          detail: {
            current,
            currentItemId: this.currentItemId,
            source: source || ''
          },
          current
        });
    }

    this.animate({
      destX: (-this.swiperLength / displayMultipleItems) * index,
      detail: { source, current, currentItemId: this.currentItemId },
      animation,
      cb
    });
  }

  // 获取 Swiper 下面的 SwiperItem 实例
  getSwiperItems() {
    try {
      // 这里获取 PickerItem 的方式需要改一下，现在的方式太死板了
      const fiber = this._reactInternalFiber;
      if (fiber) {
        return Object.values(fiber.child.child.children).map(f => f.stateNode);
      }
    } catch (e) {
      // eslint-disable-next-line
      console.warn('get SwiperItems error', e);
    }
  }

  // 渲染面板指示点
  renderIndicator() {
    const {
      indicatorColor,
      indicatorActiveColor,
      circular,
      displayMultipleItems,
      vertical
    } = this.props;
    let { current } = this.state;
    let len = (this.items.length || 0) / (circular ? 2 : 1);
    let arr = util.getArray(len).map((i, index) => index);
    const activeIndexs = (circular ? arr.concat(arr) : arr).slice(
      current,
      current + displayMultipleItems
    );
    const getStyle = index => ({
      backgroundColor:
        activeIndexs.indexOf(index) !== -1
          ? indicatorActiveColor
          : indicatorColor
    });
    return (
      <div className={`indicators ${vertical ? 'indicators-vertical' : ''}`}>
        {arr.map(index => (
          <div key={index} className="indicator" style={getStyle(index)} />
        ))}
      </div>
    );
  }

  // swiper 位移，sign 为 true 的时候调用 onTransition
  translate(distance, sign = true) {
    if (!this.wrapper) return;
    const { vertical, onTransition } = this.props;
    this.translateX = distance;
    this.wrapper.style.transform = `translate${
      vertical ? 'Y' : 'X'
    }(${distance}px)`;
    const type = vertical ? ['dy', 'dx'] : ['dx', 'dy'];
    sign &&
      onTransition &&
      onTransition({
        detail: {
          [type[0]]: this.translateXStart - this.translateX,
          [type[1]]: 0
        }
      });
  }

  /**
   *
   * @param {Number} destX 沿滑动方向 translate 的长度
   * @param {Boolean} animation 是否有动画，false 的话直接调用 translate
   * @param {Number} duration 动画时长
   * @param {Function} easingFn 缓动函数
   * @param {Object} detail 供 onAnimationFinish 使用
   * @param {Function} cb 动画结束后执行
   */
  animate({ destX, animation = true, cb, duration, easingFn, detail }) {
    if (!animation) {
      this.translate(destX, animation);
      cb && cb();
      return;
    }
    duration = duration || this.props.duration;
    easingFn = easingFn || util.ease.in;
    const startTime = util.getTime();
    let startX = this.translateX;
    const destTime = startTime + duration;
    const step = () => {
      if (this.props.touching) {
        this.stopAnimate();
        return;
      }
      const now = util.getTime();
      const easing = easingFn((now - startTime) / duration);
      const newX = (destX - startX) * easing + startX;

      if (now >= destTime) {
        this.isAnimating = false;
        this.translate(destX);
        const fn = this.props.onAnimationFinish;
        if (detail.source !== null && fn) {
          detail.source = detail.source || '';
          fn && fn({ detail });
        }
        cb && cb();
        return;
      }
      this.translate(newX);

      if (this.isAnimating) {
        cancelrAF(this.rAF);
        this.rAF = rAF(step);
      }
    };
    this.isAnimating = true;
    step();
  }

  stopAnimate() {
    if (this.isAnimating) {
      cancelrAF(this.rAF);
      this.isAnimating = false;
    }
  }

  componentDidMount() {
    // 为了滑动的时候阻止默认事件
    this.wrapper.addEventListener('touchmove', this.handleTouchMove, {
      passive: false
    });
    this.items = this.getSwiperItems();
    let { current, currentItemId, autoplay } = this.props;
    const len = this.items.length;
    current %= len / 2; // circular 模式下需要保持在前面一组
    // 找到 currentItemId 对应的 index
    if (currentItemId) {
      for (let i = 0; i < len; i++) {
        if (this.items[i].itemId === currentItemId) {
          current = i;
          break;
        }
      }
    }
    // 这时还获取不到正确的 this.swiper.offsetWidth，所以延迟一下执行
    setTimeout(() => {
      this.goto({
        index: current,
        source: null,
        animation: false
      });
    }, 0);
    autoplay && this.autoPlay();
  }

  componentWillUpdate(nextProps) {
    if (nextProps.autoplay !== this.props.autoplay) {
      nextProps.autoplay
        ? this.autoPlay()
        : this.intervalId && clearInterval(this.intervalId);
    }
  }

  componentDidUpdate() {
    const { displayMultipleItems, vertical } = this.props;
    this.swiperLength = vertical
      ? this.swiper.offsetHeight
      : this.swiper.offsetWidth;
    // 更新 translateRange
    if (this.items.length !== 0 && this.swiperLength) {
      this.translateRange.min =
        -this.swiperLength *
        ((1 / displayMultipleItems) * this.items.length - 1);
    }
  }

  componentWillUnmount() {
    this.wrapper.removeEventListener('touchmove', this.handleTouchMove);
    this.intervalId && clearInterval(this.intervalId);
    this.stopAnimate();
  }

  render() {
    const {
      vertical,
      style,
      children,
      displayMultipleItems,
      circular,
      indicatorDots,
      className
    } = this.props;
    const propClass = className || this.props.class || '';
    let childrenArr = React.Children.toArray(children);
    // circular 模式下两组来模拟衔接滚动
    if (circular) {
      childrenArr = childrenArr.concat(childrenArr);
    }
    return (
      <div
        ref={s => (this.swiper = s)}
        className={`h5-swiper ${propClass}`}
        style={style}
      >
        <div
          ref={w => (this.wrapper = w)}
          className={`h5-swiper-wrapper ${
            vertical ? 'h5-swiper-wrapper-vertical' : ''
          }`}
          onTouchStart={this.handleTouchStart}
          onTouchEnd={this.handleTouchEnd}
          onTouchCancel={this.handleTouchCancel}
        >
          {childrenArr.map(child =>
            React.cloneElement(child, {
              SWIPER: { displayMultipleItems, swiper: this.swiper, vertical }
            })
          )}
        </div>
        {indicatorDots ? this.renderIndicator() : null}
      </div>
    );
  }
}

Swiper.defaultProps = {
  indicatorDots: false, // 是否显示面板指示点
  indicatorColor: 'rgba(0, 0, 0, 0.3)', // 指示点颜色
  indicatorActiveColor: '#000000', // 当前选中的指示点颜色
  autoplay: false, // 是否自动切换
  current: 0, // 当前所在滑块的 index
  currentItemId: '', // 当前所在滑块的 item-id，不能与 current 被同时指定
  interval: 5000, // 自动切换时间间隔
  duration: 500, // 滑动动画时长
  circular: false, // 是否采用衔接滑动
  vertical: false, // 滑动方向是否为纵向
  previousMargin: '0px', // 前边距，可用于漏出前一项的一小部分，接收 px | rpx
  nextMargin: '0px', // 后边距，可用于漏出前一项的一小部分，接收 px | rpx
  displayMultipleItems: 1, // 同时显示的滑块数量
  skipHiddenItemLayout: false, // 是否跳过未显示的滑块布局
  onChange: () => {}, // current 改变时触发
  onTransition: () => {}, // SwiperItem 的位置发生改变时触发
  onAnimationFinish: () => {} // 动画结束时触发
};

export default Swiper;

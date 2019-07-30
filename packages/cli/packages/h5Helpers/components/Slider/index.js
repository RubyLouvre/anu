/*
min	            Number	0	    最小值	
max	            Number	100	    最大值	
step	        Number	1	    步长，取值必须大于 0，并且可被(max - min)整除	
disabled	    Boolean	false	是否禁用	
value	        Number	0	    当前取值	
activeColor	    Color	#1aad19	已选择的颜色	
backgroundColor	Color	#e9e9e9	背景条的颜色	
block-size	    Number	28	    滑块的大小，取值范围为 12 - 28
block-color	    Color	#ffffff	滑块的颜色
show-value	    Boolean	false	是否显示当前 value	
*/

import React from '@react';
import './index.scss';

const BLOCK_SIZE_MIN = 12;
const BLOCK_SIZE_MAX = 28;

export default class Slider extends React.Component {
  static defaultProps = {
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    value: 0,
    activeColor: '#1aad19',
    backgroundColor: '#e9e9e9',
    'block-size': 28,
    'block-color': '#fff',
    'show-value': false,
    onChange: f => f
  };

  constructor(props) {
    super(props);
    this.state = {
      value: this.checkDefaultValue(props),
      touching: false,
      sliderTotalWidth: 0,
      touchId: null,
      oneStepOfPX: 0,
      valueChanged: props.min,
      slideDistanceX: 0,
      touchStartSlideDistanceX: 0,
      touchStartPercent: 0
    };

    this.checkPropsMinMaxStep(props);

    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }

  componentDidMount() {
    // eslint-disable-next-line no-console
    console.log('%c componentDidMount:::this:::', 'color:green;', this);
    const { clientWidth } = this.sliderDom;
    this.setState(
      {
        sliderTotalWidth: clientWidth
      },
      () => {
        this.updateValue(this.state.value);
      }
    );
  }

  checkDefaultValue(props) {
    const { value, min, max } = props;
    return value < +min ? +min : value > +max ? +max : value;
  }

  checkPropsMinMaxStep(props) {
    const { min, max, step } = props;
    const err = [];
    if (step <= 0) {
      err.push('step 必须大于 0');
    }
    if ((max - min) % step !== 0) {
      err.push('步长(step)必须被(max - min)整除');
    }
    if (err.length) {
      throw new Error(err.join(','));
    }
  }

  handleTouchStart(event) {
    const { touching, slideDistanceX, percent } = this.state;
    if (touching && this.props.disabled) return;
    this.setState({
      touching: true,
      touchId: event.touches[0].identifier,
      touchStartPageX: event.touches[0].pageX,
      touchStartPercent: percent,
      touchStartSlideDistanceX: slideDistanceX
    });
  }
  handleTouchMove(event) {
    const {
      touchId,
      touching,
      touchStartPageX,
      sliderTotalWidth,
      touchStartSlideDistanceX,
      slideDistanceX
    } = this.state;
    const { disabled, min, max, step, onChange } = this.props;
    const touchObj = event.touches[0];
    if (!touching && disabled) return;
    if (touchId !== touchObj.identifier) return;

    const diffPageX = touchObj.pageX - touchStartPageX;
    const slideWidth = sliderTotalWidth - this.calcBlockHandler();
    let distanceX = diffPageX + touchStartSlideDistanceX;
    distanceX =
      distanceX <= 0 ? 0 : distanceX >= slideWidth ? slideWidth : distanceX;
    const steps = (max - min) / step;
    const distanceOfOneStep = slideWidth / steps;
    for (let i = 0, left, right, middle; i < steps; i++) {
      left = distanceOfOneStep * i;
      right = distanceOfOneStep * (i + 1);
      middle = distanceOfOneStep * (i + 0.5);
      if (distanceX >= left && distanceX <= right) {
        distanceX = distanceX >= middle ? right : left;
      }
    }
    if (slideDistanceX !== distanceX) {
      const value = Math.round((distanceX / distanceOfOneStep) * step + ~~min);
      this.setState(
        {
          slideDistanceX: distanceX,
          value
        },
        () => onChange && onChange({ value })
      );
    }
  }
  handleTouchEnd() {
    if (!this.state.touching && this.props.disabled) return;
    this.setState({
      touching: false,
      touchId: null,
      touchStartPageX: 0,
      touchStartPercent: 0,
      touchStartSlideDistanceX: 0
    });
  }

  updateValue(value) {
    const { min, max } = this.props;
    const { sliderTotalWidth } = this.state;
    const blockSize = this.calcBlockHandler();
    value = value < min ? min : value > max ? max : value;
    const slideDistanceX =
      value - min === 0
        ? 0
        : ((value - min) / (max - min)) * (sliderTotalWidth - blockSize);

    this.setState({
      value,
      slideDistanceX
    });
  }

  /**
   * 计算滑块的宽高
   * size = 1 正常大小 width=height
   * borderRadius 设置为圆形 数值为width的一半
   */
  calcBlockHandler(size = 1) {
    let radius = this.props['block-size'];
    radius =
      radius < BLOCK_SIZE_MIN
        ? BLOCK_SIZE_MIN
        : radius > BLOCK_SIZE_MAX
          ? BLOCK_SIZE_MAX
          : radius;
    return radius * size;
  }

  render() {
    const {
      backgroundColor,
      'show-value': showValue,
      'block-color': blockColor,
      activeColor
    } = this.props;
    const { slideDistanceX, value } = this.state;
    const blockSize = this.calcBlockHandler();
    const radius = blockSize * 0.5;
    const distance = slideDistanceX;
    return (
      <div className="h5-slider-container">
        <div className="h5-slider-content" ref={dom => (this.sliderDom = dom)}>
          <div className="h5-slider-track">
            <div className="track-bg" style={{
              margin: `${radius}px`,
              backgroundColor: `${backgroundColor}`
            }} />
          </div>
          <div className="h5-slider-track">
            <div style={{
              margin: `${radius}px`,
              backgroundColor: `${activeColor}`,
              width: `${distance}px`
            }} className="track-active">
            </div>
          </div>

          <div className="h5-slider-track">
            <div
              className="handler"
              style={{
                width: `${blockSize}px`,
                height: `${blockSize}px`,
                backgroundColor: `${blockColor}`,
                borderRadius: `${radius}px`,
                boxShadow: '0 0 4px rgba(0, 0, 0, 0.2)',
                transform: `translateX(${distance}px)`
              }}
              onTouchStart={this.handleTouchStart}
              onTouchMove={this.handleTouchMove}
              onTouchEnd={this.handleTouchEnd}
            />
          </div>
        </div>

        {showValue && <div className="h5-slider-show-value">{value}</div>}
      </div>
    );
  }
}

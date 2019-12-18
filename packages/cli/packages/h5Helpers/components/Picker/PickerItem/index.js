import React from '@react';
import './index.scss';
/* eslint-disable */


class XPickerItem extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      touching: false,
      touchId: undefined,
      ogY: 0,
      ogTranslate: 0, // 移动之前的起始位置
      translate: 0,
      selected: 0,
      totalHeight: props.items.length * props.indicatorHeight
    };

    this.props.items = this.props.items.map((el)=>{
      return Object.assign(el, {keyItem: el[this.props.mapKeys.label]} || el );
    });
  }

  componentDidMount() {
    this.adjustPosition(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.items.length !== nextProps.items.length) {
      this.setState({
        totalHeight: nextProps.items.length * this.props.indicatorHeight
      })
    }

    this.adjustPosition(nextProps);
  }

  adjustPosition(props) {
    
    let { items, itemHeight, indicatorTop, defaultIndex } = props;
    itemHeight = itemHeight;
    indicatorTop = indicatorTop;
    const totalHeight = items.length * itemHeight;
    let translate = totalHeight <= indicatorTop ? indicatorTop : 0;
    if (defaultIndex > -1) {
      if (translate === 0) {
        let upperCount = Math.floor(indicatorTop / itemHeight);
        if (defaultIndex > upperCount) {
          // over
          let overCount = defaultIndex - upperCount;
          translate -= overCount * itemHeight;
        } else if (defaultIndex === upperCount) {
          translate = 0;
        } else {
          //less
          translate += Math.abs(upperCount - defaultIndex) * itemHeight;
        }
      } else {
        // 如果总的 item 高度小于 indicator height
        translate -= itemHeight * defaultIndex;
      }
    }

    this.setState({
      selected: defaultIndex,
      ogTranslate: translate,
      translate
    });
    
    if(defaultIndex > -1) {
      this.updateSelected(false, translate)
    } else {
      this.updateSelected(true, translate)
    }

  }

  handleTouchStart(e) {
    if (this.state.touching || this.props.items.length <= 1) return;
    var touchObj = e.type === 'touchstart' ? e.touches[0] : e;
    this.setState({
      touching: true,
      ogTranslate: this.state.translate,
      touchId:touchObj.identifier,
      ogY:
        this.state.translate === 0 ? touchObj.pageY : touchObj.pageY - this.state.translate,
      animating: false
    });
  }

  handleTouchMove(e) {
    if (!this.state.touching || this.props.items.length <= 1) return;
    var touchObj =  e.type === 'touchmove' ? e.touches[0] : e;

    if (touchObj.identifier !== this.state.touchId) return;

    const pageY =touchObj.pageY;
    const diffY = pageY - this.state.ogY;
   

    this.setState({
      translate: diffY
    });
  }

  handleTouchEnd() {
    
    if (!this.state.touching || this.props.items.length <= 1) return;

    let { indicatorTop, indicatorHeight, itemHeight } = this.props;
    indicatorTop = indicatorTop;
    indicatorHeight = indicatorHeight;
    itemHeight = itemHeight;
    let translate = this.state.translate;

    if (Math.abs(translate - this.state.ogTranslate) < itemHeight * 0.51) {
      // 相当于没有移动
      translate = this.state.ogTranslate;
    } else if (translate > indicatorTop) {
      // 第一个参数超出 indicatorTop
      translate = indicatorTop;
    } else if (translate + this.state.totalHeight < indicatorTop + indicatorHeight) {
      // 最后一个参数 超出
      translate = indicatorTop + indicatorHeight - this.state.totalHeight;
    } else {
      let step = 0,
        adjust = 0;
      let diff = (translate - this.state.ogTranslate) / itemHeight;

      if (Math.abs(diff) < 1) {
        step = diff > 0 ? 1 : -1;
      } else {
        adjust = Math.abs((diff % 1) * 100) > 50 ? 1 : 0;
        step = diff > 0 ? Math.floor(diff) + adjust : Math.ceil(diff) - adjust;
      }

      translate = this.state.ogTranslate + step * itemHeight;
    }

    this.setState(
      {
        touching: false,
        ogY: 0,
        touchId: undefined,
        ogTranslate: 0,
        animating: true,
        translate
      }
      
    );

    this.updateSelected(true, translate)
  }

  updateSelected(propagate = true, translate) {
    let { items, itemHeight, indicatorTop, indicatorHeight, onChange, groupIndex } = this.props;
    indicatorTop = indicatorTop;
    indicatorHeight = indicatorHeight;
    itemHeight = itemHeight;
    let selected = 0;

    items.forEach((item, i) => {
      if ( !item.disabled && (translate + (itemHeight * i)) >= indicatorTop &&
            ( translate + (itemHeight * i) + itemHeight ) <= indicatorTop + indicatorHeight ){
                selected = i;
            }
    })
    if (onChange && propagate) onChange(selected, groupIndex);

  }

  render() {
    return (
      <stack
        catchMouseDown={this.handleTouchStart.bind(this)}
        catchMouseMove={this.handleTouchMove.bind(this)}
        catchMouseUp={this.handleTouchEnd.bind(this)}
        catchTouchStart={this.handleTouchStart.bind(this)}
        catchTouchMove={this.handleTouchMove.bind(this)}
        onTouchEnd={this.handleTouchEnd.bind(this)}
        style={{ width: '100%' }}
        class="anu-stack"
      >
        <div
          class="anu-picker_content"
          style = {{
            height: this.state.totalHeight + 'PX',
            transform: 'translateY('+this.state.translate +'PX)'
          }}
        >
          {this.props.items.map(function(item, index) {
            return (
              <text
                key={item.keyItem}
                class={'anu-picker__item ' + (item.disabled ? 'anu-picker__item_disabled' : '')}
              >
                {item[this.props.mapKeys.label] || item}
              </text>
            );
          })}
        </div>

        <div class="anu-picker__mask">
          <div class="anu-picker__mask_top" />
          <div class="anu-picker__mask_center" />
          <div class="anu-picker__mask_bottom " />
        </div>
      </stack>
    );
  }
}

XPickerItem.defaultProps = {
  itemHeight: 25 + 9, //content + padding
  indicatorTop: 102, // 中心点距离pick顶部的高度
  indicatorHeight: 34,
  aniamtion: true,
  groupIndex: -1,
  defaultIndex: -1,
  mapKeys: {
    label: 'label'
  }
};

export default XPickerItem;
import React, { Component } from '@react';
import './index.scss';

class SwiperItem extends Component {
  constructor(props) {
    super(props);

    this.itemId = props.itemId;
  }

  componentWillReceiveProps(nextProps) {
    this.itemId = nextProps.itemId || '';
  }

  render() {
    const {
      SWIPER: { displayMultipleItems, swiper, vertical },
      children,
      className,
      onClick
    } = this.props;
    let length = 0;
    if (swiper) {
      length = vertical ? swiper.offsetHeight : swiper.offsetWidth;
    }
    return (
      <div
        className={`${className || ''} ${this.props.class ||
          ''} h5-swiper-item`}
        onClick={onClick}
      >
        {children}
        <style ref={(node) => {
            Object(node).textContent = `
            .h5-swiper-item {
              flex-basis: ${length / displayMultipleItems}px;
              flex-shrink: 0;
            }`;
        }}/>
      </div>
    );
  }
}

SwiperItem.defaultProps = {
  itemId: ''
};

export default SwiperItem;

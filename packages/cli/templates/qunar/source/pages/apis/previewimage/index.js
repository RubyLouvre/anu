import React from '@react';
import './index.scss';
/* eslint-disable */

// 事件
class P extends React.Component {
  constructor() {
    super();
    console.log(111)
    this.state = {
      picId: 0,
      showSwiper: false,
      imgList: [
        {
          src: '../../../../assets/img/pic1.webp'
        },
        {
          src: '../../../../assets/img/pic2.webp'
        },
        {
          src: '../../../../assets/img/pic3.webp'
        },
        {
          src: '../../../../assets/img/pic4.webp'
        },
        {
          src: '../../../../assets/img/pic5.webp'
        },
        {
          src: '../../../../assets/img/pic6.webp'
        },
        {
          src: '../../../../assets/img/pic7.webp'
        },
        {
          src: '../../../../assets/img/pic8.webp'
        },
        {
          src: '../../../../assets/img/pic9.webp'
        }
      ]
    };
  }

  showPic(id) {
    console.log('id', id)   
    this.setState({
      picId: id,
      showSwiper: !this.state.showSwiper
    })
  }

  render() {
    return (
      <div class="doc-page xui-y-c xui-x-c col">
        <swiper
          class="pre-swiper"
          hidden={!this.state.showSwiper}
          indicator="false"
          index={this.state.picId}
        >
          {this.state.imgList.map(function(item) {
            return (
              <div class="swiper-image-container" onClick={this.showPic.bind(this, 0)}>
                <image src={item.src} style="resize-mode: contain;" class="xui-col-12" />
              </div>
            );
          })}
        </swiper>
        <text>点击放大图片后可滚动查看所有图片</text>
        <div class="content">
          <swiper class="swiper" indicator="false">
            {this.state.imgList.map(function(item, index) {
              return (<div class="image-container">
                <image src={item.src} style="resize-mode: contain;" class="xui-col" onClick={this.showPic.bind(this, index)}/>
              </div>);
            })}
          </swiper>
        </div>
      </div>
    );
  }
}
export default P;

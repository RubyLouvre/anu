import React from '@react';
import './index.scss';
// eslint-disable-next-line
import Dialog from '@components/dialog/index';
import LotteryDraw from '@components/LotteryDraw/index';
class Cart extends React.Component {
    constructor() {
        super();
        this.state = {
            cartImg: '../../assets/images/cart-null.png',
            tipWords: '购物车空空如也',
            visible: true
        };
    }

  config = {
      backgroundTextStyle: 'white',
      navigationBarTextStyle: 'white',
      navigationBarTitleText: '购物车',
      navigationBarBackgroundColor: '#292929',
      backgroundColor: '#F2F2F2',
      enablePullDownRefresh: true
  };

  //   tap() {
  //     wx.showModal({
  //         title: '购物车',
  //         content: '该功能未实现',
  //         success: function(res) {
  //           if (res.confirm) {
  //             console.log('用户点击确定')
  //           } else if (res.cancel) {
  //             console.log('用户点击取消')
  //           }
  //         }
  //       })
  //   }

  componentWillMount() {
      this.setState({
          visible: false
      });
  }

  //   tap() {
  //     this.setState({
  //       visible: false
  //     });
  //   }

  onOk() {
      this.setState({
          visible: true
      });
  }

  onCanel() {
      this.setState({
          visible: true
      });
  }

  render() {
      return (
          <div className="cart-container">
              <image src={this.state.cartImg} onTap={this.tap} className="cart-image" />
              <view>{this.state.tipWords}</view>
              {/* <Dialog
          visible={this.state.visible}
          onOk={this.onOk.bind(this)}
          onCanel={this.onCanel.bind(this)}
        /> */}

              <div hidden={this.state.visible}>
                  <div className="ys-mask" onTap={this.onCanel} />
                  <div className="ys-dialog">
                      <div className="ys-dialog-contetn">
                          <LotteryDraw onOk={this.onOk.bind(this)} />
                      </div>
                  </div>
              </div>
          </div>
      );
  }
}

export default Cart;

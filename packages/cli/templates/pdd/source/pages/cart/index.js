import React from '@react';
import './index.scss';
// eslint-disable-next-line
// import Dialog from '@components/Dialog/index';
import TurnTable from '@components/TurnTable/index';
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

  tap() {
      this.setState({
          visible: false
      });
  }

  componentWillMount() {
      this.setState({
          visible: false
      });
  }

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
              <div>
                  <image src={this.state.cartImg} onTap={this.tap} className="cart-image" />
                  <view>{this.state.tipWords}</view>
              </div>
              {/* <Dialog
          visible={this.state.visible}
          onOk={this.onOk.bind(this)}
          onCanel={this.onCanel.bind(this)}
        /> */}

              <div hidden={this.state.visible}>
                  <div className="ys-mask" onTap={this.onCanel} />
                  <div className="ys-dialog">
                      <div>
                          <image src='../../assets/images/lottery_draw_log.png' class='lottery_draw_log' />
                          <TurnTable onOk={this.onOk.bind(this)} />
                      </div>
                  </div>
              </div>

          </div>
      );
  }
}

export default Cart;
import { Fragment } from 'react-core/util';
import { Component } from 'react-core/Component';
import { handleSuccess, handleFail } from '../../utils';

export default class Modal extends Component {
  handleConfirm() {
    handleSuccess({
      errMsg: 'showModal:ok',
      cancel: false,
      confirm: true
    }, this.props.success, this.props.complete, this.props.resolve);
    document.getElementById('h5-api-showModal').remove();
  }
  handleCancel() {
    handleSuccess({
      errMsg: 'showModal:cancel',
      cancel: true,
      confirm: false
    }, this.props.success, this.props.complete, this.props.resolve);
    document.getElementById('h5-api-showModal').remove();
  }
  render() {
    return (
        <div className='modal2019'>
          <div className="top">
            {this.props.title}
          </div>
          <div className="center">
            {this.props.content}
          </div>
          <div className="bottom">
            {this.props.showCancel ? <div className='cancel' style={{color: this.props.cancelColor}} onClick={this.handleCancel.bind(this)}>{this.props.cancelText}</div> : null}
            <div className='confirm' style={{color: this.props.confirmColor}} onClick={this.handleConfirm.bind(this)}>{this.props.confirmText}</div>
          </div>
          <style ref={(node)=>{
            Object(node).textContent = `
            .modal2019 { 
              display: flex;
              flex-direction: column;
              position: fixed;
              width: 280px;
              height: 150px;
              background-color: #fff;
              margin: auto;
              left: 0;
              top: 0;
              bottom: 0;
              right: 0;
              border-radius: 5px;
            }
           .modal2019 .top {
              height: 40px;
              line-height: 40px;
              text-align: center;
            }
            .modal2019 .center {
              flex: 1;
              font-size: 15px;
              margin: 0 15px;
              color: #888;
              text-align: center;
              word-break: break-all;
              overflow: scroll;
            }
            .modal2019 .bottom {
              height: 40px;
              display: flex;
              flex-direction: row;
              border-top: solid 1px #f8f8f8;
            }
            .modal2019 .confirm {
              flex: 1;
              text-align: center;
              height: 100%;
              line-height: 40px;
            }
            .modal2019 .cancel {
              flex: 1;
              borderRight: solid 1px #f8f8f8;
              text-align: center;
              height: 100%;
              line-height: 40px;
            }`
          }}>

          </style>
        </div>
    );
  }
}

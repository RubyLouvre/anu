import { Component } from 'react-core/Component';
import { handleSuccess, handleFail } from '../../utils';

export default class Toast extends Component {
  componentDidMount() {
    handleSuccess({
      errMsg: 'showToast:ok'
    }, this.props.success, this.props.complete, this.props.resolve);
  }
  render() {
    return (
        <div>
          {
            React.appType === 'h5'?
            <dialog open className='toast2019'>
              <div className='icon'>
                  {
                  this.props.image ?
                      <img src={this.props.image} />
                      : this.props.icon
                  }
              </div>
              <div className='title'>
                  {this.props.title}
              </div>
            </dialog>
            :
            <div className='toast2019'>
              <div className='icon'>
                {
                  this.props.image ?
                    <img src={this.props.image} />
                    : this.props.icon
                }
              </div>
              <div className='title'>
                {this.props.title}
              </div>
            </div>
          }
          <style ref={(node)=>{
            var other =  `display: flex;
                          flex-direction: column;
                          position: fixed;
                          width: 120px;
                          height: 120px; 
                          background-color: rgba(0, 0, 0, 0.4);
                          margin: auto;
                          left: 0;
                          top: 0;
                          bottom: 0;
                          right: 0;
                          border-radius: 5px;`
            var h5 = `display: flex;
                      flex-direction: column;
                      align-items:center;
                      width: 120px;
                      height: 120px; 
                      background-color: rgba(0, 0, 0, 0.4);
                      text-align: center;
                      line-height:120px; 
                      border:none;
                      border-radius: 5px;`
            var context = React.appType === 'h5' ? h5: other
           Object(node).textContent =  `
             .toast2019 { 
              ${context}
            }
            .toast2019 .icon {
              width: 90px;
              height: 90px;
              margin: 0 auto;
              fill: #fff;
              color: #fff;
              text-align: center;
              font-size: 30px;
              line-height: 90px;
            }
            .toast2019 .title {
              height: 30px;
              text-align: center;
              line-height: 30px;
              color: #fff;
              overflow: hidden;
            } `
          }}>
          </style>
        </div>);
  }
}

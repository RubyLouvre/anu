import React, { Fragment } from 'react';
import { handleSuccess, handleFail } from '../../shared/utils/handleCallback';

export default class Toast extends React.Component {
  componentDidMount() {
    handleSuccess({
      errMsg: 'showToast:ok'
    }, this.props.success, this.props.complete, this.props.resolve);
  }
  render() {
    return (
      <Fragment>
        <div className='toast'>
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
        <style jsx>{`
          .toast { 
            display: flex;
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
            border-radius: 5px;
          }
          .icon {
            width: 90px;
            height: 90px;
            margin: 0 auto;
            fill: #fff;
            color: #fff;
            text-align: center;
            font-size: 30px;
            line-height: 90px;
          }
          .title {
            height: 30px;
            text-align: center;
            line-height: 30px;
            color: #fff;
            overflow: hidden;
          }
        `}</style>
      </Fragment>
      
    );
  }
}

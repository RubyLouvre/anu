import React, { Fragment } from 'react';
import { handleSuccess, handleFail } from '../../shared/utils/handleCallback';

export default class Loading extends React.Component {
  componentDidMount() {
    handleSuccess({
      errMsg: 'showLoading:ok'
    }, this.props.success, this.props.complete, this.props.resolve);
  }
  render() {
    return (
      <Fragment>
        <div className='loading'>
          <div className='icon'>
            <img style={{width: '1.5rem', height: '1.5rem'}} src='http://s.qunarzz.com/dev_test_2/loading4.gif'/>
          </div>
          <div className='title'>
            {this.props.title}
          </div>
        </div>
        <style jsx>{`
          .loading { 
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
            height: 90px;
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

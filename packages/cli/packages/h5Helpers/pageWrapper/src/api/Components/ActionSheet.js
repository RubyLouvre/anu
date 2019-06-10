import React, { Fragment } from 'react';
import { handleSuccess, handleFail } from '../../shared/utils/handleCallback';

export default class ActionSheet extends React.Component {
  handleSelect(index) {
    handleSuccess({
      index
    }, this.props.success, this.props.complete, this.props.resolve);
    document.getElementById('h5-api-showActionSheet').remove();
  }

  handleCancel() {
    handleFail({
      errMsg: 'showActionSheet:fail cancel'
    }, this.props.fail, this.props.complete, this.props.reject);
    document.getElementById('h5-api-showActionSheet').remove();
  }
  
  render() {
    return (
      <Fragment>
        <div className='actionSheet'>
          {this.props.itemList.map((item, index) => {
            return (
              <div 
                className='item'
                onClick={this.handleSelect.bind(this, index)}
                style={{
                  color: this.props.itemColor
                }}>
                {item}
              </div>
            );
          })}
          <div 
            onClick={this.handleCancel.bind(this)}
            className='cancel'>
            {this.props.cancelButtonText}
          </div>
          
        </div> 
        <style jsx>{`
          .actionSheet { 
            display: flex;
            flex-direction: column;
            position: fixed;
            width: 100%;
            background-color: #f8f8f8;
            margin: auto;
            left: 0;
            bottom: 0;
            right: 0;
          }
          .cancel {
            height: .8rem;
            line-height: .8rem;
            text-align: center;
            background-color: #fff;
            margin-top: .2rem;
          }
          .item {
            height: .8rem;
            line-height: .8rem;
            text-align: center;
            background-color: #fff;
            border-top: solid #f8f8f8 1px;
          }
        `}</style>
      </Fragment>
    );
  }
}

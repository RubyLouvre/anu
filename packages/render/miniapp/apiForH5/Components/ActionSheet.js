import { Fragment } from 'react-core/util';
import { Component } from 'react-core/Component';
import { handleSuccess, handleFail } from '../../utils';

export default class ActionSheet extends Component {
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
                <div className='actionSheet2019'>
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
                <style ref={(node) => {
                    Object(node).textContent = `
                  .actionSheet2019 { 
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
                  .actionSheet2019 .cancel {
                    height: .8rem;
                    line-height: .8rem;
                    text-align: center;
                    background-color: #fff;
                    margin-top: .2rem;
                  }
                  .actionSheet2019 .item {
                    height: .8rem;
                    line-height: .8rem;
                    text-align: center;
                    background-color: #fff;
                    border-top: solid #f8f8f8 1px;
                  }
                `}}></style>
          </div>
        );
    }
}

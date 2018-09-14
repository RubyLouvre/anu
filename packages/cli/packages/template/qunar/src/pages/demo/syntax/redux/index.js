import React from '@react';
import {createStore} from 'redux';

let reducer = function(state = {list: []}, action){
    switch (action.type){
        case 'ADD_ITEM':
            state.list.push(action.payload);
            return {
                list: [...state.list]
            };
        default: 
            return state;
    }
};

let STORE = createStore(reducer);


// eslint-disable-next-line
class P extends React.Component {
    constructor() {
        super();
        this.state = {
            list: []
        };
    }
  config = {
      backgrounColor: '#FFF',
      navigationBarBackgroundColor: '#feb64e',
      navigationBarTitleText: 'mpreact',
      navigationBarTextStyle: '#fff'
  }
  componentDidMount() {
      var _self = this;
      STORE.subscribe(function(){
          _self.setState({
              list: STORE.getState().list
          });
       
      });
  }
  add(){
      
      STORE.dispatch({
          type: 'ADD_ITEM',
          payload: {
              id: +new Date(),
              name: '张三'
          }
      });
  }
  render() {
      return (
          <div class="page">
              <div>
                  {
                      this.state.list.map(function(item){
                          return <div>{item.name} : {item.id}</div>;
                      })
                  }
              </div>
              <button onTap={this.add}>click me</button>
          </div>
      );
  }
}

export default P;

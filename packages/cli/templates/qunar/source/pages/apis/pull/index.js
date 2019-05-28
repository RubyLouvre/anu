import React from '@react';
import './index.scss';
/* eslint-disable */

// 事件
class Data extends React.Component {
  constructor() {
    super();
    this.state = {
      data: '1234455',
      copy: ''
    };
  }

  onPullDownRefresh() {
    console.log('onPullDownRefresh')
    React.api.stopPullDownRefresh()
  }

  config = {
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTextStyle: 'black',
    navigationBarTitleText: '下拉刷新',
    backgroundColor: '#eeeeee',
    backgroundTextStyle: 'light',
    enablePullDownRefresh: true
  };

  render() {
    return (
      <div class="col">
        <div class="anu-item">
          <text>页面跳转</text>
        </div>
        <div class="anu-item">
          <text>页面回退1</text>
        </div>
        <div class="anu-item">
          <text>页面回退2</text>
        </div>
        <div class="anu-item">
          <text>页面回退3</text>
        </div>
        <div class="anu-item">
          <text>页面回退4</text>
        </div>
        <div class="anu-item">
          <text>页面回退5</text>
        </div>
        <div class="anu-item">
          <text>页面回退6</text>
        </div>
        <div class="anu-item">
          <text>页面回退7</text>
        </div>
        <div class="anu-item">
          <text>页面回退8</text>
        </div>
        <div class="anu-item">
          <text>页面回退9</text>
        </div>
        <div class="anu-item">
          <text>页面回退10</text>
        </div>
        <div class="anu-item">
          <text>页面回退11</text>
        </div>
        <div class="anu-item">
          <text>页面回退12</text>
        </div>
        <div class="anu-item">
          <text>页面回退13</text>
        </div>
        <div class="anu-item">
          <text>页面回退14</text>
        </div>
        <div class="anu-item">
          <text>页面回退15</text>
        </div>
        <div class="anu-item">
          <text>页面回退16</text>
        </div>
        <div class="anu-item">
          <text>页面回退17</text>
        </div>
        <div class="anu-item">
          <text>页面回退18</text>
        </div>
        <div class="anu-item">
          <text>页面回退19</text>
        </div>
        <div class="anu-item">
          <text>页面回退20</text>
        </div>
        <div class="anu-item">
          <text>页面回退21</text>
        </div>
        <div class="anu-item">
          <text>页面回退22</text>
        </div>
        <div class="anu-item">
          <text>页面回退23</text>
        </div>
        <div class="anu-item">
          <text>页面回退24</text>
        </div>
        <div class="anu-item">
          <text>页面回退25</text>
        </div>
        <div class="anu-item">
          <text>页面回退26</text>
        </div>
        <div class="anu-item">
          <text>页面回退27</text>
        </div>
        <div class="anu-item">
          <text>页面回退28</text>
        </div>
      </div>
    );
  }
}
export default Data;

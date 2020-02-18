## QunarLoading

使用方法

```javascript
import React from '@react';
import QunarLoading from '@components/QunarLoading/index';
// 事件
class Data extends React.Component {
  constructor() {
    super();
    this.state = {
      networkData: {
        status: -3,
        loadingDesc: '加载中...',
        showButton: true
      }
    };
  }

  componentDidMount() {
    let selfState = this.state;
    let self = this;
    setTimeout(
      function() {
        selfState.networkData.status = 0;
        self.setState({ ...selfState }); //自动隐藏
      }.bind(this),
      5000
    );
  }

  render() {
    return (
      <div class="container">
        <div>加载</div>
        <QunarLoading networkData={this.state.networkData} />
      </div>
    );
  }
}
export default Data;
```

### 属性说明如下：

| 属性     | 类型     | 说明                                             |
| -------- | -------- |  ------------------------------------------------ |
| networkData   | Object    |         网络状态信息                    |
| networkRetry  | function   | 触发重新加载                      |


**networkData Object**


| 属性     | 类型   | 是否必须 |默认值| 说明                                             |
| -------- | ------|-- |  -----|------------------------------------------- |
| status   | number    |      否| 4| 网络状态码      <br> 1 toast系统默认加载中 背景白色 <br>   2 toast系统默认加载中 背景透明 <br>   3 dots加载中mini 背景透明 <br>    4 qunar大图骆驼加载中 背景白色 <br>   0 成功 <br>  -1 网络连接失败 <br> -2 没有数据 <br> -3 提示信息   |
| loadingDesc  | string  |否 | 加载中...|loading描述(可选)                     |
| showButton  | boolean  |否 | true|显示重新加载 button, 默认为true                     |

| 属性         | 类型     | 默认值|说明           |
| ------------ | -------- | ---|----------- |
| networkData  | Object   | |网络  状态信息 |
| top  | String/Number   |0|距离页面顶部的高度 |
| bottom  | String/Number   |0|距离页面底部部的高度 |
| width  | String/Number   |100%|页面宽度 |
| height  | String/Number   |auto|页面高度 |
| zIndex  | String/Number   |100| 页面的层叠顺序|
| networkRetry | function | 触发重新加载   |

**networkData Object**

| 属性        | 类型    | 是否必须 | 默认值    | 说明                                                                                                                                                                                                                          |
| ----------- | ------- | -------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| status      | number  | 否       | 4         | 网络状态码 <br> 1 toast 系统默认加载中 背景白色 <br> 2 toast 系统默认加载中 背景透明 <br> 3 dots 加载中 mini 背景透明 <br> 4 qunar 大图骆驼加载中 背景白色 <br> 0 成功 <br> -1 网络连接失败 <br> -2 没有数据 <br> -3 提示信息 |
| loadingDesc | string  | 否       | 加载中... | loading 描述(可选)                                                                                                                                                                                                            |
| showButton  | boolean | 否       | true      | 显示重新加载 button, 默认为 true

**status: -3 提示信息**

<img src="../images/loading_3.png" width="50%"/>

**status: -2 没有数据 和 status: -1 网络连接失败**

<img src="../images/loading_3.png" width="50%"/>

**status: 1 加载中 toast 系统默认 背景白色**

<img src="../images/loading-1.png" width="50%"/>

**status: 2 加载中 toast 系统默认 背景透明**

<img src="../images/loading-2.png" width="50%"/>

**status: 3 加载中 dots 加载中 mini 背景透明**

<img src="../images/loading-3.png" width="50%"/>

**status: 4 加载中 qunar 大图骆驼 背景白色**

<img src="../images/loading-4.png" width="50%"/>

## CitySelect

使用方法

```javascript
// index.js
citySelect() {
    var params = {
      type: 3, // 0:机票 1:火车票 2:汽车票 3:酒店
      cityListService: HOTEL_API.HOTEL_LIST.HOTEL_INDEX_CITY,
      citySuggestService: HOTEL_API.HOTEL_LIST.HOTEL_INDEX_SUGGEST,
      eventType: HOTEL_EVENT_NAME.CITY_SELECT,
      placeholder: "请输入城市名称或首字母"
    };

    React.api.navigateTo({
      url: '/pages/citySelector/index?data='+ JSON.stringify(params)
    });
  }

  render() {
    return (
      <div>
        <div hover-class="navigator-hover">
          <button onTap={this.citySelect}>城市列表页</button>
        </div>
      </div>
    );
  }

  // citySelect/index.js
  render() {
    return (
      <div class="container">
        <CitySelector param={this.props.query.data} />
      </div>
    );
  }
```

| 属性     | 类型     | 说明                                             |
| -------- | -------- |  ------------------------------------------------ |
| param   | Object    |         不同业务线的数据信息                    |
| 属性  | 类型          | 说明                 |
| ----- | ------------- | -------------------- |
| param | Object/String | 不同业务线的数据信息 |

| 属性               | 类型   | 是否必须 | 默认值                 | 说明                                                        |
| ------------------ | ------ | -------- | ---------------------- | ----------------------------------------------------------- |
| type               | number | 是       | 4                      | 业务线信息 <br> 0:机票 <br>1:火车票 <br>2:汽车票 <br>3:酒店 |
| cityListService    | string | 是       |                        | 请求 city list 的接口地址                                   |
| citySuggestService | string | 是       |                        | 城市搜索 suggest 接口地址                                   |
| eventType          | string | 是       |                        | 城市  选择回调名                                            |
| placeholder        | string | 否       | 请输入城市名称或首字母 | 搜索框显示信息                                              |

以上参数和微信公共组件 citySelect 用法相同

| 属性     | 类型   | 是否必须 |默认值| 说明                                             |
| -------- | ------|-- |  -----|------------------------------------------- |
| type   | number    |      是| 4| 业务线信息 <br>     0:机票 <br>1:火车票 <br>2:汽车票 <br>3:酒店 |
| cityListService  | string  |是 ||请求 city list 的接口地址                  |
| citySuggestService  | string |是 | |城市搜索suggest 接口地址                    |
| eventType  | string  |是 | | 城市选择回调名                    |
| placeholder  |string  |否 |请输入城市名称或首字母 |搜索框显示信息                     |

以上参数和微信公共组件 citySelect 用法相同

## SideBar

```javascript
import React from '@react';
import SideBar from '@components/sideBar/index';

class Data extends React.Component {
  constructor() {
    super();
    this.state = {
      showSideBar: false, // 是否弹起
      data: {
        title: '标题', // sidebar title
        tips: '描述描述描述描述描述描述', // title下方的提示,可见线上填单页房间等选择
        curIndex: 1, // 当前选中index
        data: [
          {
            // 选项list数据
            key: 'test key 1',
            value: 'test value 1'
          }
        ]
      }
    };
  }

  componentDidMount() {}

  // 选择item回调
  selectItem(index, value) {
    console.log(index, value);
  }

  showProps() {
    this.setState({
      showSideBar: true
    });
  }

  // 蒙层点击回调
  commonSideBarHidden() {
    console.log('蒙层关闭');
  }

  render() {
    return (
      <div class="container">
        <div>
          <button onClick={this.showProps}>toggle 弹窗</button>
        </div>
        <SideBar
          data={this.state.data}
          // selectEvent={this.selectItem}  // 选择item回调
          layerEvent={this.commonSideBarHidden} // 蒙层事件
          showSideBar={this.state.showSideBar} // 弹窗状态
        />
      </div>
    );
  }
}
export default Data;
```
## Calendar

使用方法

```javascript
    var params = {
        date: '2019-01-01',   // 选中的日期
        eDate: '2019-01-11',  // 双选时的第二个日期
        eventType: CONSTANTS.HOTEL_EVENT_NAME.ARRIVA_DEPARTURE_DATE_SELECT, // 回调事件名字
        isDoubleSelect: true, // 是否双选
        calendarDays: 90,     // 日历显示的天数
        sText: '入住',         // 选中的文案
        eText: '离店',         // 双选时的第二个文案
        url: encodeURIComponent('/train/product/api/train/TrainCalendar'), // 请求日历数据的url，一定要encode
        reqData: {
            bizType: 0   请求url的数据
        },
        bizType: 'train',     // 业务线
        isMultiSelect: false  // 是否多选
        dates: ['2018-10-16'],  // 已经选择的备选日期s
        maxSelectDays: 6      // 最多备选多少个
    };
    React.api.navigateTo({
        url: "/pages/calendar/index?data=" + JSON.stringify(params)
    });
```

以上参数和微信公共组件 Calendar 用法相同

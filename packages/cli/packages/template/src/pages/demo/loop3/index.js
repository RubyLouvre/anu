import React from "@react";
import "./index.less";

function randomHexColor() { //随机生成十六进制颜色
  var hex = Math.floor(Math.random() * 16777216).toString(16); //生成ffffff以内16进制数
  while (hex.length < 6) { //while循环判断hex位数，少于6位前面加0凑够6位
   hex = '0' + hex;
  }
  return '#' + hex; //返回‘#'开头16进制颜色
 }

class P extends React.Component {
  constructor() {
    super();
    this.state = {
      array1: [
        {
          name: "动物1"
        },
        {
          name: "动物2"
        },
        {
          name: "动物3"
        }
      ],
      array2: [
        {
          name: "猫1"
        },
        {
          name: "狗2"
        },
        {
          name: "兔3"
        }
      ],
      array3: [
        {
          name: "小猫1"
        },
        {
          name: "小狗2"
        },
        {
          name: "小兔子3"  
        }
      ]
    };
  }
  changeNumbers() {
    console.log("change");
    this.setState({
      array: [
        {
          name: "狗1"
        },
        {
          name: "狗3"
        },
        {
          name: "狗4"
        },
        {
          name: "狗5"
        }
      ]
    });
  }
  render() {
    return (
      <div onTap={this.changeNumbers.bind(this)} class="loop3-container">
        {this.state.array1.map(function(el) {
          return (
            <div key={el.name}>
              <div class="index-item-1" style={{'backgroundColor': randomHexColor()}}>{el.name}</div>
              {this.state.array2.map(function(item) {
                return (
                  <div key={item.name}>
                    <div class="index-item-2" style={{'backgroundColor': randomHexColor()}}>
                      {item.name}
                      =======
                    </div>
                    {this.state.array3.map(function(key) {
                      return <div key={key.name} class="index-item-3" style={{'backgroundColor': randomHexColor()}}>{key.name}</div>;
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

export default P;

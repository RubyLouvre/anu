import React, { Fragment } from 'react';

export default function(props) {
  if (props.error) {
    console.log(props.error);
    return (
      <Fragment>
        <div>网络好像不太给力，刷新试试？</div>
        <style ref={(node) => {
            Object(node).textContent = `
              div {
                font-size: 14px;
                text-align: center;
                color: #666;
                padding: 24px 0;
              }`;
        }}/>
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <div>正在努力加载...</div>
        <style ref={(node) => {
            Object(node).textContent = `
            div {
              font-size: 14px;
              text-align: center;
              color: #666;
              padding: 24px 0;
            }`;
        }}/>
      </Fragment>
    );
  }
}

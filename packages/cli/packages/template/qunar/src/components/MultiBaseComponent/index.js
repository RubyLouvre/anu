import React from '@react';

class MultiBaseComponent extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
    /* eslint-disable */
    console.log('MultiBaseComponent did mount!');
  }
  render() {
    return <div class="multi-base-component">最内层组件</div>;
  }
}

export default MultiBaseComponent;

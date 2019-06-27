/* eslint-disable */
import React from '@react';
// import parseHtmlFromStr from '@shared/utils/parseHtmlFromStr';
// import parseNodes from '@shared/utils/parseNodes';

class RichText extends React.Component {
  _richDom = null;

  componentDidMount() {
    const { nodes: propNodes } = this.props;
    // const nodes =
    //   typeof propNodes === 'string'
    //     ? parseHtmlFromStr(propNodes)
    //     : propNodes || [];
    // const nodeList = parseNodes(nodes, document.createDocumentFragment());

    this._richDom.innerHTML = '';
    // this._richDom.appendChild(nodeList);
  }

  render() {
    return <div ref={dom => (this._richDom = dom)} />;
  }
}

export default RichText;

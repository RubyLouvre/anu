import React from '@react';
import './index.scss';

class P extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: '<div><h1>h1文本</h1><h2>h2文本</h2><h3>h3文本</h3><h4>h4文本</h4><h5>h5文本</h5><h6>h6文本</h6><i>标签:i</i><a href="https://www.qunar.com">标签:a</a><div><code>let a=1;console.log(a)</code></div><div>多层嵌套<dl><dt>dl>dt</dt><dd>dl>dd1</dd><dd>dl>dd2</dd><dd>dl>dd3</dd></dl><ul><li>ul>li1</li><li>ul>li2</li><li>ul>li3</li><li><em>ul>li>标签:em</em></li><li><b>ul>li>标签:b</b></li></ul><ol><li>ol>li1</li><li>ol>li2</li><li>ol>li3</li><li><strong>ol>li>strong</strong></li><li><sub>sub</sub><span>span</span><sup>sup</sup></li><li><blockquote>ol>li>blockquote</blockquote><li></ol></div></div>'
        };
    }
    render() {
        return (
            <view>
                <rich-text nodes={this.state.nodes} />
            </view>
        );
    }
}

export default P;

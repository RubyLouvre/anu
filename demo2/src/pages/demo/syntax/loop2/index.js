import React from '@react';
import Fish from '@components/Fish/index';

import './index.less';
class P extends React.Component {
    constructor() {
        super();
        this.state = {
            title: '',
            key: '',
            trs: [
                [{ title: 'aaa' }, { title: 'bbb' }, { title: 'ccc' }],
                [{ title: 'ddd' }, { title: 'eee' }, { title: 'fff' }],
                [{ title: 'ggg' }, { title: 'hhh' }, { title: 'iii' }],
            ],
        };
    }
    getData(item, e) {
        this.setState({
            title: item.title,
            key: e.target.dataset.key,
        });
    }

    render() {
        return (
            <div>
                <div>测试循环中的事件，点击下方格子</div>
                <div>
					title:
                    {this.state.title}
                    {'  key '}
                    {this.state.key}
                </div>
                <div class="grid-wrap">
                    {this.state.trs.map(function(item) {
                        return (
                            <div>
                                {item.map(function(el) {
                                    return (
                                        <div class="grid" onClick={this.getData.bind(this, el)}>
                                            <Fish content={el.title} />
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default P;

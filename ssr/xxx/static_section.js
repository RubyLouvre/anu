import 'babel-polyfill';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Page from '../../../common/page';
import { Scroller, List, Touchable, Toast } from '$yo-component';
import './index.scss';

function getRandomColors(num) {
    var _color = [];
    for (var j = 0; j < num; j++) {
        var letters = '3456789ABC'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 10)];
        }
        _color.push(color);
    }

    return _color;
}

function getArrayByLength(length) {
    const ret = [];
    for (let i = 0; i < length; i++) {
        ret[i] = null;
    }
    return ret;
}

function getRandomList(size) {
    return getArrayByLength(size).fill(1).map(num => parseInt(Math.random() * 100));
}

let guid = -1;
function getRandomDataSource(size) {
    return getRandomList(size).map(num => ({ text: num, key: ++guid }));
}


class Demo extends Component {

    constructor() {
        super();
        this.state = {
            dataSource: getRandomDataSource(25),
            x: 0
        };
    }

    getContent() {
        return [1, 2, 3, 4, 5].map((item) => {
            return <div className="item" style={{ background: 'green' }} key={item}>{item}</div>;
        });
    }

    getGroup(i) {
        return (
            <div key={i} className="demo-group">
                <Scroller.Sticky>
                    <div style={{ height: 50, lineHeight: 50 + 'px' }} className="sticky-title">
                        <span>{'Sticky Header ' + i}</span>
                    </div>
                </Scroller.Sticky>
                {this.getContent()}
            </div>
        );
    }

    refresh() {
        this.setState({ dataSource: getRandomDataSource(25) });
    }

    fetch() {
        this.setState({ dataSource: this.state.dataSource.concat(getRandomDataSource(15)) });
    }

    render() {
        return (
            <Page title="List: Static Section" onLeftPress={() => location.href = "./index.html"}>
                <List
                    directionLockThreshold={3}
                    // 新增属性staticSection，可以在list顶部渲染一个静态区域
                    staticSection={
                        <div className="demo-static-header">
                            {[0, 1, 2].map(num => this.getGroup(num))}
                            <Scroller.Sticky>
                                <div>
                                    <div style={{ height: 50, lineHeight: 50 + 'px' }} className="sticky-title">
                                        <span>{'Sticky Header For List'}</span>
                                    </div>
                                    <Scroller
                                        style={{ height: 50, width: '100%', background: 'white' }}
                                        scrollX={true}
                                        scrollY={false}
                                        contentOffset={{ x: this.state.x || 0, y: 0 }}
                                        // 这里很重要，因为吸顶的节点实际上是原来节点的克隆
                                        // 因此在改变吸顶的横向滚动容器的x时，需要同步原来元素的x
                                        onScrollEnd={(evt) => {
                                            const x = evt.contentOffset.x;
                                            this.setState({ x });
                                        }}
                                        containerExtraStyle={{ width: 600 }}
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7].map(num => (
                                            <span key={num} className="scroller-item">{num}</span>
                                        ))}
                                    </Scroller>
                                </div>
                            </Scroller.Sticky>
                        </div>
                    }
                    ref="list"
                    extraClass="yo-scroller-fullscreen"
                    dataSource={this.state.dataSource}
                    renderItem={(item, i) => <div>{i + ':' + item.text}</div>}
                    infiniteSize={40}
                    itemHeight={44}
                    infinite={true}
                    useLoadMore={true}
                    onLoad={() => {
                        setTimeout(() => {
                            this.fetch();
                            this.refs.list.stopLoading(true);
                        }, 500);
                    }}
                    onItemTap={(item, i) => {
                        Toast.show('item' + i + ' clicked.', 2000);
                    }}
                />
            </Page>
        );
    }
}

ReactDOM.render(<Demo />, document.getElementById('content'));
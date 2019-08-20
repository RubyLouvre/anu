import React, { Component } from 'react';
import './index.scss';

class TabBar extends Component {
    get borderStyle() {
        return this.props.borderStyle === 'black' ? '#ccc' : '#eee';
    }
    onSelected(item) {
        const { pagePath } = item;
        this.props.onChange && this.props.onChange(item);
        React.api.switchTab({
            url: '/' + pagePath
        });
    }
    render() {
        return <React.Fragment>
            <main className="__internal__TabBar" style={{
                backgroundColor: this.props.backgroundColor,
                borderTop: `1px solid ${this.borderStyle}`
            }}>
                { this.props.list.map((item, index) => <div className="__internal__TabBarItem" onClick={ this.onSelected.bind(this, {index, ...item})}>
                    <div>
                        <img src={ item.selected ? item.selectedIconPath : item.iconPath } />
                    </div>
                    <span className='__internal__TabBarItem-title' style={{
                        color: item.selected ? item.selectedColor: item.color,
                    }}>
                        {item.text}
                    </span>
                </div>)
                }
            </main>
        </React.Fragment>;
    }
}

export default TabBar;

import React, { Component } from 'react';

class TabBar extends Component {
    get borderStyle() {
        return this.props.borderStyle === 'black' ? '#ccc' : '#eee';
    }
    onSelected({pagePath} = {}) {
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
                { this.props.list.map(item => <div className="__internal__TabBarItem" onClick={ this.onSelected.bind(this,item)}>
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
            <style ref={(node) => {
                Object(node).textContent = `
                .__internal__TabBar {
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    height: 60px;
                    display: flex;
                    justify-content: space-around;
                    border-top: 1px solid ${this.borderStyle};
                    background-color: ${this.backgroundColor};
                }
                .__internal__TabBarItem {
                    text-align: center;
                    height: 32px;
                    flex-grow: 1;
                }
                img {
                    width: 32px;
                }
                .__internal__TabBarItem-title {
                    height: 20px;
                    font-size: 14px;
                    justify-content: center;
                }`;
            }}/>
        </React.Fragment>;
    }
}

export default TabBar;

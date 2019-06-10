import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import TabBarItem from './TabBarItem';
import { computed } from 'mobx';

@observer
class TabBar extends Component {
  @computed
  get borderStyle() {
    return this.props.borderStyle === 'black' ? '#ccc' : '#eee';
  }

  @computed
  get backgroundColor() {
    return this.props.backgroundColor;
  }

  render() {
    return (
      <Fragment>
        <div className="__internal__TabBar">
          {this.props.tabBarItems.map(item => (
            <TabBarItem item={item} key={item.pagePath} />
          ))}
        </div>

        <style jsx>
          {`
            .__internal__TabBar {
              position: fixed;
              bottom: 0;
              width: 100%;
              max-width: 480px;
              height: 60px;
              display: flex;
              justify-content: space-around;
              border-top: 1px solid ${this.borderStyle};
              background-color: ${this.backgroundColor};
            }
          `}
        </style>
      </Fragment>
    );
  }
}

export default TabBar;

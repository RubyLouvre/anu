import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Page from '../Page';
import TabBar from './TabBar';

@observer
class TabPage extends Component {
  render() {
    const {
      tabPage: { pages, tabBarItems, ...tabBarProps }
    } = this.props;
    console.log(tabBarItems.length)

    return (
      <div>
        <div className="__internal_TabPage">
          {pages.map((page, index) => (
            <Page key={`Index: ${index} url: ${page.url}`} page={page} isTabPage={true} />
          ))}
        </div>
        {tabBarItems.length ? <TabBar tabBarItems={tabBarItems} {...tabBarProps} /> : null}

        <style jsx>{`
          .__internal_TabPage {
            z-index: 10;
            overflow: hidden;
            height: 100%;
          }
        `}</style>
      </div>
    );
  }
}

export default TabPage;

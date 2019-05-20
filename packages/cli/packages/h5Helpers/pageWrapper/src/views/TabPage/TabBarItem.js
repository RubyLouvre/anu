import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';

@observer
class TabBarItem extends Component {
  constructor() {
    super();
    this.onItemClick = this.onItemClick.bind(this);
  }

  @computed
  get pagePath() {
    return this.item.pagePath;
  }

  @computed
  get item() {
    return this.props.item;
  }

  @computed
  get setCurrentPagePath() {
    return this.item.setCurrentPagePath;
  }

  @computed
  get iconPath() {
    return this.item.selected ? this.item.selectedIconPath : this.item.iconPath;
  }

  onItemClick() {
    this.setCurrentPagePath(this.pagePath);
  }

  render() {
    const { textColor } = this.item;

    return (
      <Fragment>
        <div className="__internal__TabBarItem" onClick={this.onItemClick}>
          <div>
            <img src={this.iconPath} />
          </div>
          <div className="__internal__TabBarItem-title">{this.item.text}</div>
        </div>

        <style jsx>
          {`
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
              color: ${textColor};
              justify-content: center;
            }
          `}
        </style>
      </Fragment>
    );
  }
}

export default TabBarItem;

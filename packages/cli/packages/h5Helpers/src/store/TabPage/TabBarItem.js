import { observable, action, computed } from 'mobx';

class TabBarItem {
  @observable color;
  @observable text;
  @observable selectedColor;
  @observable selectedIconPath;
  @observable iconPath;
  @observable pagePath;
  @observable setCurrentPagePath;
  @observable selected = false;

  constructor({
    color,
    text,
    selectedColor,
    selectedIconPath,
    iconPath,
    pagePath,
    setCurrentPagePath
  }) {
    this.color = color;
    this.text = text;
    this.selectedColor = selectedColor;
    this.selectedIconPath = selectedIconPath;
    this.iconPath = iconPath;
    this.pagePath = pagePath;
    this.setCurrentPagePath = setCurrentPagePath;
  }

  @action.bound
  check() {
    this.selected = true;
  }

  @action.bound
  unCheck() {
    this.selected = false;
  }

  @computed
  get textColor() {
    return this.selected ? this.selectedColor : this.color;
  }
}

export default TabBarItem;

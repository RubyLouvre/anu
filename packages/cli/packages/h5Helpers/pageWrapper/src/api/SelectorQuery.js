const SelectorQuery = function() {
  const pages = document.getElementsByClassName('page-wrapper');
  this.__page = pages[pages.length - 1];
  this.__node = null;
  this.__consumed = false;
  this.__missions = [];
};

SelectorQuery.prototype.select = function(selector) {
  this.__node = this.__page.querySelector(selector);
  this.__consumed = false;
  return this;
};

SelectorQuery.prototype.selectAll = function(selector) {
  this.__node = this.__page.querySelectorAll(selector);
  this.__consumed = false;
  return this;
};

SelectorQuery.prototype.selectViewport = function() {
  this.__node = this.__page;
  this.__consumed = false;
  return this;
};

SelectorQuery.prototype.boundingClientRect = function() {
  if (!this.__consumed) {
    if (!this.__node) {
      this.__missions.push(null);
    } else {
      if (this.__node instanceof NodeList) {
        this.__missions.push(Array.from(this.__node).map(__node => {
          return __node.getBoundingClientRect();
        }));
      } else {
        this.__missions.push(this.__node.getBoundingClientRect());
      }
    }
  }
  this.__consumed = true;
  return this;
};

SelectorQuery.prototype.scrollOffset = function() {
  if (!this.__consumed) {
    if (!this.__node) {
      this.__missions.push(null);
    } else {
      if (this.__node instanceof NodeList) {
        this.__missions.push(Array.from(this.__node).map(__node => {
          return {
            scrollLeft: __node.scrollLeft,
            scrollTop: __node.scrollTop
          };
        }));
      } else {
        this.__missions.push({
          scrollLeft: this.__node.scrollLeft,
          scrollTop: this.__node.scrollTop
        });
      }
    }
  }
  this.__consumed = true;
  return this;
};

SelectorQuery.prototype.exec = function(callback) {
  callback(this.__missions);
  this.__consumed = true;
  this.__missions = [];
  return this;
};

function createSelectorQuery() {
  return new SelectorQuery();
}

export default {
  createSelectorQuery
};
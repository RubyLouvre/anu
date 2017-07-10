
import { document, win } from "./browser";
//innerMap_start
var innerMap = win.Map;

try {
  var testNode = document.createComment("");
  var map = new innerMap(),
    value = "anujs";
  map.set(testNode, value);
  if (map.get(testNode) !== value) {
    throw "使用自定义Map";
  }
} catch (e) {
  var uniqueID = 1;
  innerMap = function() {
    this.map = {};
  };
  function getID(a) {
    if (a.uniqueID) {
      return "Node" + a.uniqueID;
    } else {
      a.uniqueID = "_" + uniqueID++;
      return "Node" + a.uniqueID;
    }
  }
  innerMap.prototype = {
    get: function(a) {
      var id = getID(a);
      return this.map[id];
    },
    set: function(a, v) {
      var id = getID(a);
      this.map[id] = v;
    },
    delete: function(a) {
      var id = getID(a);
      delete this.map[id];
    }
  };
}
//innerMap_end
export var instanceMap = new innerMap();

import {
  beforeHook,
  afterHook,
  browser
} from "karma-event-driver-ext/cjs/event-driver-hooks";
import React from "dist/React";
//import {Redux} from 'redux'
var Redux = require("redux");
var ReactRedux = require("react-redux");

describe("Redux", function() {
  this.timeout(200000);
  before(async () => {
    await beforeHook();
  });
  after(async () => {
    await afterHook(false);
  });
  var body = document.body,
    div;
  beforeEach(function() {
    div = document.createElement("div");
    body.appendChild(div);
  });
  afterEach(function() {
    body.removeChild(div);
  });
  it("Counter", async () => {
    class Counter extends React.Component {
      render() {
        return (
          <div>
            <h1 ref="value">{this.props.value}</h1>
            <button ref="a" onClick={this.props.onIncrement}>
              +
            </button>&nbsp;
            <button ref="b" onClick={this.props.onDecrement}>
              -
            </button>
          </div>
        );
      }
    }

    const reducer = (state = 0, action) => {
      switch (action.type) {
        case "INCREMENT":
          return state + 1;
        case "DECREMENT":
          return state - 1;
        default:
          return state;
      }
    };

    const store = Redux.createStore(reducer);
    function onIncrement() {
      store.dispatch({ type: "INCREMENT" });
    }
    function onDecrement() {
      store.dispatch({ type: "DECREMENT" });
    }

    const render = () => {
      return ReactDOM.render(
        <Counter
          value={store.getState()}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
        />,
        div
      );
    };

    var s = render();
    store.subscribe(render);
    await browser.pause(100).$apply();
    expect(s.refs.value.innerHTML).toBe("0");
    expect(s.refs.a.tagName).toBe("BUTTON");
    await browser
      .click(s.refs.a)
      .pause(100)
      .$apply();
    expect(s.refs.value.innerHTML).toBe("1");
    await browser
      .click(s.refs.a)
      .pause(100)
      .$apply();
    expect(s.refs.value.innerHTML).toBe("2");
    await browser
      .click(s.refs.b)
      .pause(100)
      .$apply();
    expect(s.refs.value.innerHTML).toBe("1");
  });
  it("TreeView", async () => {
    return
    var idArr = ["tree1", "tree2", "tree3", "tree4", "tree5", "tree6", "tree7"];
    var combineReducers = Redux.combineReducers;
    var Provider = ReactRedux.Provider;
    var connect = ReactRedux.connect;
    var createStore = Redux.createStore;
    function generateTree() {
      let tree = {
        0: {
          id: 0,
          counter: 0,
          childIds: []
        }
      };

      for (let i = 1; i < 3; i++) {
        let parentId = 0; //Math.floor(Math.pow(Math.random(), 2) * i)
        tree[i] = {
          id: i,
          counter: 0,
          childIds: []
        };
        tree[parentId].childIds.push(i);
      }

      return tree;
    }
    const INCREMENT = "INCREMENT";
    const CREATE_NODE = "CREATE_NODE";
    const DELETE_NODE = "DELETE_NODE";
    const ADD_CHILD = "ADD_CHILD";
    const REMOVE_CHILD = "REMOVE_CHILD";

    const increment = nodeId => ({
      type: INCREMENT,
      nodeId
    });

    let nextId = 0;
    const createNode = () => ({
      type: CREATE_NODE,
      nodeId: `new_${nextId++}`
    });

    const deleteNode = nodeId => ({
      type: DELETE_NODE,
      nodeId
    });

    const addChild = (nodeId, childId) => ({
      type: ADD_CHILD,
      nodeId,
      childId
    });

    const removeChild = (nodeId, childId) => ({
      type: REMOVE_CHILD,
      nodeId,
      childId
    });
    var actions = {
      increment,
      createNode,
      deleteNode,
      addChild,
      removeChild
    };
    class Node extends React.Component {
      constructor(props) {
        super(props);
        this.handleIncrementClick = this.handleIncrementClick.bind(this);
        this.handleAddChildClick = this.handleAddChildClick.bind(this);
        this.handleRemoveClick = this.handleRemoveClick.bind(this);
        this.renderChild = this.renderChild.bind(this);
      }
      handleIncrementClick() {
        const { increment, id } = this.props;
        increment(id);
      }

      handleAddChildClick(e) {
        e.preventDefault();

        const { addChild, createNode, id } = this.props;
        const childId = createNode().nodeId;
        addChild(id, childId);
      }

      handleRemoveClick(e) {
        e.preventDefault();

        const { removeChild, deleteNode, parentId, id } = this.props;
        removeChild(parentId, id);
        deleteNode(id);
      }

      renderChild(childId) {
        const { id } = this.props;
        return (
          <li key={childId}>
            <ConnectedNode id={childId} parentId={id} />
          </li>
        );
      }

      render() {
        const { counter, parentId, childIds } = this.props;
        return (
          <div>
            Counter: {counter}{" "}
            <button onClick={this.handleIncrementClick}>+</button>{" "}
            {typeof parentId !== "undefined" && (
              <a
                href="#"
                id={idArr.shift()}
                onClick={this.handleRemoveClick}
                className="remove"
                style={{ color: "lightgray", textDecoration: "none" }}
              >
                ×
              </a>
            )}
            <ul>
              {childIds.map(this.renderChild)}
              <li key="add">
                <a
                  href="#"
                  id={idArr.shift()}
                  onClick={this.handleAddChildClick}
                  className="add"
                >
                  Add child
                </a>
              </li>
            </ul>
          </div>
        );
      }
    }

    function mapStateToProps(state, ownProps) {
      return state[ownProps.id];
    }

    const ConnectedNode = connect(mapStateToProps, actions)(Node);

    //import { INCREMENT, ADD_CHILD, REMOVE_CHILD, CREATE_NODE, DELETE_NODE } from '../actions'

    const childIds = (state, action) => {
      switch (action.type) {
        case ADD_CHILD:
          return [...state, action.childId];
        case REMOVE_CHILD:
          return state.filter(id => id !== action.childId);
        default:
          return state;
      }
    };

    const node = (state, action) => {
      switch (action.type) {
        case CREATE_NODE:
          return {
            id: action.nodeId,
            counter: 0,
            childIds: []
          };
        case INCREMENT:
          return {
            ...state,
            counter: state.counter + 1
          };
        case ADD_CHILD:
        case REMOVE_CHILD:
          return {
            ...state,
            childIds: childIds(state.childIds, action)
          };
        default:
          return state;
      }
    };

    const getAllDescendantIds = (state, nodeId) =>
      state[nodeId].childIds.reduce(
        (acc, childId) => [
          ...acc,
          childId,
          ...getAllDescendantIds(state, childId)
        ],
        []
      );

    const deleteMany = (state, ids) => {
      state = { ...state };
      ids.forEach(id => delete state[id]);
      return state;
    };

    function reducers(state = {}, action) {
      const { nodeId } = action;
      if (typeof nodeId === "undefined") {
        return state;
      }

      if (action.type === DELETE_NODE) {
        const descendantIds = getAllDescendantIds(state, nodeId);
        return deleteMany(state, [nodeId, ...descendantIds]);
      }

      return {
        ...state,
        [nodeId]: node(state[nodeId], action)
      };
    }

    const tree = generateTree();

    const store = createStore(reducers, tree);
    var s = ReactDOM.render(
      <Provider store={store}>
        <ConnectedNode id={0} />
      </Provider>,
      div
    );
    await browser.pause(100).$apply();
    var ass = div.getElementsByTagName("a");
    expect(ass.length).toBe(5);
    var el = ass[1];

    await browser
      .click(el)
      .pause(200)
      .$apply();

    expect(ass.length).toBe(el.className === "add" ? 7 : 5);
    await browser
      .click(ass[4])
      .pause(100)
      .$apply();

    expect(ass.length).toBe(5);
  });
});

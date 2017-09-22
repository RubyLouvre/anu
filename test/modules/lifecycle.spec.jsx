import {
  beforeHook,
  afterHook,
  browser
} from "karma-event-driver-ext/cjs/event-driver-hooks";
import React from "dist/React";
import { SyntheticEvent, addEvent } from "src/event";
import { DOMElement } from "src/browser";

describe("生命周期例子", function() {
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
  it("如果在componentDidMount中调用setState方法\n那么setState的所有回调，\n都会延迟到componentDidUpdate中执行", async () => {
    var list = [];
    class App extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          aaa: "aaa"
        };
      }
      componentWillMount() {
        this.setState(
          {
            aaa: "bbb"
          },
          function() {
            list.push("1111");
          }
        );
      }
      componentDidMount() {
        this.setState(
          {
            aaa: "cccc"
          },
          function() {
            list.push("2222");
          }
        );
        this.setState(
          {
            aaa: "dddd"
          },
          function() {
            list.push("3333");
          }
        );
        list.push("did mount");
      }

      componentWillUpdate() {
        list.push("will update");
      }
      componentDidUpdate() {
        list.push("did update");
      }
      render() {
        list.push(this.state.aaa);
        return <div>{this.state.aaa}</div>;
      }
    }

    var s = ReactDOM.render(<App />, div);
    await browser.pause(300).$apply();
    expect(list.join("-")).toBe(
      "bbb-did mount-will update-dddd-did update-1111-2222-3333"
    );
  });
  it("父组件没有DidMount之时被子组件在willMount钩子里调用其setState", async () => {
    var list = [];
    class App extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          aaa: "app render"
        };
      }
      componentWillMount() {
        list.push("app will mount");
      }
      componentDidMount() {
        list.push("app did mount");
      }

      componentWillUpdate() {
        list.push("app will update");
      }
      componentDidUpdate() {
        list.push("app did update");
      }
      render() {
        list.push(this.state.aaa);
        return (
          <div>
            <A parent={this} />
            {this.state.aaa}
          </div>
        );
      }
    }
    class A extends React.Component {
      componentWillMount() {
        this.props.parent.setState({
          aaa: "app new render"
        });
        this.props.parent.setState({
          aaa: "app new render2"
        });
      }
      componentWillReceiveProps() {
        list.push("child receive");
      }
      render() {
        return <p>A</p>;
      }
    }
    var s = ReactDOM.render(<App />, div);
    await browser.pause(300).$apply();
    expect(list.join("-")).toBe(
      "app will mount-app render-app did mount-app will update-app new render2-child receive-app did update"
    );
  });

  it("父组件DidMount之时被子组件在componentWillReceiveProps钩子里调用其setState\n父组件的再次render会待到这次render完才调起", async () => {
    var list = [];
    class App extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          aaa: "app render"
        };
      }
      componentWillMount() {
        list.push("app will mount");
      }
      componentDidMount() {
        this.setState({
          aaa: "app render1"
        });
        list.push("app did mount");
      }
      componentDidUpdate() {
        list.push("app did update");
      }
      render() {
        list.push(this.state.aaa);
        return (
          <div>
            <A parent={this} />
            {this.state.aaa}
            <C />
          </div>
        );
      }
    }
    var a = 1;
    class C extends React.Component {
      render() {
        list.push("C render");
        return <p>C</p>;
      }
    }
    class A extends React.Component {
      componentWillReceiveProps() {
        if (a < 2) {
          this.props.parent.setState(
            {
              aaa: "child call app render " + ++a
            },
            function() {
              list.push("componentWillReceiveProps 1");
            }
          );
          this.props.parent.setState(
            {
              aaa: "child call app render " + ++a
            },
            function() {
              list.push("componentWillReceiveProps 2");
            }
          );
        }
      }
      componentWillUpdate() {
        list.push("child will update");
      }
      render() {
        list.push("child render");
        return <p>A</p>;
      }
    }
    React.render(<App />, div);
    await browser.pause(200).$apply();

    var list2 = [
      "app will mount",
      "app render",
      "child render",
      "C render",
      "app did mount",
      "app render1",
      "child will update",
      "child render",
      "C render",
      "app did update",
      "child call app render 3",
      "child will update",
      "child render",
      "C render",
      "app did update",
      "componentWillReceiveProps 1",
      "componentWillReceiveProps 2"
    ];
    expect(list.join("-")).toBe(list2.join("-"));
  });

  it("第一次渲染时不会触发componentWillUpdate", async () => {
    var a = 1;
    class ReceivePropsComponent extends React.Component {
      componentWillUpdate() {
        a = 2;
      }
      render() {
        return <div />;
      }
    }

    React.render(<ReceivePropsComponent />, div);
    await browser.pause(200).$apply();
    expect(a).toBe(1);
  });

  it("先执行子组件的mount钩子再到父组件的mount钩子", async () => {
    let log = [];

    class Inner extends React.Component {
      componentDidMount() {
        log.push("inner");
      }

      render() {
        return <div id="inner" />;
      }
    }

    class Outer extends React.Component {
      componentDidMount() {
        log.push("outer");
      }

      render(props) {
        return <Inner />;
      }
    }

    React.render(<Outer />, div);
    await browser.pause(200).$apply();
    expect(log.join("-")).toBe("inner-outer");
  });
  it("在componentWillMount中使用setState", async () => {
    var list = [];
    class App extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          aaa: 111
        };
      }
      componentWillMount() {
        this.setState(
          {
            aaa: 222
          },
          function() {
            list.push("555");
          }
        );
        this.setState(
          {
            aaa: 333
          },
          function() {
            list.push("666");
          }
        );
      }
      render() {
        list.push(this.state.aaa);
        return <p>{this.state.aaa}</p>;
      }
    }

    var s = React.render(<App />, div);
    await browser.pause(200).$apply();
    expect(list.join("-")).toBe("333-555-666");
    expect(div.textContent || div.innerText).toBe("333");
  });
  it("在componentWillMount中使用setState", async () => {
    var list = [];
    class App extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          aaa: 111
        };
      }
      componentWillMount() {
        this.setState(
          {
            aaa: 222
          },
          function() {
            list.push("555");
          }
        );
        this.setState(
          {
            aaa: 333
          },
          function() {
            list.push("666");
          }
        );
      }
      render() {
        list.push(this.state.aaa);
        return <p>{this.state.aaa}</p>;
      }
    }

    var s = React.render(<App />, div);
    await browser.pause(200).$apply();
    expect(list.join("-")).toBe("333-555-666");
    expect(div.textContent || div.innerText).toBe("333");
  });
  it("在componentDidMount中使用setState，会导致willMount, DidMout中的回调都延后", async () => {
    var list = [];
    class App extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          aaa: 111
        };
      }

      componentWillMount() {
        this.setState(
          {
            aaa: 222
          },
          function() {
            list.push("555");
          }
        );
        this.setState(
          {
            aaa: 333
          },
          function() {
            list.push("666");
          }
        );
      }
      componentDidMount() {
        this.setState(
          {
            aaa: 444
          },
          function() {
            list.push("777");
          }
        );
      }

      render() {
        list.push(this.state.aaa);
        return <p>{this.state.aaa}</p>;
      }
    }

    var s = React.render(<App />, div);
    await browser.pause(200).$apply();
    expect(list.join("-")).toBe("333-444-555-666-777");
    expect(div.textContent || div.innerText).toBe("444");
  });
  
  it("ReactDOM的回调总在最后", async () => {
    var list = [];
    class App extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          path: "111"
        };
      }
      componentWillMount() {
        this.setState(
          {
            path: "222"
          },
          function() {
            list.push("componentWillMount cb");
          }
        );
        this.setState(
          {
            path: "2222"
          },
          function() {
            list.push("componentWillMount cb2");
          }
        );
      }
      render() {
        list.push("render " + this.state.path);
        return (
          <div>
            <span>
              {this.state.path}
              <Child parent={this} />
            </span>
          </div>
        );
      }
      componentDidMount() {
        this.setState(
          {
            path: "eeee"
          },
          function() {
            list.push("componentDidMount cb");
          }
        );
      }
      componentWillUpdate() {
        list.push("will update");
      }
      componentDidUpdate() {
        list.push("did update");
      }
    }
    class Child extends React.Component {
      componentWillMount() {
        this.props.parent.setState(
          {
            path: "child"
          },
          function() {
            list.push("child setState");
          }
        );
      }
      render() {
        list.push("child render");
        return <p>33333</p>;
      }
    }
    ReactDOM.render(<App />, div, function() {
      list.push("ReactDOM cb");
    });

    expect(list).toEqual([
      "render 2222",
      "child render",
      "will update",
      "render eeee",
      "child render",
      "did update",
      "componentWillMount cb",
      "componentWillMount cb2",
      "child setState",
      "componentDidMount cb",
      "ReactDOM cb"
    ]);
  });

  it("should update state when called from child cWRP", async () => {
    const log = [];
    class Parent extends React.Component {
      constructor() {
        super(),
          (this.state = {
            value: "one"
          });
      }
      render() {
        log.push("parent render " + this.state.value);
        return <Child parent={this} value={this.state.value} />;
      }
    }
    let updated = false;
    class Child extends React.Component {
      componentWillReceiveProps() {
        if (updated) {
          return;
        }
        log.push("child componentWillReceiveProps " + this.props.value);
        this.props.parent.setState({ value: "two" });
        log.push("child componentWillReceiveProps done " + this.props.value);
        updated = true;
      }
      render() {
        log.push("child render " + this.props.value);
        return <div>{this.props.value}</div>;
      }
    }
    var container = document.createElement("div");
    React.render(<Parent />, container);

    React.render(<Parent />, container);

    expect(log).toEqual([
      "parent render one",
      "child render one",
      "parent render one",
      "child componentWillReceiveProps one",
      "child componentWillReceiveProps done one",
      "child render one",
      "parent render two",
      "child render two"
    ]);
  });

  it("在componentWillUnmount中setState应该不起作用", async () => {
    class Issue extends React.PureComponent {
      constructor(props) {
        super(props);
        this.state = {
          status: "normal"
        };
      }

      componentWillUnmount() {
        this.setState({ status: "unmount" });
      }

      render() {
        const { status } = this.state;

        if (status === "unmount") {
          throw new Error("Issue unmounted");
        }

        return <span>Issue status: {status}</span>;
      }
    }

    class App extends React.PureComponent {
      constructor(props) {
        super(props);
        this.state = {
          showIssue: true
        };
      }

      render() {
        const { showIssue } = this.state;

        return (
          <div>
            {showIssue && <Issue />}
            <button
              type="button"
              ref="button"
              onClick={() => this.setState({ showIssue: !showIssue })}
            >
              Click
            </button>
          </div>
        );
      }
    }
    var s = React.render(<App />, div);
    await browser.pause(200).$apply();
    expect(div.getElementsByTagName("span").length).toBe(1);
    await browser
      .click(s.refs.button)
      .pause(100)
      .$apply();
    expect(div.getElementsByTagName("span").length).toBe(0);
  });

  it("forceUpdate在componentDidMount中使用", async () => {
    var list = [];
    class App extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          aaa: "aaa"
        };
      }
      componentWillMount() {
        this.setState(
          {
            aaa: "bbb"
          },
          function() {
            list.push("1111");
          }
        );
      }
      componentDidMount() {
        this.state.aaa = "cccc";
        this.forceUpdate(function() {
          list.push("2222");
        });
        this.state.aaa = "dddd";
        this.forceUpdate(function() {
          list.push("3333");
        });
        list.push("did mount");
      }
      componentWillUpdate() {
        list.push("app will update");
      }
      componentDidUpdate() {
        list.push("app did update");
      }

      render() {
        list.push("render " + this.state.aaa);
        return <div>{this.state.aaa}</div>;
      }
    }
    ReactDOM.render(<App />, div, function() {
      list.push("ReactDOM cb");
    });
    expect(list).toEqual([
      "render bbb",
      "did mount",
      "app will update",
      "render dddd",
      "app did update",
      "1111",
      "2222",
      "3333",
      "ReactDOM cb"
    ]);
  });
});

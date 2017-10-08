import {
  beforeHook,
  afterHook,
  browser
} from "karma-event-driver-ext/cjs/event-driver-hooks";
import React from "dist/React";
import PureComponent from "src/PureComponent";

describe("组件相关", function() {
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
  it("stateless", async () => {
    function HelloComponent(
      props
      /* context */
    ) {
      return <div onClick={() => (props.name = 11)}>Hello {props.name}</div>;
    }

    var s = React.render(<HelloComponent name="Sebastian" />, div);

    await browser.pause(200).$apply();
    expect(s.updater._hostNode.innerHTML).toBe("Hello Sebastian");
  });

  it("setState", async () => {
    var a = 1;
    class A extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          aaa: 1
        };
      }
      shouldComponentUpdate() {
        //这里相当于返回false
      }
      click() {
        this.setState(
          function(a) {
            a.aaa++;
          },
          function() {
            a++;
          }
        );

        this.setState(
          function(a) {
            a.aaa++;
          },
          function() {
            a++;
          }
        );
      }
      render() {
        return <div onClick={this.click.bind(this)}>{this.state.aaa}</div>;
      }
    }

    var s = React.render(<A />, div);
    await browser.pause(200).$apply();
    expect(s.updater._hostNode.innerHTML).toBe("1");
    await browser.click(s.updater._hostNode).pause(200).$apply();
    expect(s.updater._hostNode.innerHTML).toBe("1");

    expect(a).toBe(3);
  });
  it("setState2", async () => {
    var a = 1;
    class A extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          aaa: 1
        };
      }
      shouldComponentUpdate() {
        return false;
      }
      click() {
        this.setState(
          function(a) {
            a.aaa++;
          },
          function() {
            a++;
          }
        );

        this.setState(
          function(a) {
            a.aaa++;
          },
          function() {
            a++;
          }
        );
      }
      render() {
        return <div onClick={this.click.bind(this)}>{this.state.aaa}</div>;
      }
    }

    var s = React.render(<A />, div);
    await browser.pause(200).$apply();

    expect(s.updater._hostNode.innerHTML).toBe("1");
    await browser.click(s.updater._hostNode).pause(200).$apply();
    expect(s.updater._hostNode.innerHTML).toBe("1");
    expect(a).toBe(3);
  });
  it("PureComponent", async () => {
    var a = 1;
    class App extends React.PureComponent {
      constructor(props) {
        super(props);
        this.state = {
          aaa: {
            a: 7
          }
        };
      }

      click() {
        this.setState(function(state) {
          state.aaa.a = 8;
        });
      }
      render() {
        return <div onClick={this.click.bind(this)}>{this.state.aaa.a}</div>;
      }
    }

    var s = React.render(<App />, div);
    await browser.pause(200).$apply();

    expect(s.updater._hostNode.innerHTML).toBe("7");
    await browser.click(s.updater._hostNode).pause(200).$apply();
    expect(s.updater._hostNode.innerHTML).toBe("7");
  });
  it("PureComponent2", async () => {
    class A extends React.PureComponent {
      constructor(props) {
        super(props);
        this.state = {
          aaa: {
            a: 7
          }
        };
      }

      click() {
        var aaa = this.state.aaa;
        aaa.a = 9;
        this.setState({
          aaa: aaa,
          ccc: 222
        });
      }
      render() {
        return <div onClick={this.click.bind(this)}>{this.state.aaa.a}</div>;
      }
    }

    var s = React.render(<A />, div);
    await browser.pause(100).$apply();
    expect(s.updater._hostNode.innerHTML).toBe("7");

    await browser.click(s.updater._hostNode).pause(200).$apply();
    expect(s.updater._hostNode.innerHTML).toBe("9");
  });
  it("子组件是无状态组件", async () => {
    function Select(props) {
      return <strong>{props.value}</strong>;
    }
    class App extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          value: "南京"
        };
      }

      onChange(e) {
        this.setState({
          value: e.target.value
        });
      }
      render() {
        return (
          <div>
            <Select value={this.state.value} />
            <input
              ref="a"
              value={this.state.value}
              onInput={this.onChange.bind(this)}
            />
          </div>
        );
      }
    }

    var s = React.render(<App />, div);
    await browser.pause(100).$apply();
    expect(s.refs.a.value).toBe("南京");
    await browser.setValue(s.refs.a, "南京22").pause(200).$apply();
    expect(s.refs.a.value).toBe("南京22");
    expect(div.getElementsByTagName("strong")[0].innerHTML).toBe("南京22");
  });
  it("多选下拉框", async () => {
    class App extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          value: ["aaa", "ccc"]
        };
      }

      onChange(e) {
        var values = [];
        var elems = e.target.getElementsByTagName("option");
        for (var i = 0, el; (el = elems[i++]); ) {
          if (el.selected) {
            if (el.getAttribute("value") != null) {
              values.push(el.getAttribute("value"));
            } else {
              values.push(el.text);
            }
          }
        }
        this.setState({
          values: values
        });
      }
      render() {
        return (
          <select
            value={this.state.value}
            multiple="true"
            onChange={this.onChange.bind(this)}
          >
            <optgroup>
              <option ref="a">aaa</option>
              <option ref="b">bbb</option>
            </optgroup>
            <optgroup>
              <option ref="c">ccc</option>
              <option ref="d">ddd</option>
            </optgroup>
          </select>
        );
      }
    }

    var s = React.render(<App />, div);
    await browser.pause(100).$apply();
    expect(s.refs.a.selected).toBe(true);
    expect(s.refs.b.selected).toBe(false);
    expect(s.refs.c.selected).toBe(true);
    expect(s.refs.d.selected).toBe(false);
    s.setState({
      value: ["bbb", "ddd"]
    });
    await browser.pause(100).$apply();
    expect(s.refs.a.selected).toBe(false);
    expect(s.refs.b.selected).toBe(true);
    expect(s.refs.c.selected).toBe(false);
    expect(s.refs.d.selected).toBe(true);
  });

  it("多选下拉框defaultValue", async () => {
    class App extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          value: "ccc"
        };
      }

      render() {
        return (
          <select defaultValue={this.state.value}>
            <option ref="a">aaa</option>
            <option ref="b">bbb</option>
            <option ref="c">ccc</option>
            <option ref="d">ddd</option>
          </select>
        );
      }
    }

    var s = React.render(<App />, div);
    await browser.pause(100).$apply();
    expect(s.refs.c.selected).toBe(true);
  });

  it("多选下拉框没有defaultValue与ReactDOM.render的回调this指向问题", async () => {
    class App extends React.Component {
      constructor(props) {
        super(props);
        this.state = {};
      }

      render() {
        return (
          <select>
            <option ref="a">aaa</option>
            <option ref="b">bbb</option>
            <option ref="c">ccc</option>
            <option ref="d">ddd</option>
          </select>
        );
      }
    }

    var s = React.render(<App />, div, function(){
      expect(this.constructor.name).toBe('App')
    });
    await browser.pause(100).$apply();
    expect(s.refs.a.selected).toBe(true);
  });

  it("一个组件由元素节点变注释节点再回元素节点，不触发componentWillUnmount", async () => {
    class App extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          path: "111"
        };
      }
      change(path) {
        this.setState({
          path: path || "333"
        });
      }
      render() {
        return <div><span>xx</span><Route path={this.state.path} /></div>;
      }
    }
    var updateCount = 0;
    var receiveCount = 0;
    var destroyCount = 0;
    class Route extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          path: props.path
        };
      }
      componentWillReceiveProps(props) {
        receiveCount++;
        console.log('receiveCount',receiveCount)
        this.setState(function(nextState, props) {
          nextState.path = props.path;
          return nextState;
        });
      }
      componentWillUpdate() {
        updateCount++;
        console.log('updateCount',updateCount)
      }
      componentWillUnmount() {
        destroyCount++;
        console.log("destroyCount",destroyCount)
      }
      render() {
        return this.state.path == "111" ? <p>{this.state.path}</p> : null;
      }
    }
    var s = React.render(<App />, div);
    await browser.pause(100).$apply();
    expect(updateCount).toBe(0);
    expect(receiveCount).toBe(0);
    s.change("111");
    await browser.pause(100).$apply();
    expect(updateCount).toBe(1);
    expect(receiveCount).toBe(1);
    s.change("111x");
    await browser.pause(100).$apply();
    expect(updateCount).toBe(2);
    expect(receiveCount).toBe(2);
    expect(div.firstChild.childNodes[1].nodeType).toBe(8);
    expect(destroyCount).toBe(0);
    s.change("111");
    await browser.pause(100).$apply();
    expect(updateCount).toBe(3);
    expect(receiveCount).toBe(3);
    expect(div.firstChild.childNodes[1].nodeType).toBe(1);
    expect(destroyCount).toBe(0);
  });
  it("确保ref执行在componentDidMount之前", async () => {
    var str = "";
    class Test extends React.Component {
      componentDidMount() {
        expect(typeof this.refs.wrapper).toBe("object");
        str += "111";
      }
      render() {
        return <div ref="wrapper" id="aaa">xxx<B /></div>;
      }
    }
    class B extends React.Component {
      componentDidMount() {
        expect(typeof this.refs.wrapper2).toBe("object");
        str += "222";
      }
      render() {
        return <p ref="wrapper2">son</p>;
      }
    }
    var s = React.render(<Test />, div);
    await browser.pause(100).$apply();
    expect(str).toBe("222111");
    expect(React.findDOMNode(s.refs.wrapper)).toBe(div.querySelector("#aaa"));
  });
  it("确保componentDidUpdate的第一个参数是prevProps", async () => {
    class HasChild extends React.Component {
      constructor(props) {
        super(props);
        this.state = {};
        this.onClick = this.onClick.bind(this);
        this.a = 0;
      }
      onClick() {
        this.a = 1;
        this.forceUpdate();
      }
      render() {
        return (
          <div onClick={this.onClick} id="componentDidUpdate">
            {this.a == 0 ? <A title="xxx" ref="a" /> : <A ddd="ddd" ref="a" />}
          </div>
        );
      }
    }
    var title = 0;
    class A extends React.Component {
      constructor(props) {
        super(props);
        this.state = {};
      }
      componentDidUpdate(a) {
        title = 1;
      }
      render() {
        return <span>{this.props.title}</span>;
      }
    }
    A.defaultProps = {
      title: "默认值"
    };


    var s = React.render(<HasChild />, div);
    await browser.pause(100).$apply();
    expect(s.refs.a.props.title).toBe("xxx");
    await browser.click("#componentDidUpdate").pause(100).$apply();
    expect(s.refs.a.props.title).toBe("默认值");
    expect(s.refs.a.props.ddd).toBe("ddd");
    expect(title).toBe(1);
  });

  it("defaultProps的处理", async () => {
    class HasChild extends React.Component {
      constructor(props) {
        super(props);
        this.state = {};
        this.onClick = this.onClick.bind(this);
        this.a = 0;
      }
      onClick() {
        this.a = 1;
        this.forceUpdate();
      }
      render() {
        return (
          <div onClick={this.onClick} id="componentDidUpdate2">
            {this.a == 0 ? <A title="xxx" ref="a" /> : <A ddd="ddd" ref="a" />}
          </div>
        );
      }
    }
    function A(props) {
      return <span>{props.title}</span>;
    }

    A.defaultProps = {
      title: "默认值"
    };

    window.onload = function() {
      window.s = ReactDOM.render(
        <div>
          <HasChild />
        </div>,
        document.getElementById("example")
      );
    };

    var s = React.render(<HasChild />, div);
    await browser.pause(100).$apply();
    var span = div.getElementsByTagName("span")[0];
    expect(span.innerHTML).toBe("xxx");
    await browser.click("#componentDidUpdate2").pause(100).$apply();
    expect(span.innerHTML).toBe("默认值");
  });

  it("checkNull 中如果组件返回字符串应该报错", () => {});

  
   it('componentWillUnmount钩子中调用ReactDOM.findDOMNode 应该还能找到元素', () => {
    var assertions = 0;

    class Inner extends React.Component {
      render() {
        return <span />;
      }

      componentDidMount() {
        expect(ReactDOM.findDOMNode(this)).not.toBe(null);
        assertions++;
      }

      componentWillUnmount() {
        expect(ReactDOM.findDOMNode(this)).not.toBe(null);
        assertions++;
      }
    }

    class Wrapper extends React.Component {
      render() {
        return this.props.showInner ? <Inner /> : null;
      }
    }

    var el = document.createElement('div');
    var component;

    component = React.render(<Wrapper showInner={true} />, el);
    expect(ReactDOM.findDOMNode(component)).not.toBe(null);

    component = React.render(<Wrapper showInner={false} />, el);
    expect(ReactDOM.findDOMNode(component).tagName).toBe(undefined);

    component = React.render(<Wrapper showInner={true} />, el);
    expect(ReactDOM.findDOMNode(component)).not.toBe(null);

    expect(assertions).toBe(3);
  });

  it('虚拟DOM的_owner必须在render中加上',async ()=>{

 
    class B extends React.Component{
      render(){
        return <div className="xxx">{this.props.children}</div>
      }
    }
    var b , c
    class App extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          value: "南京"
        };
      }
      _renderPopup(a){
        return <B><p {...a}></p></B>
      }
      onChange(e) {
        this.setState({
          value: e.target.value
        });
      }
      render() {
        return (
          <div>
            {this._renderPopup({ref: "xxxx",children: [b = <span>333</span>]})}
            {this._renderPopup({ref: "yyyy",children: [c = <strong>444</strong>]})}
          </div>
        );
      }
    }
     var s = React.render(<App/>, div);
      await browser.pause(100).$apply();
     // console.log( s._rendered.props.children[0]._instance._rendered.props.children[0].props.children[0] )
     expect(b._owner.constructor).toBe(App)
     expect(c._owner.constructor).toBe(App)
  })
});

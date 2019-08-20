
'use strict';


let React;
let ReactDOM;
let ReactDOMServer;
let ReactTestUtils;

describe('ReactMount', () => {
  beforeEach(() => {
    jest.resetModules();

    React = require('react');
    ReactDOM = require('react-dom');
    ReactDOMServer = require('react-server-renderer');
    ReactTestUtils = require('test-utils');
  });

  describe('unmountComponentAtNode', () => {
    it('throws when given a non-node', () => {
      const nodeArray = document.getElementsByTagName('div');
      expect(() => {
        ReactDOM.unmountComponentAtNode(nodeArray);
      }).toThrow(
        'container is not a element'
      );
    });

    it('returns false on non-React containers', () => {
      const d = document.createElement('div');
      d.innerHTML = '<b>hellooo</b>';
      expect(ReactDOM.unmountComponentAtNode(d)).toBe(false);
      expect(d.textContent).toBe('hellooo');
    });

    it('returns true on React containers', () => {
      const d = document.createElement('div');
      ReactDOM.render(<b>hellooo</b>, d);
      expect(d.textContent).toBe('hellooo');
      expect(ReactDOM.unmountComponentAtNode(d)).toBe(true);
      expect(d.textContent).toBe('');
    });
  });

  it('warns when given a factory', () => {
    class Component extends React.Component {
      render() {
        return <div />;
      }
    }

    expect(() => ReactTestUtils.renderIntoDocument(Component)).toWarnDev(
      'Functions are not valid as a React child. ' +
      'This may happen if you return a Component instead of <Component /> from render. ' +
      'Or maybe you meant to call this function rather than return it.',
    );
  });

  it('should render different components in same root', () => {
    const container = document.createElement('container');
    document.body.appendChild(container);

    ReactDOM.render(<div />, container);
    expect(container.firstChild.nodeName).toBe('DIV');

    ReactDOM.render(<span />, container);
    expect(container.firstChild.nodeName).toBe('SPAN');
  });

  it('should unmount and remount if the key changes', () => {
    const container = document.createElement('container');

    const mockMount = jest.fn();
    const mockUnmount = jest.fn();

    class Component extends React.Component {
      componentDidMount = mockMount;
      componentWillUnmount = mockUnmount;
      render() {
        return <span>{this.props.text}</span>;
      }
    }

    expect(mockMount.mock.calls.length).toBe(0);
    expect(mockUnmount.mock.calls.length).toBe(0);

    ReactDOM.render(<Component text="orange" key="A" />, container);
    expect(container.firstChild.innerHTML).toBe('orange');
    expect(mockMount.mock.calls.length).toBe(1);
    expect(mockUnmount.mock.calls.length).toBe(0);

    // If we change the key, the component is unmounted and remounted
    ReactDOM.render(<Component text="green" key="B" />, container);
    expect(container.firstChild.innerHTML).toBe('green');
    expect(mockMount.mock.calls.length).toBe(2);
    expect(mockUnmount.mock.calls.length).toBe(1);

    // But if we don't change the key, the component instance is reused
    ReactDOM.render(<Component text="blue" key="B" />, container);
    expect(container.firstChild.innerHTML).toBe('blue');
    expect(mockMount.mock.calls.length).toBe(2);
    expect(mockUnmount.mock.calls.length).toBe(1);
  });

  it('should reuse markup if rendering to the same target twice', () => {
    const container = document.createElement('container');
    const instance1 = ReactDOM.render(<div />, container);
    const instance2 = ReactDOM.render(<div />, container);

    expect(instance1 === instance2).toBe(true);
  });

  it('should warn if mounting into left padded rendered markup', () => {
    const container = document.createElement('container');
    container.innerHTML = ReactDOMServer.renderToString(<div />) + ' ';

    expect(() => ReactDOM.hydrate(<div />, container)).toWarnDev(
      'Did not expect server HTML to contain the text node " " in <container>.',
    );
  });

  it('should warn if mounting into right padded rendered markup', () => {
    const container = document.createElement('container');
    container.innerHTML = ' ' + ReactDOMServer.renderToString(<div />);

    expect(() => ReactDOM.hydrate(<div />, container)).toWarnDev(
      'Did not expect server HTML to contain the text node " " in <container>.',
    );
  });

  it('should not warn if mounting into non-empty node', () => {
    const container = document.createElement('container');
    container.innerHTML = '<div></div>';

    ReactDOM.render(<div />, container);
  });

  it('should warn when mounting into document.body', () => {
    const iFrame = document.createElement('iframe');
    document.body.appendChild(iFrame);

    expect(() =>
      ReactDOM.render(<div />, iFrame.contentDocument.body),
    ).toWarnDev(
      'Rendering components directly into document.body is discouraged',
    );
  });

  it('should account for escaping on a checksum mismatch', () => {
    const div = document.createElement('div');
    const markup = ReactDOMServer.renderToString(
      <div>This markup contains an nbsp entity: &nbsp; server text</div>,
    );
    div.innerHTML = markup;

    expect(() =>
      ReactDOM.hydrate(
        <div>This markup contains an nbsp entity: &nbsp; client text</div>,
        div,
      ),
    ).toWarnDev(
      'Server: "This markup contains an nbsp entity:   server text" ' +
      'Client: "This markup contains an nbsp entity:   client text"',
    );
  });

  it('should warn if render removes React-rendered children', () => {
    const container = document.createElement('container');

    class Component extends React.Component {
      render() {
        return (
          <div>
            <div />
          </div>
        );
      }
    }

    ReactDOM.render(<Component />, container);

    // Test that blasting away children throws a warning
    const rootNode = container.firstChild;

    expect(() => ReactDOM.render(<span />, rootNode)).toWarnDev(
      'Warning: render(...): Replacing React-rendered children with a new ' +
      'root component. If you intended to update the children of this node, ' +
      'you should instead have the existing children update their state and ' +
      'render the new components instead of calling ReactDOM.render.',
    );
  });

  it('should warn if the unmounted node was rendered by another copy of React', () => {
    jest.resetModules();
    const ReactDOMOther = require('react-dom');
    const container = document.createElement('div');

    class Component extends React.Component {
      render() {
        return (
          <div>
            <div />
          </div>
        );
      }
    }

    ReactDOM.render(<Component />, container);
    // Make sure ReactDOM and ReactDOMOther are different copies
    //  expect(ReactDOM).not.toEqual(ReactDOMOther);

    expect(() => ReactDOMOther.unmountComponentAtNode(container)).toWarnDev(
      "Warning: unmountComponentAtNode(): The node you're attempting to unmount " +
      'was rendered by another copy of React.',
    );

    // Don't throw a warning if the correct React copy unmounts the node
    ReactDOM.unmountComponentAtNode(container);
  });

  it('passes the correct callback context', () => {
    const container = document.createElement('div');
    let calls = 0;

    ReactDOM.render(<div />, container, function () {
      expect(this.nodeName).toBe('DIV');
      calls++;
    });

    // Update, no type change
    ReactDOM.render(<div />, container, function () {
      expect(this.nodeName).toBe('DIV');
      calls++;
    });

    // Update, type change
    ReactDOM.render(<span />, container, function () {
      expect(this.nodeName).toBe('SPAN');
      calls++;
    });

    // Batched update, no type change
    ReactDOM.unstable_batchedUpdates(function () {
      ReactDOM.render(<span />, container, function () {
        expect(this.nodeName).toBe('SPAN');
        calls++;
      });
    });

    // Batched update, type change
    ReactDOM.unstable_batchedUpdates(function () {
      ReactDOM.render(<article />, container, function () {
        expect(this.nodeName).toBe('ARTICLE');
        calls++;
      });
    });

    expect(calls).toBe(5);


  });

  it(`initial mount is sync inside batchedUpdates, but task work is deferred until ` +
    `the end of the batch`, () => {
      const container1 = document.createElement('div');
      const container2 = document.createElement('div');

      class Foo extends React.Component {
        state = { active: false };
        componentDidMount() {
          this.setState({ active: true });
        }
        render() {
          return (
            <div>{this.props.children + (this.state.active ? '!' : '')}</div>
          );
        }
      }

      ReactDOM.render(<div>1</div>, container1);

      ReactDOM.unstable_batchedUpdates(() => {
        // Update. Does not flush yet.
        ReactDOM.render(<div>2</div>, container1);
        expect(container1.textContent).toEqual('1');

        // Initial mount on another root. Should flush immediately.
        ReactDOM.render(<Foo>a</Foo>, container2);
        // The update did not flush yet.
        expect(container1.textContent).toEqual('1');
        // The initial mount flushed, but not the update scheduled in cDU.
        expect(container2.textContent).toEqual('a');
      });
      // All updates have flushed.
      expect(container1.textContent).toEqual('2');
      expect(container2.textContent).toEqual('a!');

    });

  describe('mount point is a comment node', () => {
    return
    let containerDiv;
    let mountPoint;

    beforeEach(() => {
      containerDiv = document.createElement('div');
      containerDiv.innerHTML = 'A<!-- react-mount-point-unstable -->B';
      mountPoint = containerDiv.childNodes[1];
      expect(mountPoint.nodeType).toBe(COMMENT_NODE);
    });

    it('renders at a comment node', () => {
      function Char(props) {
        return props.children;
      }
      function list(chars) {
        return chars.split('').map(c => <Char key={c}>{c}</Char>);
      }

      ReactDOM.render(list('aeiou'), mountPoint);
      expect(containerDiv.innerHTML).toBe(
        'Aaeiou<!-- react-mount-point-unstable -->B',
      );

      ReactDOM.render(list('yea'), mountPoint);
      expect(containerDiv.innerHTML).toBe(
        'Ayea<!-- react-mount-point-unstable -->B',
      );

      ReactDOM.render(list(''), mountPoint);
      expect(containerDiv.innerHTML).toBe(
        'A<!-- react-mount-point-unstable -->B',
      );
    });
  });
  it("存在空组件", () => {
    const container = document.createElement('container');
    class B extends React.Component {
      constructor(props) {
        super(props);
        this.state = {};
      }
      render() {
        return <b>bbb</b>;
      }
    }
    class C extends React.Component {
      constructor(props) {
        super(props);
        this.state = {};
      }
      render() {
        return <b>ccc</b>;
      }
    }
    function Empty() {
      return false;
    }
    ReactDOM.render(
      <div>
        <strong>111</strong>
        <strong>222</strong>
        <Empty />
        <Empty />
        <B />
        <C />
      </div>, container
    );
    expect(container.textContent).toBe("111222bbbccc");
    ReactDOM.unmountComponentAtNode(container)
  });
  it("存在返回数组的组件", () => {
    const container = document.createElement('container');

    class App extends React.Component {
      constructor(props) {
        super(props);
        this.state = {};
      }
      render() {
        return <div className="root">{this.props.children}</div>;
      }
    }
    class A extends React.Component {
      constructor(props) {
        super(props);
        this.state = {};
      }
      render() {
        return [<a>aaa</a>, <a>bbb</a>, <a>ccc</a>, <a>ddd</a>];
      }
    }
    function Last() {
      return <span>last</span>;
    }
    function Empty() {
      return false;
    }
    ReactDOM.render(
      <div>
        <strong>111</strong>
        <App>
          <A />
        </App>
        <Empty />
        <Empty />
        <Last />
      </div>,
      container
    );
    expect(container.textContent).toBe("111aaabbbcccdddlast");
    ReactDOM.unmountComponentAtNode(container)
  });
  it("返回false的组件不生成节点", () => {
    const container = document.createElement('container');
    class Empty1 extends React.Component {
      constructor(props) {
        super(props);
        this.state = {};
      }
      render() {
        return false;
      }
    }

    ReactDOM.render(<Empty1 />, container);
    expect(container.textContent).toBe("");
    ReactDOM.unmountComponentAtNode(container)
  });
  it("返回null的组件不生成节点", () => {
    const container = document.createElement('container');
    class Empty2 extends React.Component {
      constructor(props) {
        super(props);
        this.state = {};
      }
      render() {
        return null;
      }
    }

    ReactDOM.render(<Empty2 />, container);
    expect(container.textContent).toBe("");
    ReactDOM.unmountComponentAtNode(container)
  });
  it("返回true的组件不生成节点", () => {
    const container = document.createElement('container');
    class Empty2 extends React.Component {
      constructor(props) {
        super(props);
        this.state = {};
      }
      render() {
        return true;
      }
    }

    ReactDOM.render(<Empty2 />, container);
    expect(container.textContent).toBe("");
    ReactDOM.unmountComponentAtNode(container)
  });

  it("对有key的元素进行重排", () => {
    const container = document.createElement('container');
    class App extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          a: 1
        };
      }
      render() {
        return (<div>{this.state.a ?
          [<a key="a">111</a>, <a key="b">222</a>, <a key="c">333</a>] :
          [<a key="c">333</a>, <a key="b">444</a>, <a key="a">111</a>]}</div>);
      }
    }
    let s = ReactDOM.render(<App />, container);
    expect(container.textContent).toBe("111222333");
    s.setState({ a: 0 });
    expect(container.textContent).toBe("333444111");
    ReactDOM.unmountComponentAtNode(container)
  });
  it("对有key的组件进行重排", () => {
    const container = document.createElement('container');

    function A(props) {
      return <span>{props.value}</span>;
    }
    class App extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          a: 1
        };
      }
      render() {
        return (<div>{this.state.a ?
          [<A key="a" value="1" />, <A key="b" value="2" />, <A key="c" value="3" />] :
          [<A key="c" value="3" />, <A key="b" value="2" />, <A key="a" value="1" />]}</div>);
      }
    }
    var s = ReactDOM.render(<App />, container);
    expect(container.textContent).toBe("123");
    s.setState({ a: 0 });
    expect(container.textContent).toBe("321");
    ReactDOM.unmountComponentAtNode(container);


  });
  it("同一个元素节点中两个组件更新", () => {
    const container = document.createElement('container');
    class Wrap extends React.Component {
      render(){
          return this.props.children
      }
   }
    var values = [111, 222, 333, 444]
    class App extends React.Component {
      state = {
        text: 111
      }
      render() {

        return <div ref="div"><TextArea id="text1" value={values.shift()} /><div id="div">{this.state.text}</div>
          <Wrap><TextArea id="text2" value={values.shift()} /></Wrap></div>
      }
    }
    class TextArea extends React.Component {
      state = {
        text: 222
      }
      componentDidMount() {

        this.setState({
          text: 222
        })
      }
      render() {

        return <textarea id={this.props.id} value={this.props.value}></textarea>
      }
    }



    var instance = ReactDOM.render(<App id="app" />, container);

    expect(Array.from(instance.refs.div.children).map(function (el) {
      return el.id
    })).toEqual(["text1", "div", "text2"])

  })
});
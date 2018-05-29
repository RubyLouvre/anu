'use strict';

describe('ReactDOMEventListener', () => {

  let React = require('react');
  let ReactDOM = require('react-dom');
  let ReactTestUtils = require('test-utils');
  beforeEach(() => {
    jest.resetModules();

  });

  it('should dispatch events from outside React tree', () => {
    return
    const mock = jest.fn();

    const container = document.createElement('div');
    const node = ReactDOM.render(<div onMouseEnter={mock} />, container);
    const otherNode = document.createElement('h1');
    document.body.appendChild(container);
    document.body.appendChild(otherNode);

    otherNode.dispatchEvent(
      new MouseEvent('mouseout', {
        bubbles: true,
        cancelable: true,
        relatedTarget: node,
      }),
    );
    expect(mock).toBeCalled();
  });

  describe('Propagation', () => {
    let container
    beforeEach(() => {
      jest.resetModules();
      container = document.createElement("div")
      document.body.appendChild(container)
    });
    afterEach(() => {
      document.body.removeChild(container);

    });
    it('should propagate events one level down', () => {
      const mouseOut = jest.fn();
      const onMouseOut = event => mouseOut(event.currentTarget);

      const childContainer = document.createElement('div');
      const parentContainer = document.createElement('div');
      const childNode = ReactDOM.render(
        <div onMouseOut={onMouseOut}>Child</div>,
        childContainer,
      );
      const parentNode = ReactDOM.render(
        <div onMouseOut={onMouseOut}>div</div>,
        parentContainer,
      );
      parentNode.appendChild(childContainer);
      document.body.appendChild(parentContainer);

      const nativeEvent = document.createEvent('Event');
      nativeEvent.initEvent('mouseout', true, true);
      childNode.dispatchEvent(nativeEvent);

      expect(mouseOut).toBeCalled();
      expect(mouseOut.mock.calls.length).toBe(2);
      expect(mouseOut.mock.calls[0][0]).toEqual(childNode);
      expect(mouseOut.mock.calls[1][0]).toEqual(parentNode);

      document.body.removeChild(parentContainer);
    });

    it('should propagate events two levels down', () => {
      const mouseOut = jest.fn();
      const onMouseOut = event => mouseOut(event.currentTarget);

      const childContainer = document.createElement('div');
      const parentContainer = document.createElement('div');
      const grandParentContainer = document.createElement('div');
      const childNode = ReactDOM.render(
        <div onMouseOut={onMouseOut}>Child</div>,
        childContainer,
      );
      const parentNode = ReactDOM.render(
        <div onMouseOut={onMouseOut}>Parent</div>,
        parentContainer,
      );
      const grandParentNode = ReactDOM.render(
        <div onMouseOut={onMouseOut}>Parent</div>,
        grandParentContainer,
      );
      parentNode.appendChild(childContainer);
      grandParentNode.appendChild(parentContainer);

      document.body.appendChild(grandParentContainer);

      const nativeEvent = document.createEvent('Event');
      nativeEvent.initEvent('mouseout', true, true);
      childNode.dispatchEvent(nativeEvent);

      expect(mouseOut).toBeCalled();
      expect(mouseOut.mock.calls.length).toBe(3);
      expect(mouseOut.mock.calls[0][0]).toEqual(childNode);
      expect(mouseOut.mock.calls[1][0]).toEqual(parentNode);
      expect(mouseOut.mock.calls[2][0]).toEqual(grandParentNode);

      document.body.removeChild(grandParentContainer);
    });

    // Regression test for https://github.com/facebook/react/issues/1105
    it('should not get confused by disappearing elements', () => {

      class MyComponent extends React.Component {
        state = { clicked: false };
        handleClick = () => {
          this.setState({ clicked: true });
        };
        componentDidMount() {
          expect(ReactDOM.findDOMNode(this)).toBe(container.firstChild);
        }
        componentDidUpdate() {
          expect(ReactDOM.findDOMNode(this)).toBe(container.firstChild);
        }
        render() {
          if (this.state.clicked) {
            return <span>clicked!</span>;
          } else {
            return <button onClick={this.handleClick}>not yet clicked</button>;
          }
        }
      }
      ReactDOM.render(<MyComponent />, container);
      container.firstChild.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
        }),
      );
      expect(container.firstChild.textContent).toBe('clicked!');

    });

    it('should batch between handlers from different roots', () => {
      const mock = jest.fn();

      const childContainer = document.createElement('div');
      const handleChildMouseOut = () => {
        ReactDOM.render(<div>1</div>, childContainer);
        mock(childNode.textContent);
      };

      const parentContainer = document.createElement('div');
      const handleParentMouseOut = () => {
        ReactDOM.render(<div>2</div>, childContainer);
        mock(childNode.textContent);
      };

      const childNode = ReactDOM.render(
        <div onMouseOut={handleChildMouseOut}>Child</div>,
        childContainer,
      );
      const parentNode = ReactDOM.render(
        <div onMouseOut={handleParentMouseOut}>Parent</div>,
        parentContainer,
      );
      parentNode.appendChild(childContainer);
      document.body.appendChild(parentContainer);

      const nativeEvent = document.createEvent('Event');
      nativeEvent.initEvent('mouseout', true, true);
      childNode.dispatchEvent(nativeEvent);

      // Child and parent should both call from event handlers.
      expect(mock.mock.calls.length).toBe(2);
      // The first call schedules a render of '1' into the 'Child'.
      // However, we're batching so it isn't flushed yet.
      expect(mock.mock.calls[0][0]).toBe('Child');
      // The first call schedules a render of '2' into the 'Child'.
      // We're still batching so it isn't flushed yet either.
      expect(mock.mock.calls[1][0]).toBe('Child');
      // By the time we leave the handler, the second update is flushed.
      expect(childNode.textContent).toBe('2');
      document.body.removeChild(parentContainer);
    });


    it('should not fire duplicate events for a React DOM tree', () => {
      const mouseOut = jest.fn();
      const onMouseOut = event => mouseOut(event.target);

      class Wrapper extends React.Component {
        getInner = () => {
          return this.refs.inner;
        };

        render() {
          const inner = <div ref="inner">Inner</div>;
          return (
            <div>
              <div onMouseOut={onMouseOut} id="outer">
                {inner}
              </div>
            </div>
          );
        }
      }

      const instance = ReactDOM.render(<Wrapper />, container);


      const nativeEvent = document.createEvent('Event');
      nativeEvent.initEvent('mouseout', true, true);
      instance.getInner().dispatchEvent(nativeEvent);

      expect(mouseOut).toBeCalled();
      expect(mouseOut.mock.calls.length).toBe(1);
      expect(mouseOut.mock.calls[0][0]).toEqual(instance.getInner());

      ReactDOM.unmountComponentAtNode(container);
    });

    it("冒泡", function () {

      var aaa = "";
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
          aaa += "aaa ";
        }
        click2(e) {
          aaa += "bbb ";
          e.stopPropagation();
        }
        click3(e) {
          aaa += "ccc ";
        }
        render() {
          return (
            <div onClick={this.click}>
              <p>=========</p>
              <div onClick={this.click2}>
                <p>=====</p>
                <div ref="bubble" onClick={this.click3}>
                  {this.state.aaa.a}
                </div>
              </div>
            </div>
          );
        }
      }

      var s = ReactDOM.render(<App />, container);
      ReactTestUtils.Simulate.click(s.refs.bubble);

      expect(aaa.trim()).toBe("ccc bbb");

      ReactDOM.unmountComponentAtNode(container);

    });
    it("捕获", function () {
      var aaa = "";
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
          aaa += "aaa ";
        }
        click2(e) {
          aaa += "bbb ";
          e.preventDefault();
          e.stopPropagation();
        }
        click3(e) {
          aaa += "ccc ";
        }
        render() {
          return (
            <div onClickCapture={this.click}>
              <p>=========</p>
              <div onClickCapture={this.click2}>
                <p>=====</p>
                <div ref="capture" onClickCapture={this.click3}>
                  {this.state.aaa.a}
                </div>
              </div>
            </div>
          );
        }
      }

      var s = ReactDOM.render(<App />, container);

      ReactTestUtils.Simulate.click(s.refs.capture);
      expect(aaa.trim()).toBe("aaa bbb");
      ReactDOM.unmountComponentAtNode(container);
    });
    it("1.1.2checkbox绑定onChange事件会触发两次", async () => {
      var logIndex = 0;
      function refFn(e) {
        logIndex++;
      }

      var dom = ReactDOM.render(<input type="checkbox" onChange={refFn} />, container);
      dom.click()


      expect(logIndex).toBe(1);
      ReactDOM.unmountComponentAtNode(container);
    });
    it("让focus能冒泡", () => {
      var aaa = "";
      class App extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            aaa: {
              a: 7
            }
          };
        }

        onFocus1() {
          aaa += "aaa ";
        }
        onFocus2(e) {
          aaa += "bbb ";
        }

        render() {
          return (
            <div
              onFocus={this.onFocus2}
              style={{
                width: 200,
                height: 200
              }}
            >
              <div
                ref="focus2"
                tabIndex={-1}
                onFocus={this.onFocus1}
                style={{
                  width: 100,
                  height: 100
                }}
              >
                222
                      </div>
            </div>
          );
        }
      }

      var s = ReactDOM.render(<App />, container);
      s.refs.focus2.focus()
      expect(aaa.trim()).toBe("aaa bbb");
      ReactDOM.unmountComponentAtNode(container);
    });


    it("合并点击事件中的setState", async () => {
      var list = [];
      class App extends React.Component {
        constructor(props) {
          super(props);
          this.__merge = true
          this.state = {
            path: "111"
          };
        }

        render() {
          list.push("render " + this.state.path);
          return (
            <div>
              <span ref="click2time" onClick={this.onClick.bind(this)}>
                {this.state.path}
              </span>
            </div>
          );
        }

        onClick() {
          this.setState(
            {
              path: "click"
            },
            function () {
              list.push("click....");
            }
          );
          this.setState(
            {
              path: "click2"
            },
            function () {
              list.push("click2....");
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

      var s = ReactDOM.render(<App />, container, function () {
        list.push("ReactDOM cb");
      });
      var list2 = ["render 111", "ReactDOM cb", "will update", "render click2", "did update", "click....", "click2...."];
      ReactTestUtils.Simulate.click(s.refs.click2time);
      expect(list).toEqual(list2);

      ReactDOM.unmountComponentAtNode(container);


    });




  });

});
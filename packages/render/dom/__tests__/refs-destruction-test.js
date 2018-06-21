'use strict';

let React;
let ReactDOM;
let ReactTestUtils;

let TestComponent;

describe('refs-destruction', () => {
  beforeEach(() => {
    jest.resetModules();

    React = require('react');
    ReactDOM = require('react-dom');
    ReactTestUtils = require('test-utils');

    class ClassComponent extends React.Component {
      render() {
        return null;
      }
    }

    TestComponent = class extends React.Component {
      render() {
        if (this.props.destroy) {
          return <div />;
        } else if (this.props.removeRef) {
          return (
            <div>
              <div />
              <ClassComponent />
            </div>
          );
        } else {
          return (
            <div>
              <div ref="theInnerDiv" />
              <ClassComponent ref="theInnerClassComponent" />
            </div>
          );
        }
      }
    };
  });

  it('should remove refs when destroying the parent', () => {
    const container = document.createElement('div');
    const testInstance = ReactDOM.render(<TestComponent />, container);
    expect(ReactTestUtils.isDOMComponent(testInstance.refs.theInnerDiv)).toBe(
      true,
    );
    expect(
      Object.keys(testInstance.refs || {}).filter(key => testInstance.refs[key])
        .length,
    ).toEqual(2);
    ReactDOM.unmountComponentAtNode(container);
    expect(
      Object.keys(testInstance.refs || {}).filter(key => testInstance.refs[key])
        .length,
    ).toEqual(0);
  });

  it('should remove refs when destroying the child', () => {
    const container = document.createElement('div');
    const testInstance = ReactDOM.render(<TestComponent />, container);
    expect(ReactTestUtils.isDOMComponent(testInstance.refs.theInnerDiv)).toBe(
      true,
    );
    expect(
      Object.keys(testInstance.refs || {}).filter(key => testInstance.refs[key])
        .length,
    ).toEqual(2);
    ReactDOM.render(<TestComponent destroy={true} />, container);
    expect(
      Object.keys(testInstance.refs || {}).filter(key => testInstance.refs[key])
        .length,
    ).toEqual(0);
  });

  it('should remove refs when removing the child ref attribute', () => {
    const container = document.createElement('div');
    const testInstance = ReactDOM.render(<TestComponent />, container);
    expect(ReactTestUtils.isDOMComponent(testInstance.refs.theInnerDiv)).toBe(
      true,
    );
    expect(
      Object.keys(testInstance.refs || {}).filter(key => testInstance.refs[key])
        .length,
    ).toEqual(2);
    ReactDOM.render(<TestComponent removeRef={true} />, container);
    expect(
      Object.keys(testInstance.refs || {}).filter(key => testInstance.refs[key])
        .length,
    ).toEqual(0);
  });
  it("在componentWillUnmount中refs中的元素节点还能访问到父节点", ()=>{
    const container = document.createElement('div');
    var a 
    class Inner extends React.Component{
      render(){
        return <h2 ref="zzz">xxx</h2>
      }
      componentWillUnmount(){
         a  = this.refs.zzz.parentNode;
      }
    }
    ReactDOM.render(<h1><Inner /></h1>, container)
    ReactDOM.unmountComponentAtNode(container)
    expect(!!a).toBe(true)
  })
  it('should not error when destroying child with ref asynchronously', () => {
    class Modal extends React.Component {
      componentDidMount() {
        this.div = document.createElement('div');
        document.body.appendChild(this.div);
        this.componentDidUpdate();
      }

      componentDidUpdate() {
        ReactDOM.render(<div>{this.props.children}</div>, this.div);
      }

      componentWillUnmount() {
        const self = this;
        // some async animation
        setTimeout(function() {
          expect(function() {
            ReactDOM.unmountComponentAtNode(self.div);
          }).not.toThrow();
          document.body.removeChild(self.div);
        }, 0);
      }

      render() {
        return null;
      }
    }

    class AppModal extends React.Component {
      render() {
        return (
          <Modal>
            <a ref="ref" />
          </Modal>
        );
      }
    }

    class App extends React.Component {
      render() {
        return this.props.hidden ? null : <AppModal onClose={this.close} />;
      }
    }

    const container = document.createElement('div');
    ReactDOM.render(<App />, container);
    ReactDOM.render(<App hidden={true} />, container);
    jest.runAllTimers();
  });
});

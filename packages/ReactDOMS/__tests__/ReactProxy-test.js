let PropTypes;
let React;
let ReactDOM;

describe('ReactProxy', () => {
    let container;
    let createProxy = require('../../../lib/ReactProxy');
    let deepForceUpdate = require('../../../lib/deepForceUpdate');
    beforeEach(() => {

        React = require('react');
        PropTypes = React.PropTypes;
        ReactDOM = require('react-dom');
        container = document.createElement('div');
    });


    it('hot-loader', () => {
        class ComponentVersion1 extends React.Component {
            render() {
              return <div>Before hot update.</div>;
            }
          }
          
          class ComponentVersion2 extends React.Component {
            render() {
              return <div>After hot update!</div>;
            }
          }
     
          // Create a proxy object, given the initial React component class.
          const proxy = createProxy(ComponentVersion1);
          
          // Obtain a React class that acts exactly like the initial version.
          // This is what we'll use in our app instead of the real component class.
          const Proxy = proxy.get();
          
          // Render the component (proxy, really).
          const rootInstance = ReactDOM.render(<Proxy />, container);
          
          // Point the proxy to the new React component class by calling update().
          // Instances will stay mounted and their state will be intact, but their methods will be updated.
          proxy.update(ComponentVersion2);
          
          deepForceUpdate(rootInstance)
          expect(container.textContent.trim()).toBe("After hot update!")
    });


});
'use strict';

let React;
let ReactDOM;
let ReactTestUtils;

describe('ReactCompositeComponentNestedState-state', () => {
  beforeEach(() => {
    React = require('react');
    ReactDOM = require('react-dom');
    ReactTestUtils = require('test-utils');
  });

  it('should provide up to date values for props', () => {
    class ParentComponent extends React.Component {
      state = {color: 'blue'};

      handleColor = color => {
        this.props.logger('parent-handleColor', this.state.color);
        this.setState({color: color}, function() {
          this.props.logger('parent-after-setState', this.state.color);
        });
      };

      render() {
        this.props.logger('parent-render', this.state.color);
        return (
          <ChildComponent
            logger={this.props.logger}
            color={this.state.color}
            onSelectColor={this.handleColor}
          />
        );
      }
    }

    class ChildComponent extends React.Component {
      constructor(props) {
        super(props);
        props.logger('getInitialState', props.color);
        this.state = {hue: 'dark ' + props.color};
      }

      handleHue = (shade, color) => {
        this.props.logger('handleHue', this.state.hue, this.props.color);
        this.props.onSelectColor(color);
        this.setState(
          function(state, props) {
            this.props.logger(
              'setState-this',
              this.state.hue,
              this.props.color,
            );
            this.props.logger('setState-args', state.hue, props.color);
            return {hue: shade + ' ' + props.color};
          },
          function() {
            this.props.logger(
              'after-setState',
              this.state.hue,
              this.props.color,
            );
          },
        );
      };

      render() {
        this.props.logger('render', this.state.hue, this.props.color);
        return (
          <div>
            <button onClick={this.handleHue.bind(this, 'dark', 'blue')}>
              Dark Blue
            </button>
            <button onClick={this.handleHue.bind(this, 'light', 'blue')}>
              Light Blue
            </button>
            <button onClick={this.handleHue.bind(this, 'dark', 'green')}>
              Dark Green
            </button>
            <button onClick={this.handleHue.bind(this, 'light', 'green')}>
              Light Green
            </button>
          </div>
        );
      }
    }

    const container = document.createElement('div');
    document.body.appendChild(container);

    const logger = jest.fn();

    void ReactDOM.render(<ParentComponent logger={logger} />, container);

    // click "light green"
    ReactTestUtils.Simulate.click(container.childNodes[0].childNodes[3]);

    expect(logger.mock.calls).toEqual([
      ['parent-render', 'blue'],
      ['getInitialState', 'blue'],
      ['render', 'dark blue', 'blue'],
      ['handleHue', 'dark blue', 'blue'],
      ['parent-handleColor', 'blue'],
      ['parent-render', 'green'],
      ['setState-this', 'dark blue', 'blue'],
      ['setState-args', 'dark blue', 'green'],
      ['render', 'light green', 'green'],
      ['after-setState', 'light green', 'green'],
      ['parent-after-setState', 'green'],
    ]);
  });
});
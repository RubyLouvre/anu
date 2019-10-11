import React, { Component } from 'react';

class ErrorBoundary extends Component {
  state = {
    hasError: false
  };

  // NOTE
  // Not supported in qreact
  // It should be a bug
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });

    console.log(error, info); // eslint-disable-line
  }

  render() {
    if (this.state.hasError)
      return (
          <div className="__internal__ErrorBoundary__">
            页面遇到了一点小问题，请稍候再试
            <style ref={(node) => {
                Object(node).textContent = `
                .__internal__ErrorBoundary__ {
                  text-align: center;
                  font-size: 12px;
                  color: #666;
                  padding-top: 240px;
                }
              `;
            }
          }/>
          </div>
      );
    return this.props.children;
  }
}

export default ErrorBoundary;


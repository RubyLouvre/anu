import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import { DEBUG } from '@shared/env';

@observer
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

    if (DEBUG) console.log(error, info); // eslint-disable-line
  }

  render() {
    if (this.state.hasError)
      return (
        <Fragment>
          <div className="__internal__ErrorBoundary__">
            页面遇到了一点小问题，请稍候再试
          </div>
          <style jsx>{`
            .__internal__ErrorBoundary__ {
              text-align: center;
              font-size: 12px;
              color: #666;
              padding-top: 240px;
            }
          `}</style>
        </Fragment>
      );
    return this.props.children;
  }
}

export default ErrorBoundary;

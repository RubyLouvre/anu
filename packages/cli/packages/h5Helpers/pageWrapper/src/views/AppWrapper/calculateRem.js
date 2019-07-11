import React from 'react';
import * as R from 'ramda';
import MAX_VIEWPORT_WIDTH from '@shared/runtime/MAX_VIEWPORT_WIDTH';

export default function calculateRem(App) {
  return class RootRemAutoCalculated extends React.Component {
    constructor() {
      super();
      this.rootElement = document.documentElement;
      this.calculateRem = this.calculateRem.bind(this);
      this.calculateRem();
    }

    calculateRem() {
      const { clientWidth = 320 } = this.rootElement;
      const normalizeWidth =
        (R.clamp(320, MAX_VIEWPORT_WIDTH, clientWidth) * 100) / 750;

      this.rootElement.style.fontSize = normalizeWidth + 'px';
    }

    componentDidMount() {
      window.addEventListener('orientationchange', this.calculateRem);
      window.addEventListener('resize', this.calculateRem);
    }

    render() {
      return <App {...this.props} />;
    }
  };
}

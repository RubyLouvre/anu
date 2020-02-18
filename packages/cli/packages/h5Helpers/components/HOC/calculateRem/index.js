import React from 'react';
import { MAX_VIEWPORT_WIDTH, MIN_VIEWPORT_WIDTH } from '@internalConsts/runtime/index';

export default function calculateRem(App) {
    return class RootRemAutoCalculated extends React.Component {
        constructor() {
            super();
            this.rootElement = document.documentElement;
            this.calculateRem = this.calculateRem.bind(this);
            this.calculateRem();
        }

        calculateRem() {
            let  clientWidth  = this.rootElement.clientWidth;
            if(clientWidth  >= MAX_VIEWPORT_WIDTH){
                clientWidth = MAX_VIEWPORT_WIDTH;
            }
            let normalizeWidth = clientWidth * 100 / 750;
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

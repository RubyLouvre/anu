import React from 'react';
import ReactDOM from 'react-dom';
import { init } from '../packages/store/index';
import { Provider } from 'react-redux';
import * as models from './models';
import Count from './Count';

// generate Redux store
const store = init({
    models,
});

const Root = () => (
    <Provider store={store}>
        <Count />
    </Provider>
);

ReactDOM.render(<Root />, document.querySelector('#root'));
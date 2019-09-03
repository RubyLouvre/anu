import React from 'react';
import ReactDOM from 'react-dom';
import TodoList from './TodoList4';
import store from './models/Todo'
import { Provider } from 'mobx-react';


ReactDOM.render(
    <Provider store={store}>
        <TodoList />
    </Provider>
    , document.getElementById('root'));

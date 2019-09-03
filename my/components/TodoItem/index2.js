import React from 'react';
import './index.css';
import store from '../../models/Todo';

function TodoItem({ todo }) {
    return <li className={todo.finished ? 'finished item' : 'todo item'} >
        <input type='checkbox' checked={todo.finished}
            onChange={() => {
                todo.finished = !todo.finished
            }} />
        {todo.title}
        <span className='del-button' onClick={
            () => {
                store.remove(todo)
            }
        } >删除</span>
    </li >
}

export default TodoItem
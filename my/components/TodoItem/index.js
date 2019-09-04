import React from 'react';
import './index.css'
function TodoItem({ todo, deleteTodo, updateTodo }) {
    return <li className={todo.finished ? 'finished item' : 'todo item'} >
        <input type='checkbox'
            checked={todo.finished}
            onChange={updateTodo} />
        {todo.title}
        <span className='del-button' onClick={deleteTodo} >删除  </span>
    </li>
}

export default TodoItem
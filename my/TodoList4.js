import React from 'react';
import TodoItem from './components/TodoItem/index2'
import TodoForm from './components/TodoForm/index2'
import './TodoList.css'
import { inject, observer } from 'mobx-react';

@inject(function (state) {
    return {
        store: state.store,
        todos: state.store.todos
    }
})
@observer
class TodoList extends React.Component {
    render() {
        return <main>
            <h1 className='header'>任务标签</h1>
            <ul className='todoList'>{
                    this.props.todos.map(todo => {
                        return <TodoItem todo={todo} key={todo.id} />
                    }) }
            </ul>
            <details hidden={!this.props.todos.length}>
                <summary>{this.props.store.finishedCount}已完成/{this.props.todos.length}总数</summary>
            </details>
            <TodoForm></TodoForm>
        </main>
    }
}
export default TodoList;
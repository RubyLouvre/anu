import React from 'react';
import TodoItem from './components/TodoItem/index'
import TodoForm from './components/TodoForm/index'

import './TodoList.css'

class TodoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            todos: [],
            finishedCount: 0,
        }
        this.textarea = React.createRef()
    }
    updateTodo(todo) {
        todo.finished = !todo.finished
        this.setState({
            todos: this.state.todos.concat(),
            finishedCount: this.state.finishedCount + (todo.finished ? 1 : -1)
        })
    }
    addTodo = (e) => {
        if (e.type === 'keypress') {
            if (e.which !== 13) {
                return
            }
        } else {
            e.preventDefault()
        }
        console.log(this.textarea)
        var value = this.textarea.current.value
        if (value) {
            this.setState({
                todos: this.state.todos.concat({
                    finished: false,
                    title: value,
                    id: `todo-${Math.random()}`
                })
            })
            this.textarea.current.value = ''
        }
    }
    deleteTodo(todo) {
        var finished = todo.finished
        this.setState({
            todos: this.state.todos.filter(function (todoem) {
                return todo !== todoem
            }),
            finishedCount: this.state.finishedCount + (finished ? -1 : 0)
        })
    }
    render() {

        return <main>
            <h1 className='header'>任务标签</h1>
            <ul className='todoList'>
                {
                    this.state.todos.map(todo => {
                        return <TodoItem todo={todo}
                            key={todo.id}
                            deleteTodo={this.deleteTodo.bind(this, todo)}
                            updateTodo={this.updateTodo.bind(this, todo)}
                        ></TodoItem>
                    })
                }
            </ul>
            <details hidden={!this.state.todos.length}>
                <summary>{this.state.finishedCount}已完成/{this.state.todos.length}总数</summary>
            </details>

            <TodoForm
                addTodo={this.addTodo}
                textarea={this.textarea}></TodoForm>
        </main>
    }
}
export default TodoList;
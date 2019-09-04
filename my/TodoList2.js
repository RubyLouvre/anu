import React from 'react';
import TodoItem from './TodoItem'
import './TodoList.css'
class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      finishedCount: 0,
    }
  }
  updateTodo(todo) {
    todo.finished = !todo.finished
    this.setState({
      todos: this.state.todos.concat(),
      finishedCount: this.state.finishedCount + (todo.finished ? 1 : -1)
    })
  }

  addTodo(e) {
    var value = this.textarea.value
    console.log(e)
    e.preventDefault()
    if (value) {
      this.setState({
        todos: this.state.todos.concat({
          finished: false,
          title: value,
          id: `todo-${Math.random()}`
        })
      })
      this.textarea.value = ''
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
      <form className='addTask' onSubmit={this.addTodo.bind(this)}>
        <p className='input'><span className="hint">任务:</span> <textarea placeholder="安排新任务吧。。。" ref={(dom) => {
          if (dom) {
            this.textarea = dom
          }
        }}></textarea></p>
        <p><button type='submit'>保存任务</button></p>
      </form>
    </main>
  }
}
export default TodoList;


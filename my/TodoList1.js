import React from 'react';
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
    console.log(todo)
    todo.finished = !todo.finished
    this.setState({
      todos: this.state.todos.concat(),
      finishedCount: this.state.finishedCount + (todo.finished ? 1 : -1)
    })
  }
  addTodo(e) {
    var value = this.refs.textarea.value
    e.preventDefault()
    if (value) {
      this.setState({
        todos: this.state.todos.concat({
          finished: false,
          title: value,
          id: `todo-${Math.random()}`
        })
      })
      this.refs.textarea.value = ''
    }
  }
  render() {
    return <main>
      <h1 className='header'>任务标签</h1>

      <ul>
        {
          this.state.todos.map(todo => {
            console.log(todo)
            return <li className={todo.finished ? 'finished item' : 'todo item'} key={todo.id} >
              <input type='checkbox'
                checked={todo.finished}
                onChange={this.updateTodo.bind(this, todo)} />
              {todo.title}
              <span className='hover' >删除  </span>
            </li>
          })
        }
      </ul>
      <details hidden={!this.state.todos.length}>
        <summary>{this.state.finishedCount}已完成/{this.state.todos.length}总数</summary>
      </details>

      <form className='addTask' onSubmit={this.addTodo.bind(this)}>
        <p className='input'><span className="hint">任务:</span>  <textarea placeholder="安排新任务吧。。。" ref='textarea'></textarea></p>
        <p><button type='submit'>保存任务</button></p>
      </form>

    </main >
  }
}
export default TodoList;
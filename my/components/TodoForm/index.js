import React from 'react';

function TodoForm(props) {
    return <form className='addTask' onSubmit={props.addTodo}>
        <p className='input'><span className="hint">任务:</span> <textarea
            placeholder="安排新任务吧。。。"
            onKeyPress={props.addTodo}
            ref={props.textarea}></textarea></p>
        <p><button type='submit'>保存任务</button></p>
    </form>
}

export default TodoForm
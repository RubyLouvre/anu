import React from 'react';

import store from '../../models/Todo'
var textarea = React.createRef();
function TodoForm() {
    var addTask = function (e) {
        if (e.type === 'keypress') {
            if (e.which !== 13) {
                return
            }
        } else {
            e.preventDefault()
        }
        var title = textarea.current.value
        store.add(title)
        textarea.current.value = ''
    }
    return <form className='addTask' onSubmit={addTask}>
        <p className='input'><span className="hint">任务:</span>
            <textarea placeholder="安排新任务吧。。。" onKeyPress={addTask}
                ref={textarea}></textarea></p>
        <p><button type='submit'>保存任务</button></p>
    </form>
}

export default TodoForm
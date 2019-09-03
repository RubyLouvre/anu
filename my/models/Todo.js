import { observable, action, computed } from 'mobx'

class Todo {
    @observable title = '';
    @observable finished = false;
    id = `todo-${Math.random()}`
    constructor(title) {
        this.title = title
    }
}


class TodoList {
    @observable todos = [];
    @computed get finishedCount() {
        return this.todos.filter(todo => todo.finished).length;
    }

    @action remove(todo) {
        this.todos.remove(todo)
    }
    @action add(title) {
        if (title) {
            this.todos.push(new Todo(title));
        }
    }
}

const store = new TodoList();
export default store;
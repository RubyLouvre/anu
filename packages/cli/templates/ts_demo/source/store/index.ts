import { observable, action } from 'mobx';
class Store {
    @observable text = 'hello typescript!';
    @action.bound
    addText() {
        this.text += '!';
    }
}
export default Store;
import { observable, action, computed } from 'mobx';
class Store {
    @observable num = 0;
    @action.bound
    add() {
        this.num++;
    }
    @action.bound
    minus() {
        this.num--;
    }
    @computed get result() {
        return this.num + 100;
    }
}
export default Store;
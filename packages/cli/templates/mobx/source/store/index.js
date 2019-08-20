import { observable, action, computed } from 'mobx';
class Store {
    @observable num = 0;
    @observable inputVal = 1;
    @action.bound
    add() {
        this.num++;
    }
    @action.bound
    minus() {
        this.num--;
    }
    @action.bound
    change(num) {
        console.log(num);
        this.inputVal = num;
    }
    @computed get result() {
        return this.num + this.inputVal;
    }
}
export default Store;
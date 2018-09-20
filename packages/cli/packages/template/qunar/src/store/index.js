import { init } from '@rematch/core';
import count from './countModel';
//我们这样引入数据模板，数据模板包含初始值及操作它们的方法
//import person from './personModel';
//import dog from './dognModel';

const store = init({
    models: { 
        count
     }
});
/*
//将所有模型放入全局store中
const store = init({
    models: { 
        count,
        person,
        dog
     }
});

*/

export default store;

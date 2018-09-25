function _uuid(){
    return (Math.random()+'').slice(-4);
}
export var  delayMounts = [];
export function getUUID(){
    return _uuid()+_uuid();
}
//用于保存所有用miniCreateClass创建的类，然后在事件系统中用到
export var classCached = {};

export function newData(){
    return {
        components: {}
    };
}
export var currentPage = {
    value: {
        props: {}
    }
};
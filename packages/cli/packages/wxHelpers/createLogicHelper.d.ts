declare function createLogicHelper(prefix: string, keyName: string, hasDefaultKey: boolean): (expr: any, modules: any, isText?: boolean) => any;
export default createLogicHelper;

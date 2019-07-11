export interface Ref{
    [propName: string]: any
}
export interface booleanFn{
    (arg: any): boolean
}
export interface stringConvert<T>{
    (arg: T): T;
}
export type Primitive = number | string | boolean
export type Nil = null | void


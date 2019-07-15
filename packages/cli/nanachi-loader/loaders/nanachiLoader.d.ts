export interface NanachiQueue {
    code: string;
    path: string;
    type: string;
    ast?: any;
}
export interface NanachiLoaderStruct {
    queues: Array<NanachiQueue>;
    exportCode: string;
}

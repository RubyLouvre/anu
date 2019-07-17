export interface NanachiQueue {
    code: string;
    path: string;
    type: string;
    ast?: any;
    extraModules?: Array<string>;
}
export interface NanachiLoaderStruct {
    queues: Array<NanachiQueue>;
    exportCode: string;
}

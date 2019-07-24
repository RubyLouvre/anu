import Timer from '../timer';
import { Log } from './queue';
export declare const getSize: (code: string) => string;
export declare const successLog: (filepath: string, code: string) => void;
export declare const timerLog: (timer: Timer) => void;
export declare const warningLog: ({ id, msg, loc }: Log) => void;
export declare const errorLog: ({ id, msg, loc }: Log) => void;
export declare const resetNum: () => void;

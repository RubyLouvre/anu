export interface CmdOption {
    readonly desc: string;
    readonly alias?: string;
}
export interface CmdMap {
    readonly [commandName: string]: CmdOption;
}
declare const BUILD_OPTIONS: CmdMap;
export default BUILD_OPTIONS;

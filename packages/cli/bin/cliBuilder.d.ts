import { CmdMap } from '../consts/buildOptions';
interface CliBuilderInterface {
    addCommand(commandName: string, aliaName: string | null, description: string, options: CmdMap, callback: (...options: any[]) => void): void;
    run(): void;
    checkNodeVersion(version: string): void;
}
declare class CliBuilder implements CliBuilderInterface {
    private __version;
    private __program;
    constructor();
    addCommand(commandName: string, alias: string | null, description: string, options: CmdMap, callback: (...options: any[]) => void): void;
    version: string;
    checkNodeVersion(version: string): void;
    run(): void;
}
export default CliBuilder;

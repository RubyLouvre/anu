declare class NanachiWebpackPlugin {
    constructor({ platform, compress, beta, betaUi }?: {
        platform?: string;
        compress?: boolean;
        beta: any;
        betaUi: any;
    });
    apply(compiler: any): void;
}
export default NanachiWebpackPlugin;

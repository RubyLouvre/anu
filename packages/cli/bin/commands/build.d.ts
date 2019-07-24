interface BulidOptions {
    watch: boolean;
    buildType: string;
    [props: string]: any;
}
export default function (args: BulidOptions): Promise<void>;
export {};

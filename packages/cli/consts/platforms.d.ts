export interface Platform {
    buildType: string;
    des: string;
    isDefault?: boolean;
}
declare const platforms: Array<Platform>;
export default platforms;

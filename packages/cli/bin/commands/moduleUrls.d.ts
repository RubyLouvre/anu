declare const URLS: {
    "getVersionsUrl": string;
    "moduleGitUrl": string;
    "packageUrl": string;
    "prefix": string;
};
declare function patchOldChaikaDownLoad(name: string, downLoadGitRepo: any, downLoadBinaryLib: any): void;

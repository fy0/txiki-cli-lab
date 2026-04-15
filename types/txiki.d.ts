declare global {
    namespace tjs {
        const args: readonly string[];
        const cwd: string;
        const exePath: string;
        const hostName: string;
        const pid: number;
        const version: string;

        namespace engine {
            const versions: {
                readonly quickjs: string;
                readonly tjs: string;
                readonly uv: string;
                readonly wasm3: string;
                readonly sqlite3: string;
                readonly mimalloc?: string;
            };
        }

        interface StatResult {
            readonly size: number;
            readonly isFile: boolean;
            readonly isDirectory: boolean;
        }

        function readFile(path: string): Promise<Uint8Array>;
        function stat(path: string): Promise<StatResult>;
        function exit(code: number): never;
    }

    interface NavigatorUAData {
        architecture?: string;
        platform?: string;
    }

    interface Navigator {
        readonly userAgentData?: NavigatorUAData;
    }

    interface ImportMeta {
        readonly path: string;
    }
}



declare module 'tjs:path' {
    interface PathModule {
        basename(path: string): string;
        join(...paths: string[]): string;
        resolve(...paths: string[]): string;
    }

    const path: PathModule;
    export default path;
}

declare module 'tjs:hashing' {
    export interface HashObj {
        update(data: string | ArrayBuffer | ArrayBufferView): HashObj;
        digest(): string;
    }

    export function createHash(type: 'sha256'): HashObj;
}

export {};

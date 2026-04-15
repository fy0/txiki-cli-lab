declare global {
    namespace tjs {
        const args: readonly string[];
        const cwd: string;
        const exePath: string;
        const hostName: string;
        const pid: number;
        const tmpDir: string;
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

        interface ServeOptions {
            fetch: (request: Request) => Response | Promise<Response>;
            port?: number;
            listenIp?: string;
        }

        interface MakeDirOptions {
            recursive?: boolean;
        }

        interface RemoveOptions {
            recursive?: boolean;
        }

        interface ProcessStatus {
            exit_status: number | null;
            term_signal: string | null;
        }

        interface ProcessReadableStream {
            text(): Promise<string>;
        }

        interface Process {
            wait(): Promise<ProcessStatus>;
            stdout: ProcessReadableStream | null;
            stderr: ProcessReadableStream | null;
        }

        interface ProcessOptions {
            stdout?: 'pipe' | 'ignore';
            stderr?: 'pipe' | 'ignore';
        }

        function makeDir(path: string, options?: MakeDirOptions): Promise<void>;
        function readFile(path: string): Promise<Uint8Array>;
        function remove(path: string, options?: RemoveOptions): Promise<void>;
        function spawn(args: string | string[], options?: ProcessOptions): Process;
        function stat(path: string): Promise<StatResult>;
        function serve(options: ServeOptions): { readonly port: number; close(): void };
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

    interface TxikiCliLabContext {
        readonly command: 'run';
        readonly file: string;
        readonly cwd: string;
        readonly args: readonly string[];
    }

    var txikiCliLab: TxikiCliLabContext | undefined;
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

declare module 'tjs:wasi' {
    export class WASI {
        constructor(options: {
            version: 'wasi_snapshot_preview1';
            args?: string[];
        });

        getImportObject(): WebAssembly.Imports;
        start(instance: WebAssembly.Instance): void;
    }
}

export {};

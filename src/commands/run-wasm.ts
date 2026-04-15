import path from 'tjs:path';
import { WASI } from 'tjs:wasi';

import { CliError, formatErrorMessage } from '../lib/errors.ts';

function hasWasiImports(module: WebAssembly.Module): boolean {
    return WebAssembly.Module.imports(module).some(entry => entry.module === 'wasi_snapshot_preview1');
}

function formatExportList(module: WebAssembly.Module): string {
    return WebAssembly.Module.exports(module)
        .map(entry => entry.name)
        .join(', ');
}

async function resolveWasmFile(inputPath: string): Promise<string> {
    const resolvedPath = path.resolve(tjs.cwd, inputPath);

    let stat;
    try {
        stat = await tjs.stat(resolvedPath);
    } catch (error) {
        throw new CliError(1, `Failed to stat "${inputPath}": ${formatErrorMessage(error)}`);
    }

    if (!stat.isFile) {
        throw new CliError(1, `Not a regular file: ${inputPath}`);
    }

    if (!resolvedPath.toLowerCase().endsWith('.wasm')) {
        throw new CliError(2, `Unsupported wasm type: ${inputPath}. Use a .wasm file.`);
    }

    return resolvedPath;
}

export async function runWasmCommand(args: string[]): Promise<void> {
    if (args.length < 1) {
        throw new CliError(2, 'Usage: txiki-cli-lab run-wasm <file.wasm> [args...]');
    }

    const [ inputPath, ...wasmArgs ] = args;
    const resolvedPath = await resolveWasmFile(inputPath);

    let bytes;
    try {
        bytes = await tjs.readFile(resolvedPath);
    } catch (error) {
        throw new CliError(1, `Failed to read "${inputPath}": ${formatErrorMessage(error)}`);
    }

    let module;
    try {
        module = new WebAssembly.Module(bytes);
    } catch (error) {
        throw new CliError(1, `Failed to compile wasm module "${inputPath}": ${formatErrorMessage(error)}`);
    }

    try {
        if (hasWasiImports(module)) {
            const wasi = new WASI({
                version: 'wasi_snapshot_preview1',
                args: [ path.basename(resolvedPath), ...wasmArgs ],
            });
            const instance = new WebAssembly.Instance(module, wasi.getImportObject());

            wasi.start(instance);
            return;
        }

        const instance = new WebAssembly.Instance(module, {});
        const exports = instance.exports as Record<string, unknown>;
        const start = exports._start;
        const main = exports.main;

        if (typeof start === 'function') {
            const result = start();

            if (result !== undefined) {
                console.log(String(result));
            }
            return;
        }

        if (typeof main === 'function') {
            const result = main();

            if (result !== undefined) {
                console.log(String(result));
            }
            return;
        }

        const exportList = formatExportList(module);

        if (exportList.length === 0) {
            return;
        }

        throw new CliError(1, `No runnable wasm entrypoint found in "${inputPath}". Exports: ${exportList}`);
    } catch (error) {
        if (error instanceof CliError) {
            throw error;
        }

        throw new CliError(1, `Failed to run wasm module "${inputPath}": ${formatErrorMessage(error)}`);
    }
}

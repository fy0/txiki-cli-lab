import path from 'tjs:path';

import { CliError, formatErrorMessage } from '../lib/errors.ts';

type RunContext = {
    readonly command: 'run';
    readonly file: string;
    readonly cwd: string;
    readonly args: readonly string[];
};

function isSupportedScript(inputPath: string): boolean {
    const lower = inputPath.toLowerCase();
    return lower.endsWith('.js') || lower.endsWith('.mjs');
}

async function resolveScriptFile(inputPath: string): Promise<string> {
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

    if (!isSupportedScript(resolvedPath)) {
        throw new CliError(2, `Unsupported script type: ${inputPath}. Use a .js or .mjs file.`);
    }

    return resolvedPath;
}

export async function runScriptCommand(args: string[]): Promise<void> {
    if (args.length < 1) {
        throw new CliError(2, 'Usage: txiki-cli-lab run <file.js> [args...]');
    }

    const [ inputPath, ...scriptArgs ] = args;
    const resolvedPath = await resolveScriptFile(inputPath);
    const context: RunContext = Object.freeze({
        command: 'run',
        file: resolvedPath,
        cwd: tjs.cwd,
        args: [ ...scriptArgs ],
    });

    globalThis.txikiCliLab = context;

    try {
        await import(resolvedPath);
    } catch (error) {
        throw new CliError(1, `Failed to run script "${inputPath}": ${formatErrorMessage(error)}`);
    } finally {
        globalThis.txikiCliLab = undefined;
    }
}

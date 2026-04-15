import path from 'tjs:path';

import { CliError, formatErrorMessage } from '../lib/errors.ts';
import { detectPlatform } from '../lib/platform.ts';

type RunContext = {
    readonly command: 'run';
    readonly file: string;
    readonly cwd: string;
    readonly args: readonly string[];
};

type ProcessResult = {
    readonly code: number | null;
    readonly stdout: string;
    readonly stderr: string;
};

type PreparedScript = {
    readonly importPath: string;
    readonly cleanupPath?: string;
};

function getScriptKind(inputPath: string): 'javascript' | 'typescript' | null {
    const lower = inputPath.toLowerCase();

    if (lower.endsWith('.js') || lower.endsWith('.mjs')) {
        return 'javascript';
    }

    if (lower.endsWith('.ts') || lower.endsWith('.mts')) {
        return 'typescript';
    }

    return null;
}

function getEsbuildCandidates(): string[] {
    if (detectPlatform() === 'windows') {
        return [ 'esbuild.cmd', 'esbuild.exe', 'esbuild' ];
    }

    return [ 'esbuild' ];
}

function isMissingCommand(error: unknown): boolean {
    return formatErrorMessage(error).includes('ENOENT');
}

async function runProcess(args: string[]): Promise<ProcessResult> {
    const proc = tjs.spawn(args, { stdout: 'pipe', stderr: 'pipe' });
    const [ status, stdout, stderr ] = await Promise.all([
        proc.wait(),
        proc.stdout?.text() ?? Promise.resolve(''),
        proc.stderr?.text() ?? Promise.resolve(''),
    ]);

    return {
        code: status.exit_status,
        stdout,
        stderr,
    };
}

async function resolveScriptFile(inputPath: string): Promise<{ resolvedPath: string; kind: 'javascript' | 'typescript' }> {
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

    const kind = getScriptKind(resolvedPath);

    if (!kind) {
        throw new CliError(2, `Unsupported script type: ${inputPath}. Use a .js, .mjs, .ts, or .mts file.`);
    }

    return { resolvedPath, kind };
}

async function bundleTypeScript(inputPath: string): Promise<PreparedScript> {
    const tempDir = path.join(
        tjs.tmpDir,
        `txiki-cli-lab-run-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    );
    const bundlePath = path.join(tempDir, 'bundle.mjs');

    await tjs.makeDir(tempDir, { recursive: true });

    const args = [
        inputPath,
        '--bundle',
        '--platform=neutral',
        '--format=esm',
        '--target=esnext',
        '--main-fields=main,module',
        '--external:tjs:*',
        '--log-level=warning',
        `--outfile=${bundlePath}`,
    ];

    let lastError: string | null = null;

    for (const candidate of getEsbuildCandidates()) {
        try {
            const result = await runProcess([ candidate, ...args ]);

            if (result.code === 0) {
                return {
                    importPath: bundlePath,
                    cleanupPath: tempDir,
                };
            }

            lastError = result.stderr.trim() || result.stdout.trim() || `esbuild exited with code ${result.code}`;
            break;
        } catch (error) {
            if (isMissingCommand(error)) {
                continue;
            }

            lastError = formatErrorMessage(error);
            break;
        }
    }

    try {
        await tjs.remove(tempDir, { recursive: true });
    } catch {
        // Best-effort cleanup for failed bundle attempts.
    }

    if (!lastError) {
        throw new CliError(2, 'TypeScript execution requires esbuild in PATH. Install esbuild and retry.');
    }

    throw new CliError(1, `Failed to transpile TypeScript script "${inputPath}": ${lastError}`);
}

async function prepareScript(inputPath: string): Promise<PreparedScript> {
    const { resolvedPath, kind } = await resolveScriptFile(inputPath);

    if (kind === 'javascript') {
        return { importPath: resolvedPath };
    }

    return bundleTypeScript(resolvedPath);
}

export async function runScriptCommand(args: string[]): Promise<void> {
    if (args.length < 1) {
        throw new CliError(2, 'Usage: txiki-cli-lab run <file.js|file.ts> [args...]');
    }

    const [ inputPath, ...scriptArgs ] = args;
    const preparedScript = await prepareScript(inputPath);
    const context: RunContext = Object.freeze({
        command: 'run',
        file: path.resolve(tjs.cwd, inputPath),
        cwd: tjs.cwd,
        args: [ ...scriptArgs ],
    });

    globalThis.txikiCliLab = context;

    try {
        await import(preparedScript.importPath);
    } catch (error) {
        throw new CliError(1, `Failed to run script "${inputPath}": ${formatErrorMessage(error)}`);
    } finally {
        globalThis.txikiCliLab = undefined;

        if (preparedScript.cleanupPath) {
            try {
                await tjs.remove(preparedScript.cleanupPath, { recursive: true });
            } catch {
                // Best-effort cleanup for transpiled TypeScript bundles.
            }
        }
    }
}

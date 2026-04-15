import path from 'tjs:path';

import { CliError, formatErrorMessage } from './errors.ts';
import { detectPlatform } from './platform.ts';

export type ScriptCommand = 'run' | 'run-http';

export type RunContext = {
    readonly command: ScriptCommand;
    readonly file: string;
    readonly cwd: string;
    readonly args: readonly string[];
};

type ProcessResult = {
    readonly code: number | null;
    readonly stdout: string;
    readonly stderr: string;
};

export type PreparedScript = {
    readonly importPath: string;
    readonly resolvedPath: string;
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
                    resolvedPath: inputPath,
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

export async function prepareScript(inputPath: string): Promise<PreparedScript> {
    const { resolvedPath, kind } = await resolveScriptFile(inputPath);

    if (kind === 'javascript') {
        return {
            importPath: resolvedPath,
            resolvedPath,
        };
    }

    return bundleTypeScript(resolvedPath);
}

export function createRunContext(command: ScriptCommand, file: string, args: string[]): RunContext {
    return Object.freeze({
        command,
        file,
        cwd: tjs.cwd,
        args: [ ...args ],
    });
}

export async function cleanupPreparedScript(preparedScript: PreparedScript): Promise<void> {
    if (!preparedScript.cleanupPath) {
        return;
    }

    try {
        await tjs.remove(preparedScript.cleanupPath, { recursive: true });
    } catch {
        // Best-effort cleanup for transpiled TypeScript bundles.
    }
}

import { CliError, formatErrorMessage } from '../lib/errors.ts';
import { cleanupPreparedScript, createRunContext, prepareScript } from '../lib/script-loader.ts';

import type { RunContext } from '../lib/script-loader.ts';

type FetchHandler = (request: Request, context: RunContext) => Response | Promise<Response>;

type HandlerModule = {
    default?: FetchHandler | { fetch?: FetchHandler; port?: number; listenIp?: string };
    fetch?: FetchHandler;
    port?: number;
    listenIp?: string;
};

function isPortArg(input: string | undefined): input is string {
    return input !== undefined && /^\d+$/.test(input);
}

function parsePort(input: string): number {
    const value = Number.parseInt(input, 10);

    if (value < 0 || value > 65535) {
        throw new CliError(2, `Invalid port: ${input}`);
    }

    return value;
}

function extractHandler(module: HandlerModule): { fetch: FetchHandler; port?: number; listenIp?: string } {
    if (typeof module.default === 'function') {
        return { fetch: module.default };
    }

    if (module.default && typeof module.default === 'object' && typeof module.default.fetch === 'function') {
        return {
            fetch: module.default.fetch,
            port: module.default.port,
            listenIp: module.default.listenIp,
        };
    }

    if (typeof module.fetch === 'function') {
        return {
            fetch: module.fetch,
            port: module.port,
            listenIp: module.listenIp,
        };
    }

    throw new CliError(
        2,
        'HTTP script must export a default fetch function, a default object with fetch(), or a named fetch() export.',
    );
}

export async function runHttpCommand(args: string[]): Promise<void> {
    if (args.length < 1) {
        throw new CliError(2, 'Usage: txiki-cli-lab run-http <file.js|file.ts> [port] [args...]');
    }

    const [ inputPath, maybePort, ...restArgs ] = args;
    const parsedPort = isPortArg(maybePort) ? parsePort(maybePort) : undefined;
    const scriptArgs = parsedPort === undefined ? args.slice(1) : restArgs;
    const preparedScript = await prepareScript(inputPath);
    const context = createRunContext('run-http', preparedScript.resolvedPath, scriptArgs);

    globalThis.txikiCliLab = context;

    try {
        const module = await import(preparedScript.importPath) as HandlerModule;
        const handler = extractHandler(module);
        const server = tjs.serve({
            fetch: request => handler.fetch(request, context),
            listenIp: handler.listenIp ?? '127.0.0.1',
            port: parsedPort ?? handler.port ?? 3000,
        });

        console.log(`Listening on http://${handler.listenIp ?? '127.0.0.1'}:${server.port}/`);
        await server.closed;
    } catch (error) {
        if (error instanceof CliError) {
            throw error;
        }

        throw new CliError(1, `Failed to run HTTP script "${inputPath}": ${formatErrorMessage(error)}`);
    } finally {
        globalThis.txikiCliLab = undefined;
        await cleanupPreparedScript(preparedScript);
    }
}

import path from 'tjs:path';

import { runFetchCommand } from './commands/fetch.ts';
import { runInfoCommand } from './commands/info.ts';
import { runScriptCommand } from './commands/run.ts';
import { runWasmCommand } from './commands/run-wasm.ts';
import { runSha256Command } from './commands/sha256.ts';
import { APP_NAME, APP_VERSION } from './lib/constants.ts';
import { CliError, formatErrorMessage } from './lib/errors.ts';
import { printJson } from './lib/output.ts';

const HELP_TEXT = `Usage: ${APP_NAME} <command> [options]

Commands:
  info                 Print runtime and host information as JSON
  sha256 <file>        Print the SHA-256 digest for a file as JSON
  fetch <url>          Fetch a URL and print a response summary as JSON
  run <file.js|file.ts> Run a local script; TypeScript needs esbuild in PATH
  run-wasm <file.wasm> Run a local wasm module

Options:
  -h, --help           Show help
  -v, --version        Show application version
`;

function matchesPath(candidate: string, expected: string): boolean {
    try {
        return path.resolve(candidate) === path.resolve(expected);
    } catch {
        return candidate === expected;
    }
}

function normalizeArgs(rawArgs: readonly string[], currentEntryPath: string): string[] {
    let args = [ ...rawArgs ];

    if (
        args[0]
        && (
            matchesPath(args[0], tjs.exePath)
            || path.basename(args[0]).toLowerCase() === path.basename(tjs.exePath).toLowerCase()
        )
    ) {
        args = args.slice(1);
    }

    if (args[0] === 'run' && args[1] && matchesPath(args[1], currentEntryPath)) {
        args = args.slice(1);
    }

    if (args[0] && matchesPath(args[0], currentEntryPath)) {
        args = args.slice(1);
    }

    return args;
}

async function main(): Promise<void> {
    const args = normalizeArgs(tjs.args, import.meta.path);
    const [ command, ...rest ] = args;

    if (!command || command === 'help' || command === '-h' || command === '--help') {
        console.log(HELP_TEXT.trimEnd());
        return;
    }

    if (command === 'version' || command === '-v' || command === '--version') {
        console.log(`${APP_NAME} ${APP_VERSION}`);
        return;
    }

    switch (command) {
        case 'info':
            printJson(runInfoCommand(rest));
            return;
        case 'sha256':
            printJson(await runSha256Command(rest));
            return;
        case 'fetch':
            printJson(await runFetchCommand(rest));
            return;
        case 'run':
            await runScriptCommand(rest);
            return;
        case 'run-wasm':
            await runWasmCommand(rest);
            return;
        default:
            throw new CliError(2, `Unknown command: ${command}

${HELP_TEXT.trimEnd()}`);
    }
}

try {
    await main();
} catch (error) {
    const exitCode = error instanceof CliError ? error.exitCode : 1;
    const message = error instanceof CliError
        ? error.message
        : `Unhandled error: ${formatErrorMessage(error)}`;

    console.error(message);
    tjs.exit(exitCode);
}

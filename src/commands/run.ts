import { CliError, formatErrorMessage } from '../lib/errors.ts';
import { cleanupPreparedScript, createRunContext, prepareScript } from '../lib/script-loader.ts';

export async function runScriptCommand(args: string[]): Promise<void> {
    if (args.length < 1) {
        throw new CliError(2, 'Usage: txiki-cli-lab run <file.js|file.ts> [args...]');
    }

    const [ inputPath, ...scriptArgs ] = args;
    const preparedScript = await prepareScript(inputPath);

    globalThis.txikiCliLab = createRunContext('run', preparedScript.resolvedPath, scriptArgs);

    try {
        await import(preparedScript.importPath);
    } catch (error) {
        throw new CliError(1, `Failed to run script "${inputPath}": ${formatErrorMessage(error)}`);
    } finally {
        globalThis.txikiCliLab = undefined;
        await cleanupPreparedScript(preparedScript);
    }
}

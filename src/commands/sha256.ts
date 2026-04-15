import path from 'tjs:path';
import { createHash } from 'tjs:hashing';

import { CliError, formatErrorMessage } from '../lib/errors.ts';

export async function runSha256Command(args: string[]): Promise<Record<string, unknown>> {
    if (args.length !== 1) {
        throw new CliError(2, 'Usage: txiki-cli-lab sha256 <file>');
    }

    const inputPath = args[0];
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

    let bytes;
    try {
        bytes = await tjs.readFile(resolvedPath);
    } catch (error) {
        throw new CliError(1, `Failed to read "${inputPath}": ${formatErrorMessage(error)}`);
    }

    const digest = createHash('sha256').update(bytes).digest();

    return {
        command: 'sha256',
        path: resolvedPath,
        bytes: stat.size,
        sha256: digest,
    };
}

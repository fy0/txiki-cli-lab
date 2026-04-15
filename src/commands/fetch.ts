import { CliError, formatErrorMessage } from '../lib/errors.ts';

function pickHeaderMap(headers: Headers): Record<string, string> {
    const names = [ 'content-type', 'content-length', 'etag', 'server' ];
    const result: Record<string, string> = {};

    for (const name of names) {
        const value = headers.get(name);

        if (value !== null) {
            result[name] = value;
        }
    }

    return result;
}

export async function runFetchCommand(args: string[]): Promise<Record<string, unknown>> {
    if (args.length !== 1) {
        throw new CliError(2, 'Usage: txiki-cli-lab fetch <url>');
    }

    let targetUrl: URL;
    try {
        targetUrl = new URL(args[0]);
    } catch {
        throw new CliError(2, `Invalid URL: ${args[0]}`);
    }

    const startedAt = performance.now();

    let response: Response;
    try {
        response = await fetch(targetUrl.toString());
    } catch (error) {
        throw new CliError(1, `Request failed: ${formatErrorMessage(error)}`);
    }

    const body = new Uint8Array(await response.arrayBuffer());
    const durationMs = Number((performance.now() - startedAt).toFixed(2));

    return {
        command: 'fetch',
        requestedUrl: targetUrl.toString(),
        finalUrl: response.url,
        ok: response.ok,
        status: response.status,
        redirected: response.redirected,
        durationMs,
        bytes: body.byteLength,
        contentType: response.headers.get('content-type'),
        headers: pickHeaderMap(response.headers),
    };
}

import path from 'tjs:path';

function matchesPath(candidate, expected) {
    try {
        return path.resolve(candidate) === path.resolve(expected);
    } catch {
        return candidate === expected;
    }
}

function normalizeArgs(rawArgs, currentEntryPath) {
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

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

async function runProcess(args) {
    const proc = tjs.spawn(args, { stdout: 'pipe', stderr: 'pipe' });
    const [ status, stdout, stderr ] = await Promise.all([
        proc.wait(),
        proc.stdout.text(),
        proc.stderr.text(),
    ]);

    return {
        code: status.exit_status,
        signal: status.term_signal,
        stdout,
        stderr,
    };
}

async function runJson(binaryPath, args) {
    const result = await runProcess([ binaryPath, ...args ]);

    assert(result.code === 0, `command failed: ${args.join(' ')}
${result.stderr}`);

    try {
        return JSON.parse(result.stdout);
    } catch (error) {
        throw new Error(`failed to parse JSON output for ${args.join(' ')}: ${error}`);
    }
}

async function main() {
    const args = normalizeArgs(tjs.args, import.meta.path);
    const [ binaryArg, expectedVersion = '0.0.0-dev' ] = args;

    if (!binaryArg) {
        throw new Error('usage: smoke.js <compiled-binary> [expected-version]');
    }

    const binaryPath = path.resolve(tjs.cwd, binaryArg);
    const fixtureArg = path.join('fixtures', 'sample.txt');
    const expectedDigest = new TextDecoder().decode(
        await tjs.readFile(path.resolve(tjs.cwd, 'fixtures', 'sample.sha256'))
    ).trim();

    const versionResult = await runProcess([ binaryPath, '--version' ]);
    assert(versionResult.code === 0, '--version should exit 0');
    assert(versionResult.stdout.trim() === `txiki-cli-lab ${expectedVersion}`, '--version output mismatch');

    const info = await runJson(binaryPath, [ 'info' ]);
    assert(info.app.name === 'txiki-cli-lab', 'info.app.name mismatch');
    assert(info.app.version === expectedVersion, 'info.app.version mismatch');
    assert(typeof info.system.platform === 'string' && info.system.platform.length > 0, 'info.system.platform missing');
    assert(typeof info.system.architecture === 'string' && info.system.architecture.length > 0, 'info.system.architecture missing');

    const sha = await runJson(binaryPath, [ 'sha256', fixtureArg ]);
    assert(sha.sha256 === expectedDigest, 'sha256 digest mismatch');

    const serverBody = 'smoke server response';
    const server = tjs.serve({
        listenIp: '127.0.0.1',
        port: 0,
        fetch(request) {
            const url = new URL(request.url);

            if (url.pathname === '/sample.txt') {
                return new Response(serverBody, {
                    headers: {
                        'content-type': 'text/plain; charset=utf-8',
                    },
                });
            }

            return new Response('not found', { status: 404 });
        },
    });

    try {
        const fetchResult = await runJson(binaryPath, [ 'fetch', `http://127.0.0.1:${server.port}/sample.txt` ]);
        assert(fetchResult.status === 200, 'fetch status mismatch');
        assert(fetchResult.bytes === serverBody.length, 'fetch byte count mismatch');
        assert(String(fetchResult.contentType).startsWith('text/plain'), 'fetch content type mismatch');
    } finally {
        server.close();
    }

    const scriptResult = await runProcess([
        binaryPath,
        'run',
        path.join('fixtures', 'run-script.js'),
        'alpha',
        'beta',
    ]);
    assert(scriptResult.code === 0, `run command failed: ${scriptResult.stderr}`);
    const scriptJson = JSON.parse(scriptResult.stdout);
    assert(scriptJson.command === 'run', 'run script command mismatch');
    assert(scriptJson.file === 'run-script.js', 'run script file mismatch');
    assert(Array.isArray(scriptJson.args), 'run script args missing');
    assert(scriptJson.args.join(',') === 'alpha,beta', 'run script args mismatch');

    const wasmResult = await runProcess([ binaryPath, 'run-wasm', path.join('fixtures', 'answer.wasm') ]);
    assert(wasmResult.code === 0, `run-wasm command failed: ${wasmResult.stderr}`);
    assert(wasmResult.stdout.trim() === '42', 'run-wasm output mismatch');

    const missingFileResult = await runProcess([ binaryPath, 'sha256', 'does-not-exist.txt' ]);
    assert(missingFileResult.code !== 0, 'missing file should fail');
    assert(missingFileResult.stderr.includes('Failed to stat'), 'missing file error message mismatch');

    const invalidUrlResult = await runProcess([ binaryPath, 'fetch', 'not-a-url' ]);
    assert(invalidUrlResult.code !== 0, 'invalid URL should fail');
    assert(invalidUrlResult.stderr.includes('Invalid URL'), 'invalid URL error message mismatch');

    const invalidScriptResult = await runProcess([ binaryPath, 'run', path.join('fixtures', 'sample.txt') ]);
    assert(invalidScriptResult.code !== 0, 'invalid script type should fail');
    assert(invalidScriptResult.stderr.includes('Unsupported script type'), 'invalid script error mismatch');

    console.log('smoke tests passed');
}

await main();

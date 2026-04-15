const target = globalThis.txikiCliLab?.args[0] ?? 'https://example.com';
const startedAt = performance.now();
const response = await fetch(target);
const body = new Uint8Array(await response.arrayBuffer());

console.log(JSON.stringify({
    target,
    status: response.status,
    contentType: response.headers.get('content-type'),
    bytes: body.length,
    durationMs: Number((performance.now() - startedAt).toFixed(2)),
}, null, 2));

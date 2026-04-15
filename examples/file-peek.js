const target = globalThis.txikiCliLab?.args[0] ?? 'README.md';
const bytes = await tjs.readFile(target);
const text = new TextDecoder().decode(bytes);
const lines = text.split(/?
/).slice(0, 3);

console.log(JSON.stringify({
    target,
    bytes: bytes.length,
    preview: lines,
}, null, 2));

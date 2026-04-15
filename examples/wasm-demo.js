const target = globalThis.txikiCliLab?.args[0] ?? 'examples/answer.wasm';
const bytes = await tjs.readFile(target);
const module = new WebAssembly.Module(bytes);
const instance = new WebAssembly.Instance(module, {});
const main = instance.exports.main;

if (typeof main !== 'function') {
    throw new Error('expected a main() export');
}

console.log(`wasm main() => ${main()}`);

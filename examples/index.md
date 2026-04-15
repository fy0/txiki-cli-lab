# Example scripts

These examples are meant to be launched with the compiled CLI.

## General script demos

```bash
txiki-cli-lab run examples/echo-context.js
txiki-cli-lab run examples/file-peek.js README.md
txiki-cli-lab run examples/fetch-summary.js https://example.com
txiki-cli-lab run examples/hello.ts demo mode
txiki-cli-lab run examples/wasm-demo.js examples/answer.wasm
```

## HTTP demos

```bash
txiki-cli-lab run-http examples/http-hello.js 3000
# then open http://127.0.0.1:3000/

txiki-cli-lab run-http examples/http-state.ts 0 demo-mode
# the command prints the chosen port when using 0
```

## Files

- `echo-context.js` prints the injected `globalThis.txikiCliLab` payload.
- `file-peek.js` reads a file and prints a short preview.
- `fetch-summary.js` fetches a URL and prints a compact summary.
- `hello.ts` demonstrates on-demand TypeScript execution through `esbuild`.
- `wasm-demo.js` loads a local wasm module and calls `main()`.
- `http-hello.js` serves a small HTML page.
- `http-state.ts` serves JSON with request and argv data.

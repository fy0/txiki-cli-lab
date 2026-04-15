# txiki-cli-lab

A tiny experiment project for packaging a txiki.js CLI with GitHub Actions.

The goal is to prove a simple cross-platform release flow for:
- Linux x64 (`tar.gz`)
- Linux arm64 (`tar.gz`)
- Windows x64 (`zip`)

This repository intentionally stays small:
- TypeScript source with no npm dependency tree
- `tjs bundle` + `tjs compile` for the final executable
- GitHub Release assets on tag builds and Actions artifacts on manual runs

## Commands

```text
txiki-cli-lab info
txiki-cli-lab sha256 <file>
txiki-cli-lab fetch <url>
txiki-cli-lab run <file.js|file.ts> [args...]
txiki-cli-lab run-wasm <file.wasm> [args...]
txiki-cli-lab --help
txiki-cli-lab --version
```

### Examples

```bash
txiki-cli-lab info
txiki-cli-lab sha256 fixtures/sample.txt
txiki-cli-lab fetch http://127.0.0.1:8080/sample.txt
txiki-cli-lab run fixtures/run-script.js alpha beta
txiki-cli-lab run fixtures/run-typescript.ts alpha beta
txiki-cli-lab run-wasm fixtures/answer.wasm
```

## Playground commands

- `run <file.js|file.ts> [args...]` executes a local `.js`, `.mjs`, `.ts`, or `.mts` module.
- `.js` and `.mjs` run directly.
- `.ts` and `.mts` are transpiled on demand if `esbuild` is available on `PATH`.
- If `esbuild` is missing, the command prints a one-line install hint instead of silently failing.
- The launched script can inspect `globalThis.txikiCliLab` for the injected command context.
- `run-wasm <file.wasm> [args...]` runs a local wasm file.
- Extra arguments are forwarded to WASI modules; simple exported `main()` or `_start()` wasm modules also work.

## Demo scripts

The `examples/` directory is included in the repository and in release archives.

```bash
txiki-cli-lab run examples/echo-context.js
txiki-cli-lab run examples/file-peek.js README.md
txiki-cli-lab run examples/fetch-summary.js https://example.com
txiki-cli-lab run examples/hello.ts demo mode
txiki-cli-lab run examples/wasm-demo.js examples/answer.wasm
```

## Local development

The source is regular TypeScript, but the build uses txiki.js directly.
No `package.json` is required.

### Windows

Download the official `txiki-windows-x86_64.zip` from the txiki.js release page and extract it.
The workflow uses txiki.js `v26.4.0`:
https://github.com/saghul/txiki.js/releases/tag/v26.4.0

Build manually from PowerShell:

```powershell
$env:APP_VERSION = '0.0.0-dev'
$txiki = (Resolve-Path '.\.txiki.js	xiki-windows-x86_64	js.exe')
New-Item -ItemType Directory -Force build | Out-Null
& $txiki bundle --minify --sourcemap=inline src\main.ts build	xiki-cli-lab.bundle.js
$bundlePath = (Resolve-Path 'build	xiki-cli-lab.bundle.js')
$bundle = [System.IO.File]::ReadAllText($bundlePath)
$bundle = $bundle.Replace('__TXIKI_CLI_LAB_VERSION__', $env:APP_VERSION)
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($bundlePath, $bundle, $utf8NoBom)
& $txiki compile build	xiki-cli-lab.bundle.js build	xiki-cli-lab
.uild	xiki-cli-lab.exe info
```

### Linux

Build `tjs` first by following the official txiki.js build guide:
https://txikijs.org/docs/building

Once `tjs` is available:

```bash
mkdir -p build
./tjs bundle --minify --sourcemap=inline src/main.ts build/txiki-cli-lab.bundle.js
python3 - <<'PY'
from pathlib import Path
p = Path('build/txiki-cli-lab.bundle.js')
p.write_text(
    p.read_text().replace('__TXIKI_CLI_LAB_VERSION__', '0.0.0-dev'),
    newline='
',
)
PY
./tjs compile build/txiki-cli-lab.bundle.js build/txiki-cli-lab
./build/txiki-cli-lab info
```

### Smoke test

After building, run the repository smoke test with the runtime you used for the build:

```powershell
& $txiki run scripts\smoke.js build	xiki-cli-lab.exe 0.0.0-dev
```

```bash
./tjs run scripts/smoke.js build/txiki-cli-lab 0.0.0-dev
```

## GitHub Actions release flow

- `push` to `main`: build all targets, upload workflow artifacts, and refresh the shared `dev` prerelease tag
- `push` tag `v*`: build all targets, upload workflow artifacts, and publish a versioned GitHub Release
- `workflow_dispatch`: run the same pipeline manually for the selected ref

Archives contain:
- the compiled executable
- `README.md`
- `LICENSE`
- `examples/`

## Notes

- Linux releases are generic archives for mainstream glibc-based distributions, not `.deb` or `.rpm` packages.
- The project uses `tjs compile`, not the experimental `tjs app compile` / TPK flow.
- The `fetch` command prints a JSON summary instead of the full response body.

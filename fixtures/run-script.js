const fileName = globalThis.txikiCliLab?.file.split(/[\\/]/).pop() ?? null;

console.log(JSON.stringify({
    command: globalThis.txikiCliLab?.command ?? null,
    cwd: globalThis.txikiCliLab?.cwd ?? null,
    file: fileName,
    args: globalThis.txikiCliLab?.args ?? [],
}));

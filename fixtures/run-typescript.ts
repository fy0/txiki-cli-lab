import path from 'tjs:path';

const total: number = globalThis.txikiCliLab?.args.length ?? 0;
const label: string = `ts:${globalThis.txikiCliLab?.args.join('|') ?? ''}`;

console.log(JSON.stringify({
    command: globalThis.txikiCliLab?.command ?? null,
    file: globalThis.txikiCliLab?.file ? path.basename(globalThis.txikiCliLab.file) : null,
    args: globalThis.txikiCliLab?.args ?? [],
    total,
    label,
}));

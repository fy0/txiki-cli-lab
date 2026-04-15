type Greeting = {
    message: string;
    args: readonly string[];
};

const greeting: Greeting = {
    message: 'hello from TypeScript',
    args: globalThis.txikiCliLab?.args ?? [],
};

console.log(JSON.stringify(greeting, null, 2));

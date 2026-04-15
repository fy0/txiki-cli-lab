export class CliError extends Error {
    readonly exitCode: number;

    constructor(exitCode: number, message: string) {
        super(message);
        this.name = 'CliError';
        this.exitCode = exitCode;
    }
}

export function formatErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
        return error.message;
    }

    return String(error);
}

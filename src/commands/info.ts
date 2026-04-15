import { APP_NAME, APP_VERSION } from '../lib/constants.ts';
import { CliError } from '../lib/errors.ts';
import { detectArchitecture, detectPlatform } from '../lib/platform.ts';

export function runInfoCommand(args: string[]): Record<string, unknown> {
    if (args.length !== 0) {
        throw new CliError(2, 'Usage: txiki-cli-lab info');
    }

    return {
        app: {
            name: APP_NAME,
            version: APP_VERSION,
        },
        runtime: {
            txiki: tjs.version,
            libraries: tjs.engine.versions,
        },
        system: {
            platform: detectPlatform(),
            architecture: detectArchitecture(),
            cwd: tjs.cwd,
            executable: tjs.exePath,
            pid: tjs.pid,
            hostName: tjs.hostName,
        },
    };
}

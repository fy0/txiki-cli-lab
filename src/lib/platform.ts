type UserAgentData = {
    architecture?: string;
    platform?: string;
};

function getUserAgentData(): UserAgentData | undefined {
    return navigator.userAgentData;
}

export function detectPlatform(): string {
    const platform = getUserAgentData()?.platform?.toLowerCase();

    if (platform) {
        if (platform === 'macos') {
            return 'macos';
        }

        return platform;
    }

    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes('windows')) {
        return 'windows';
    }

    if (userAgent.includes('linux')) {
        return 'linux';
    }

    if (userAgent.includes('mac')) {
        return 'macos';
    }

    return 'unknown';
}

export function detectArchitecture(): string {
    const architecture = getUserAgentData()?.architecture?.toLowerCase();

    if (architecture) {
        return architecture;
    }

    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes('arm64') || userAgent.includes('aarch64')) {
        return 'arm64';
    }

    if (
        userAgent.includes('x86_64')
        || userAgent.includes('win64')
        || userAgent.includes('x64')
        || userAgent.includes('amd64')
    ) {
        return 'x64';
    }

    return 'unknown';
}

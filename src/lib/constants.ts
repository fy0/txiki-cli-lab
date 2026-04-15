export const APP_NAME = 'txiki-cli-lab';

const VERSION_TOKEN = '__TXIKI_CLI_LAB_VERSION__';

export const APP_VERSION = VERSION_TOKEN.startsWith('__')
    ? '0.0.0-dev'
    : VERSION_TOKEN;

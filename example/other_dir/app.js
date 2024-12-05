import config from 'config-in-files';

const server = await config.server;
console.log(server);
import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';

// get env
const env = process.env.NODE_ENV || '';

// get config dir
const configDir = process.env.CONFIG_DIR || './config';

const deepFreeze = obj => {
    Object.keys(obj).forEach(prop => {
        if (typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop])) deepFreeze(obj[prop]);
    });
    return Object.freeze(obj);
};

const proxyHandler = {
    get(target, filename, receiver) {
        const filepath = path.join(configDir, `${filename}.js`);
        const fileESM = url.pathToFileURL(filepath);

        return import(fileESM).then((data) => deepFreeze(data.default));
    },
};

const config = new Proxy(new Object(), proxyHandler);

export default config;

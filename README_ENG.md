# config-in-files

[UKR](./README.md)

A lightnes module for working with configurations in Node.js that provides easy organization of configuration files.

## Features

- **Structured**: The configurations are stored in separate files, which avoids confusion, as is the case with process.env.
- **Flexibile**: In the configuration, you can add logic for loading or generating values.
- **Simple**: Minimalistic API for quick integration.

## Usage

Save configurations as JavaScript files in the config folder. The file name becomes the key of the configuration object.

Configuration file:

```javascript
// project_dir/config/server.js
const config = { port: 8080 };

export default config;
```

Basic code:

```javascript
import config from 'config-in-files';

const { port } = await config.server;
console.log(port); // 8080
```

## Environment (Dev, Prod, etc.)

There are no built-in tools for working with different environments in config-in-files, but you can use NODE_ENV to manage different configurations for development.

Example:

```javascript
// project_dir/config/server.js

// Determining the environment based on NODE_ENV
const env = process.env.NODE_ENV;

// Selecting a parameter depending on the environment
const port = env === 'dev' ? 5000 : 8080;

// Create a configuration object
const config = { port };

// Exporting the configuration
export default config;
```

Usage:

```javascript
import config from 'config-in-files';

// Get the value from the configuration
const { port } = await config.server; 

console.log(port);

// If NODE_ENV is not specified, the default value is used
// { port: 8080 }

// If NODE_ENV=dev, then the value will be
// { port: 5000 }
```

## Loading logic

Configuration files can include asynchronous or synchronous loading logic.  For example, loading data from external files, such as cryptographic keys or certificates, or loading data from other sources - .env, API, etc.

Configuration file:

```javascript
// project_dir/config/auth.js
import path from 'node:path';
import fs from 'node:fs/promises';

// Set default values, if necessary
const envKey = process.env.PRIV_KEY || './keys/private.key';

// Define the project folder
const projectDir = process.cwd();

// Get the absolute path to the file
const keyPath = path.join(projectDir, envKey);

// Readed the contents of the file
const key = await fs.readFile(keyPath, 'utf-8');

// Create a configuration object
const config = {
  keys: {
    priv: key,
  },
};

// Exporting the configuration
export default config;
```

Basic code:

```javascript
import config from 'config-in-files';

const { priv } = await config.auth.keys;

console.log(priv); // Contents of the private key 
```

## Configuration files folder

config-in-files has minimal settings. By default, the module searches for configuration files in the config folder, but you can change this via CONFIG_DIR.

An example of configuring the configuration path for package.json:

```bash
cross-env CONFIG_DIR=custom-config node ./app.js
```

The module will search for configuration files in `project_dir/custom-config`.

## API

```Javascript
import config from 'config-in-files'
```

`config` is an asynchronous object containing a Proxy for downloading exported configuration files.

Each key corresponds to a configuration file name.

Example:

```javascript
import config from ‘config-in-files’;

const palaikuchkovoConfig = await config.palaikuchkovo;

// palaikuchkovoConfig contains exported data from config/palaikuchkovo.js
```

- Configuration modules are loaded at the time of the first access and cached.
- Data in the export of deep freeze configuration modules to prevent accidental changes to their contents.

# config-in-files

Легкий модуль для роботи з конфігураціями у Node.js, який забезпечує просту організацію конфігураційних файлів.

## Особливості

- Структурованість: Конфігурації зберігаються в 
- окремих файлах, що дозволяє уникнути плутанини в process.env.
- Гнучкість: У конфігурації можна додавати логіку завантаження або генерації значень.
- Простота: Мінімалістичний API для швидкої інтеграції.

## Використання

Зберігайте конфігурації у вигляді JavaScript-файлів у папці config. Ім’я файлу стає ключем об’єкта конфігурації.

Файли конфігурації:

```javascript
// project_dir/config/server.js
const config = { port: 8080 };
export default config;
```

Основний код:

```javascript
import config from 'config-in-files';

const { port } = await config.server;
console.log(port); // 8080
```

## Оточення (Dev, Prod та інші)

У config-in-files немає вбудованих інструментів для роботи з різними оточеннями, але ви все одно можете  використовувати змінну середовища NODE_ENV для управління різними конфігураціями для розробки.

Приклад:

```javascript
// project_dir/config/server.js

// Визначаємо середовище на основі NODE_ENV
const env = process.env.NODE_ENV;

// Вибір порту залежно від середовища
const port = env === 'dev' ? 5000 : 8080;

// Створюємо конфігураційний об'єкт
const config = { port };

// Експортуємо конфігурацію
export default config;
```

Використання:

```javascript
import config from 'config-in-files';

// Отримуємо значення порту з конфігурації
const { port } = await config.server; 

console.log(port);

// Якщо NODE_ENV не вказано, використовуватиметься значення за замовчуванням
// { port: 8080 }

// Якщо NODE_ENV=dev, то значення буде
// { port: 5000 }
```

## Логіка завантаження

Файли конфігурації можуть включати асинхронну чи синхронну логіку завантаження.  Наприклад завантаження даних із зовнішніх файлів, таких як криптографічні ключі або сертифікати чи завантаження даних із інших джерел(.env, API, тощо).

Файл конфігурації:

```javascript
// project_dir/config/auth.js
import path from 'node:path';
import fs from 'node:fs/promises';

// Встановлюємо значеня за замовчюваням, якщо є потреба
const envKey = process.env.PRIV_KEY || './keys/private.key';

// Визначаємоо папку проєкту
const projectDir = process.cwd();

// Отримуємо абсолютний шлях до файлу
const keyPath = path.join(projectDir, envKey);

// Завантажуємо вміст файлу
const key = await fs.readFile(keyPath, 'utf-8');

// Створюємо конфігураційний об'єкт
const config = {
  keys: {
    priv: key,
  },
};

// Експортуємо конфігурацію
export default config;
```

Основний код:

```javascript
import config from 'config-in-files';

const { priv } = await config.auth.keys;

console.log(priv); // Вміст приватного ключа 
```

## Папка конфігурацій

config-in-files має мінімальні налаштування. За замовчуванням, модуль шукає конфігураційні файли у папці config, але ви можете змінити це через CONFIG_DIR.

Приклад налаштування шляху до конфігурацій для package.json:

```json
"cross-env CONFIG_DIR=custom-config node ./app.js“
```

Модуль буде шукати файли конфігурацій у `project_dir/custom-config`.

## API

```Javascript
import config from 'config-in-files'
```

`config` це асинхронний об’єкт, що містить Proxy для завантаженя експорту файлів-модулів конфігурацій.

Кожен ключ відповідає імені файлу конфігурації.

Приклад:

```javascript
import config from ‘config-in-files’;
const serverConfig = await config.server;

// serverConfig містить експортовані дані із config/server.js
```

- Модулі конфігурацій завантажуються у момент першого зверненя.
- Дані у експорті модулів конфігурацій deepFreeze, для попередженя випадкової зміни їх вмісту.

## Ліцензія

MIT

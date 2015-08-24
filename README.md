# vorpal-use

<img src="https://travis-ci.org/vorpaljs/vorpal-use.svg" alt="Build Status" />

An extension for [Vorpal](https://github.com/dthree/vorpal).

Forgot to install a useful extension in development and now you need it live? No problem.

This will install a `use` command into one's Vorpal instance, which will automatically import a given NPM module acting as a Vorpal extension, and register the commands contained inside while the app is still live. This import has an in-memory lifecycle and the module is dumped when the thread quits.

```bash
node~$
node~$ use vorpal-repl
Installing vorpal-repl from the NPM registry:
Successfully registered 1 new command.
node~$
node~$ repl
node~$ repl: 6*8
48
node~$ repl:
```

### Installation

```bash
npm install vorpal-use --save
```

### Usage

```js
const Vorpal = require('vorpal');
const use = require('vorpal-use');
let vorpal = new Vorpal();

vorpal
  .delimiter('node~$')
  .use(use)
  .show();
```

### License

MIT

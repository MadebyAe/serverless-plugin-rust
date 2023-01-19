**Serverless framework** plugin for blazingly-fast rust functions.

<img src="https://rustacean.net/assets/rustacean-flat-happy.png" alt="serverless-plugin-rust" height="120" width="auto" />



## Quick start

### Prerequisites

Make sure you have the following installed before starting:

- [Node.js](https://nodejs.org)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [serverless](https://www.serverless.com)
- [cargo lambda](https://www.cargo-lambda.info)

### Install
```console
npm install
```

```console
cargo run
```

### Local development
```console
cd member-one
```

```console
cargo lambda watch
```

### Invoke
```console
cargo lambda invoke --data-ascii '{"pathParameters": { "string": "world" }}'
```

```console
Response: { "message": "Hello world!" }
```

### Deploy
Go back to the main `workspace` directory
```console
cd ..
```

```console
serverless deploy
```

---

Note: All examples will be updated to integrate `serverless offline` and `serverless invoke`. Stay tuned.

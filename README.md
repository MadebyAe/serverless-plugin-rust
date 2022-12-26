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
npm install serverless-plugin-rust --save-dev
```

## Usage

### Default serverless.yml config example

```yml
service: serverless-rust-hello-world

provider:
  name: aws
  stage: dev
  runtime: provided.al2
  region: us-east-1

package:
  individually: true

configValidationMode: error

functions:
  hello:
    description: Hello world lambda
    handler: hello
    events:
      - http:
          path: '/hello-world'
          method: get

plugins:
  - serverless-plugin-rust
```

```console
serverless deploy
```

⚡️🚀


### Custom serverless.yml config example

TODO

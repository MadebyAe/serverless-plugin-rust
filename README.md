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

### Examples

- [Basic hello world example](https://github.com/MadebyAe/serverless-plugin-rust/tree/main/examples/hello-world)
- [Workspace example](https://github.com/MadebyAe/serverless-plugin-rust/tree/main/examples/workspace)

### Important

- Running this code might result in charges to your AWS account.
- Running the tests might result in charges to your AWS account.
- We recommend that you grant your code least privilege. At most, grant only the minimum permissions required to perform the task. For more information, see Grant least privilege.
- This code is not tested in every AWS Region. For more information, see AWS Regional Services.

### Roadmap

- Add Google Cloud compatibility (Experimental)
- Add Serverless options schema
- Enable and test option to support `arm64` architecture
- Integrate `serverless offline` and `serverless invoke`
- Unit tests

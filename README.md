**Serverless framework** plugin for blazingly-fast rust functions.

<img src="https://rustacean.net/assets/rustacean-flat-happy.png" alt="serverless-plugin-rust" height="120" width="auto" />

## Motivation

### 💻 Development experience
The goal of this project is to be accessible to beginners and experienced developers. Similar solutions require **Docker** to run or compile rust which is not practical.

### 🚀 Faster time-to-market
You can quickly deploy and update serverless applications, reducing the time it takes to bring new features to the market.

### ⚡️ Blazingly-fast
Serverless rust is blazingly-fast on serverless infrastructure.

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

## Examples

- [Basic hello world example](https://github.com/MadebyAe/serverless-plugin-rust/tree/main/examples/hello-world)
- [Workspace example](https://github.com/MadebyAe/serverless-plugin-rust/tree/main/examples/workspace)

## Benchmark

|                     |             |           |              |
|---------------------|-------------|-----------|--------------|
| Rust (provided.al2) | ❄ 17.734ms  | 💾 14MB   | ⚡ 2.737ms   |
| Go (provided)       | ❄ 59.495ms  | 💾 19MB   | ⚡ 1.578ms   |
| Go (1.x)            | ❄ 93.72ms   | 💾 29.1MB | ⚡ 6.284ms   |
| Node.js v16.x       | ❄ 141.038ms | 💾 57.2MB | ⚡ 9.896ms   |
| Node.js v18.x       | ❄ 250.032ms | 💾 64.7MB | ⚡ 13.014ms  |
| Java11              | ❄ 428.539ms | 💾 81MB   | ⚡ 121.775ms |

❄ Avg Cold Start duration · 💾 Avg Memory Used · ⚡ Avg duration

Source: https://maxday.github.io/lambda-perf

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

---

Made with ❤️  in San Francisco

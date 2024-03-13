**Serverless framework** plugin for blazingly-fast rust functions.

<img src="https://rustacean.net/assets/rustacean-flat-happy.png" alt="serverless-plugin-rust" height="120" width="auto" />

## Status

[![Build](https://github.com/MadebyAe/serverless-plugin-rust/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/MadebyAe/serverless-plugin-rust/actions/workflows/build.yml)

## Motivation

### 💻 Development experience
The goal of this project is to be accessible to beginners and experienced developers. Similar solutions require **Docker** to run or compile rust which is not practical.

### 🚀 Faster time-to-market
You can quickly deploy and update serverless applications, reducing the time it takes to bring new features to the market.

### ⚡️ Blazingly-fast
Experience unparalleled speed with serverless Rust, delivering exceptional performance on serverless infrastructure.

### 📈 Seamless scalability
Rust offers seamless scalability, effortlessly handling varying workloads, capable of processing millions of requests per minute while maintaining optimal performance.

## Quick start

### Prerequisites

Make sure you have the following installed before starting:

- [Node.js](https://nodejs.org)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)
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
  architecture: arm64

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

## Demo

[![asciicast](https://asciinema.org/a/646679.svg)](https://asciinema.org/a/646679)

## Examples

- [Basic hello world example](https://github.com/MadebyAe/serverless-plugin-rust/tree/main/examples/hello-world)
- [OpenAI ChatGPT example](https://github.com/MadebyAe/serverless-plugin-rust/tree/main/examples/openai-chatgpt)
- [Workspace example](https://github.com/MadebyAe/serverless-plugin-rust/tree/main/examples/workspace)

## Benchmark

|                     |             |           |              |
|---------------------|-------------|-----------|--------------|
| Rust (provided.al2) | ❄ 17.734ms  | 💾 14MB   | ⚡ 1.18ms   |
| Go (provided)       | ❄ 59.495ms  | 💾 19MB   | ⚡ 3.14ms   |
| Go (1.x)            | ❄ 93.72ms   | 💾 29.1MB | ⚡ 3.14ms   |
| Node.js v16.x       | ❄ 141.038ms | 💾 57.2MB | ⚡ 11.18ms   |
| Node.js v18.x       | ❄ 250.032ms | 💾 64.7MB | ⚡ 8.70ms  |
| Java11              | ❄ 428.539ms | 💾 81MB   | ⚡ 13.73ms |

❄ Avg Cold Start duration · 💾 Avg Memory Used · ⚡ Avg duration

Source: https://maxday.github.io/lambda-perf

### Important

- 💰 Running this code and examples might result in charges to your AWS account.
- 🔐 We recommend that you grant your code least privilege. At most, grant only the minimum permissions required to perform the task.

### Roadmap

- Add Google Cloud compatibility (Experimental)
- Integrate `serverless offline` and `serverless invoke`

---

Made with ❤️  in San Francisco

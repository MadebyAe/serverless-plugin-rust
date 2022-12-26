'use strict';

const { join } = require('path');
const { spawnSync } = require('child_process');
const { renameSync } = require('fs');

class ServerlessRustPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.servicePath = this.serverless.config.servicePath || '';
    this.hooks = {
      'initialize': () => this.initialize(),
      "before:package:package": () => this.build(),
      "before:package:createDeploymentArtifacts": () => this.build(),
      "before:deploy:function:packageFunction": () => this.build(),
      'before:deploy:deploy': () => this.beforeDeploy(),
      'after:deploy:deploy': () => this.afterDeploy(),
    };
  }

  initialize() {
    const cargo = spawnSync('cargo', ['lambda', '-V']);

    if (cargo.error) {
      throw new this.serverless.classes.Error('cargo lambda was not found in the project. Visit https://www.cargo-lambda.info for more information.');
      return null;
    }
    // TODO show progress
  }

  get functions() {
    return this.serverless.service.getAllFunctions();
  }

  beforeDeploy() {
    // console.log('beforeDeploy');
  }

  beforeBuild() {
    const args = ['lambda', 'build', '--release', '--output-format', 'zip', this.options.arch].filter(Boolean);
    const cargo = spawnSync('cargo', args);

    if (cargo.error) {
      throw new this.serverless.classes.Error('cargo lambda was not found in the project. Visit https://www.cargo-lambda.info for more information.');
      return null;
    }
  }

  afterDeploy() {
    this.serverless.cli.log('Thanks for using serverless rust plugin');
    // After deploy
  }

  build(src) {
    const service = this.serverless.service;

    if (service.provider.name !== 'aws') {
      // TODO: throw a message
      return null;
    }

    this.beforeBuild();

    this.functions.forEach((functionName) => {
      const func = service.getFunction(functionName);

      this.serverless.cli.log(`Building Rust ${func.handler} func...`);

      const basePath = join(
        this.servicePath,
        'target/lambda',
        func.handler,
        'bootstrap.zip',
      );

      const targetPath = join(
        this.servicePath,
        'target/lambda',
         func.handler,
        `${func.handler}-bootstrap.zip`
      );

      renameSync(basePath, targetPath);
      func.package = func.package || {};
      func.package.artifact = targetPath;
    });
  }
}

module.exports = ServerlessRustPlugin;

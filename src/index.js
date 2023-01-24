'use strict';

const AdmZip = require('adm-zip');
const isCI = require('is-ci');
const { join } = require('path');
const { renameSync } = require('fs');
const { spawnSync } = require('child_process');

const TARGETS = {
  x86_64: 'x86_64-unknown-linux-musl',
  arm64: 'aarch64-unknown-linux-gnu',
};

class ServerlessPluginRust {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.servicePath = this.serverless.config.servicePath || '';
    this.functions = this.serverless.service.getAllFunctions();

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
    if (isCI)  {
      return null;
    }

    const cargo = spawnSync('cargo', ['lambda', '-V']);

    if (cargo.error) {
      throw new this.serverless.classes.Error('[Error] cargo lambda was not found in the project. Visit https://www.cargo-lambda.info for more information.');

      return null;
    }
  }

  async createZip(functionName) {
    const service = this.serverless.service;
    const func = service.getFunction(functionName);
    const zip = new AdmZip();
    const output = `${func.handler}-bootstrap.zip`;
    const basePath = join(
      this.servicePath,
      'target/release',
      func.handler,
    );
    const targetPath = join(
      this.servicePath,
      `./target/lambda`,
      func.handler,
      output,
    );
    zip.addLocalFile(basePath);
    zip.writeZip(targetPath);

    return Promise.resolve({ func, targetPath });
  }

  beforeDeploy() {
    // console.log('beforeDeploy');
  }

  beforeBuild() {
    const targetPath = join(this.servicePath, 'target');

    spawnSync('rm', ['-rf', targetPath]);

    if (isCI) {
      return null;
    }

    const args = ['lambda', 'build', '--release', '--output-format', 'zip', this.options.arch].filter(Boolean);
    const cargo = spawnSync('cargo', args);

    if (cargo.error) {
      throw new this.serverless.classes.Error(
        'cargo lambda was not found in the project. Visit https://www.cargo-lambda.info for more information.'
      );
      return null;
    }
  }

  afterDeploy() {
    this.serverless.cli.log('Thanks for using serverless-plugin-rust');
  }

  buildLocal() {
    if (isCI) {
      return null;
    }

    const service = this.serverless.service;

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

  async buildCI() {
    if (!isCI) {
      return null;
    }

    const service = this.serverless.service;
    const target = TARGETS[this.options.arch] || TARGETS.x86_64;
    const args = ['build', '--release', '--locked', '--target', target].filter(Boolean);
    // TODO: Handle potential errors
    const cargo = spawnSync('cargo', args);
    const mkdir = spawnSync('mkdir', ['target/lambda']);

    console.log(spawnSync('ls', ['-la']))
    const zips = await Promise.all(
      this.functions.map(functionName => this.createZip(functionName)),
    );

    zips.forEach(({ func, targetPath }) => {
      func.package = func.package || {};
      func.package.artifact = targetPath;
    });
  }

  build() {
    const service = this.serverless.service;

    if (service.provider.name !== 'aws') {
      throw new this.serverless.classes.Error(`${service.provider.name} not supported.`);

      return null;
    }

    this.beforeBuild();
    this.buildLocal();
    this.buildCI();
  }
}

module.exports = ServerlessPluginRust;

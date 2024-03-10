'use strict'

const { join } = require('path')
const { spawnSync } = require('child_process')
const { existsSync, renameSync } = require('fs')
const { log, progress } = require('@serverless/utils/log')

class ServerlessPluginRust {
  constructor (serverless, options) {
    this.serverless = serverless
    this.options = options
    this.logger = log
    this.progress = progress.create({ message: 'Packaging rust functions' })
    this.service = this.serverless.service
    this.architecture = this.service.provider?.architecture || 'x86_64'
    this.servicePath = this.serverless.config.servicePath || ''
    this.hooks = {
      'before:package:createDeploymentArtifacts': this.build.bind(this),
      'before:deploy:function:packageFunction': this.build.bind(this)
    }
  }

  log (message) {
    if (typeof message === 'string') {
      this.progress.update(message)
    }

    if (this.options.verbose) {
      console.log(message)
    }
  }

  setup () {
    this.log('Checking provider compatibility')

    if (this.service.provider.name !== 'aws') {
      throw new this.serverless.classes.Error('Only aws provider is supported at the moment.')
    }

    this.log('Checking rust cargo lambda version')

    const cargo = spawnSync('cargo', ['lambda', '-V'], { shell: true, encoding: 'utf-8' })

    if (cargo.status !== 0) {
      this.log(cargo)
      throw new this.serverless.classes.Error('cargo lambda was not found in the project. Visit https://www.cargo-lambda.info for more information.')
    }
  }

  get functions () {
    return this.serverless.service.getAllFunctions()
  }

  beforeBuild () {
    const targetPath = join(this.servicePath, 'target')

    this.log('Cleanup target path')
    const rm = spawnSync('rm', ['-rf', targetPath], { shell: true, encoding: 'utf-8' })

    if (rm.status !== 0) {
      this.log(rm)
      throw new this.serverless.classes.Error('Error cleaning up target path')
    }
  }

  build () {
    this.setup()
    this.beforeBuild()
    this.log('Building artifacts')
    const architecture = this.architecture === 'arm64' ? '--arm64' : null
    const options = ['--release', architecture, '--output-format', 'zip']
    const args = ['lambda', 'build', ...options].filter(Boolean)
    const cargo = spawnSync('cargo', [...args], { shell: true, encoding: 'utf-8' })

    if (cargo.status !== 0) {
      this.log(cargo)
      throw new this.serverless.classes.Error('cargo lambda build error. Visit https://www.cargo-lambda.info for more information.')
    }

    this.log('Building artifacts complete')
    this.afterBuild()
  }

  success (message) {
    return log.success(message)
  }

  afterBuild () {
    this.functions.forEach((functionName) => {
      const func = this.service.getFunction(functionName)

      this.log(`Preparing ${func.handler} function for deploying`)

      const basePath = join(
        this.servicePath,
        'target/lambda',
        func.handler,
        'bootstrap.zip'
      )

      if (!existsSync(basePath)) {
        throw new this.serverless.classes.Error(`Base path ${basePath} not exists`)
      }

      this.log(`Renaming rust ${func.handler} function`)

      const targetPath = join(
        this.servicePath,
        'target/lambda',
        func.handler,
        `${func.handler}-bootstrap.zip`
      )

      try {
        renameSync(basePath, targetPath)
      } catch (error) {
        this.log(error)
        throw new this.serverless.classes.Error(`Error renaming file from ${basePath} to ${targetPath}. Visit https://www.cargo-lambda.info for more information. Details: ${error.message}`)
      }

      this.log(`Renaming rust ${func.handler} function completed`)

      func.package = func.package || {}
      func.package.artifact = targetPath

      this.progress.remove()
      this.success('Thanks for using serverless-plugin-rust')
    })
  }
}

module.exports = ServerlessPluginRust

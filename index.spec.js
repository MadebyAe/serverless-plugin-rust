const { describe, beforeEach, expect, test } = require('@jest/globals')
const { spawnSync } = require('child_process')
const Serverless = require('serverless')
const ServerlessPluginRust = require('./')

jest.mock('child_process')

describe('ServerlessPluginRust', () => {
  let serverless
  let options
  let plugin

  beforeEach(() => {
    options = { stage: 'dev', region: 'us-east-1' }
    serverless = new Serverless({ commands: [], options })

    jest.clearAllMocks()
  })

  test('setup throws error if provider is not aws', () => {
    plugin = new ServerlessPluginRust(serverless, options)
    expect(() => plugin.setup()).toThrow('Only aws provider is supported at the moment.')
  })

  test('setup throws error if cargo lambda is not found', () => {
    spawnSync.mockImplementationOnce(() => ({ stderr: 'Some error message', stdout: '', status: 1 }))
    plugin = new ServerlessPluginRust(serverless, options)
    plugin.serverless.service.provider.name = 'aws'
    expect(() => plugin.setup()).toThrow('cargo lambda was not found in the project. Visit https://www.cargo-lambda.info for more information.')
  })

  test('setup succeeds if cargo lambda is found', () => {
    spawnSync.mockImplementationOnce(() => ({ stdout: '1.0.0', stderr: '', status: 0 }))
    plugin = new ServerlessPluginRust(serverless, options)
    plugin.serverless.service.provider.name = 'aws'
    expect(() => plugin.setup()).not.toThrow()
  })

  test('beforeBuild throws error if rm -rf fails', () => {
    spawnSync.mockImplementationOnce(() => ({ stdout: '', stderr: 'Error removing files', status: 1 }))
    plugin = new ServerlessPluginRust(serverless, options)
    plugin.serverless.service.provider.name = 'aws'
    expect(() => plugin.beforeBuild()).toThrow('Error cleaning up target path')
  })

  test('beforeBuild succeed if rm -rf', () => {
    spawnSync.mockImplementationOnce(() => ({ stdout: 'Ok', stderr: '', status: 0 }))
    plugin = new ServerlessPluginRust(serverless, options)
    plugin.serverless.service.provider.name = 'aws'
    expect(() => plugin.beforeBuild()).not.toThrow()
  })

  test('build succeeds', () => {
    spawnSync.mockImplementation(() => ({ stdout: 'Ok', stderr: '', status: 0 }))
    plugin = new ServerlessPluginRust(serverless, options)
    plugin.serverless.service.provider.name = 'aws'
    expect(() => plugin.build()).not.toThrow()
  })

  test('build thorws error', () => {
    spawnSync.mockImplementation(() => ({ stdout: '', stderr: 'Not ok', status: 1 }))
    plugin = new ServerlessPluginRust(serverless, options)
    plugin.serverless.service.provider.name = 'aws'
    expect(() => plugin.build()).toThrow()
  })
})

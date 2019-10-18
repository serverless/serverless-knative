'use strict'

const { Context } = require('@serverless/core')
const Docker = require('@serverless/docker')
const { getName, getTag, getRepository } = require('../../shared/utils')

function buildDockerImage(funcName) {
  const { service } = this.serverless.service
  const funcObj = this.serverless.service.getFunction(funcName)
  const { username } = this.serverless.service.provider.docker
  const name = getName(service, funcName)

  const ctx = new Context()
  const docker = new Docker(undefined, ctx)

  const context = process.cwd()
  const dockerfile = funcObj.handler
  const repository = getRepository(username, name)
  const tag = getTag()

  const inputs = {
    context,
    dockerfile,
    repository,
    tag
  }

  this.serverless.cli.log(`Building Docker image "${repository}:${tag}"...`)

  return docker.build(inputs)
}

module.exports = buildDockerImage

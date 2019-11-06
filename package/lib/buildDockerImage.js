'use strict'

const path = require('path')
const { Context } = require('@serverless/core')
const DockerImage = require('@serverless/docker-image')
const { getFuncName, getTag, getRepository } = require('../../shared/utils')

function buildDockerImage(funcName) {
  const { service } = this.serverless.service
  const funcObj = this.serverless.service.getFunction(funcName)
  const buildContext = funcObj.context || process.cwd
  const { username } = this.serverless.service.provider.docker
  const name = getFuncName(service, funcName)

  const ctx = new Context()
  const docker = new DockerImage(undefined, ctx)

  const context = path.resolve(buildContext)
  const dockerfile = funcObj.handler
  const repository = getRepository(username, name)
  const tag = getTag(this.serverless.instanceId)

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

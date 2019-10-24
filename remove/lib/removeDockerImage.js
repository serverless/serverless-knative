'use strict'

const BbPromise = require('bluebird')
const { Context } = require('@serverless/core')
const Docker = require('@serverless/docker-image')
const { getName, getTag, getRepository } = require('../../shared/utils')

function removeDockerImage(funcName) {
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

  this.serverless.cli.log(`Removing Docker image "${repository}:${tag}"...`)

  // Docker images might've been already removed from the host, so we silently ignore errors
  return docker.remove(inputs).catch(() => BbPromise.resolve())
}

module.exports = removeDockerImage

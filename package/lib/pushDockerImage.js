'use strict'

const { Context } = require('@serverless/core')
const DockerImage = require('@serverless/docker-image')
const { getFuncName, getTag, getRepository } = require('../../shared/utils')

function pushDockerImage(funcName) {
  const { service } = this.serverless.service
  const name = getFuncName(service, funcName)
  const { username, registry = '' } = this.serverless.service.provider.docker
  const { password } = this.serverless.service.provider.docker
  const credentials = {
    docker: {
      username,
      password
    }
  }

  const ctx = new Context()
  const dockerImage = new DockerImage(undefined, ctx)
  // manually setting the credentials of the child-component here
  dockerImage.context.credentials = credentials

  const { image, tagPrefix } = this.serverless.service.getFunction(funcName)
  const repository = image ? [registry, image].join('/') : getRepository(username, name)
  const tag = getTag(this.serverless.instanceId, tagPrefix)

  const inputs = {
    repository,
    tag
  }

  this.serverless.cli.log(`Pushing "${repository}:${tag}" to Container Registry...`)

  return dockerImage.push(inputs)
}

module.exports = pushDockerImage

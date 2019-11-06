'use strict'

const { Context } = require('@serverless/core')
const KnativeServing = require('@serverless/knative-serving')
const {
  getNamespace,
  getFuncName,
  getRepository,
  getTag,
  isContainerImageUrl
} = require('../../shared/utils')

function ensureKnativeService(funcName) {
  const { service } = this.serverless.service
  const { username } = this.serverless.service.provider.docker
  const stage = this.provider.getStage()

  const ctx = new Context()
  const serving = new KnativeServing(undefined, ctx)

  const namespace = getNamespace(service, stage)
  const name = getFuncName(service, funcName)

  let registryAddress
  let repository = getRepository(username, name)
  let tag = getTag(this.serverless.instanceId)

  // see if we're re-using an existing image or if we need to reach out to our Container Registry
  const funcObject = this.serverless.service.getFunction(funcName)
  if (isContainerImageUrl(funcObject.handler)) {
    const image = funcObject.handler
    const firstSlash = image.indexOf('/')
    const firstColon = image.indexOf(':')
    registryAddress = image.substring(0, firstSlash)
    repository = image.substring(firstSlash + 1, firstColon)
    tag = image.substring(firstColon + 1)
  }

  const inputs = {
    name,
    repository,
    tag,
    namespace
  }

  if (registryAddress) {
    Object.assign(inputs, { registryAddress })
  }

  this.serverless.cli.log(`Deploying Knative service for function "${inputs.name}"...`)

  return serving.default(inputs)
}

module.exports = ensureKnativeService

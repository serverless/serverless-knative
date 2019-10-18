'use strict'

const { Context } = require('@serverless/core')
const KnativeServing = require('@serverless/knative-serving')
const { getName, getRepository, getTag } = require('../../shared/utils')

function ensureKnativeService(funcName) {
  const { service } = this.serverless.service
  const { username } = this.serverless.service.provider.docker

  const ctx = new Context()
  const serving = new KnativeServing(undefined, ctx)

  const name = getName(service, funcName)
  const repository = getRepository(username, name)
  const tag = getTag()

  const inputs = {
    name,
    repository,
    tag
  }

  this.serverless.cli.log('Deploying Knative service...')

  return serving.default(inputs)
}

module.exports = ensureKnativeService

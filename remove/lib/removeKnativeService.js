'use strict'

const { Context } = require('@serverless/core')
const KnativeServing = require('@serverless/knative-serving')
const { getName, getTag, getRepository } = require('../../shared/utils')

function removeKnativeService(funcName) {
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

  this.serverless.cli.log('Removing Knative service...')

  return serving.remove(inputs).catch((error) => {
    // throw the error if it something other than "Service not found"
    if (error.body.code !== 404) {
      throw error.body
    }
  })
}

module.exports = removeKnativeService

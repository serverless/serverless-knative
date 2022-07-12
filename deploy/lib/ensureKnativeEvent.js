'use strict'

const { Context } = require('@serverless/core')
const KnativeEventing = require('@serverless/knative-eventing')
const { getNamespace, getFuncName, getEventName } = require('../../shared/utils')

function ensureKnativeEvent(funcName, eventName, config) {
  const { knativeGroup, knativeVersion, kind, configName, spec } = config
  const { service } = this.serverless.service

  const ctx = new Context()
  const eventing = new KnativeEventing(undefined, ctx)

  const sinkName = getFuncName(service, funcName)
  const namespace = getNamespace(this.serverless)
  // TODO: this should be unique since we can have multiple such event definitions
  const name = configName ? configName : getEventName(sinkName, eventName)

  const inputs = {
    name,
    knativeGroup,
    knativeVersion,
    namespace,
    kind,
    spec
  }

  this.serverless.cli.log(`Deploying Knative trigger "${inputs.name}"...`)

  return eventing.default(inputs)
}

module.exports = ensureKnativeEvent

'use strict'

const { Context } = require('@serverless/core')
const KubernetesNamespace = require('@serverless/kubernetes-namespace')
const { getNamespace } = require('../../shared/utils')

function ensureNamespace() {
  const ctx = new Context()
  const namespace = new KubernetesNamespace(undefined, ctx)

  const name = getNamespace(this.serverless)

  const inputs = {
    name,
    labels: {
      // enable Knative Eventing for this namespace
      'knative-eventing-injection': 'enabled'
    }
  }

  this.serverless.cli.log(`Deploying Kubernetes namespace "${inputs.name}"...`)

  return namespace.default(inputs)
}

module.exports = ensureNamespace

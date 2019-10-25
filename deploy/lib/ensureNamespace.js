'use strict'

const { Context } = require('@serverless/core')
const KubernetesNamespace = require('@serverless/kubernetes-namespace')
const { getNamespace } = require('../../shared/utils')

function ensureNamespace() {
  const { service } = this.serverless.service

  const ctx = new Context()
  const namespace = new KubernetesNamespace(undefined, ctx)

  const name = getNamespace(service)

  const inputs = {
    name
  }

  this.serverless.cli.log(`Deploying Kubernetes namespace "${inputs.name}"...`)

  return namespace.default(inputs)
}

module.exports = ensureNamespace

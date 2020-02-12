'use strict'

// NOTE: removing a Kubernetes namespace will also remove all its associated resources

const { Context } = require('@serverless/core')
const KubernetesNamespace = require('@serverless/kubernetes-namespace')
const { getNamespace } = require('../../shared/utils')

function removeNamespace() {
  const ctx = new Context()
  const namespace = new KubernetesNamespace(undefined, ctx)

  const name = getNamespace(this.serverless)

  const inputs = {
    name
  }

  this.serverless.cli.log(`Removing Kubernetes namespace "${inputs.name}"...`)

  return namespace.remove(inputs).catch((error) => {
    // throw the error if it's something other than "not found"
    if (error.body.code !== 404) {
      throw error.body
    }
  })
}

module.exports = removeNamespace

'use strict'

const fetch = require('node-fetch')
const { Context } = require('@serverless/core')
const KnativeServing = require('@serverless/knative-serving/')
const { getFuncUrl } = require('../../shared/utils')

function invokeFunction() {
  const { service } = this.serverless.service
  const stage = this.provider.getStage()

  const ctx = new Context()
  const serving = new KnativeServing(undefined, ctx)

  return serving.info().then((res) => {
    const ip = res.istioIngressIp

    return fetch(`http://${ip}`, {
      method: 'GET',
      headers: { Host: `${getFuncUrl(service, this.options.function, stage)}` }
    }).then((result) => result.text())
  })
}

module.exports = invokeFunction

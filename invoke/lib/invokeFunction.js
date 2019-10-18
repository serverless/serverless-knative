'use strict'

const fetch = require('node-fetch')
const { Context } = require('@serverless/core')
const KnativeServing = require('@serverless/knative-serving/')
const { getName, getFuncUrl } = require('../../shared/utils')

function invokeFunction() {
  const { service } = this.serverless.service
  const name = getName(service, this.options.function)

  const ctx = new Context()
  const serving = new KnativeServing(undefined, ctx)

  return serving.info().then((res) => {
    const ip = res.istioIngressIp

    return fetch(`http://${ip}`, {
      method: 'GET',
      headers: { Host: `${getFuncUrl(name)}` }
    }).then((result) => result.text())
  })
}

module.exports = invokeFunction

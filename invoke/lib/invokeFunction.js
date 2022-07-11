'use strict'

const url = require('url')
const fetch = require('node-fetch')
const { Agent } = require('https');
const { Context } = require('@serverless/core')
const KnativeServing = require('@serverless/knative-serving/')
const { getNamespace, getFuncName } = require('../../shared/utils')

function invokeFunction() {
  const { service } = this.serverless.service

  const namespace = getNamespace(this.serverless)

  const ctx = new Context()
  const serving = new KnativeServing(undefined, ctx)

  const inputs = {
    namespace
  }

  return serving.info(inputs).then((res) => {
    const functionUrl = res.serviceUrls.get(getFuncName(service, this.options.function))
    const { host } = url.parse(functionUrl, true)
    const ip = res.istioIngressIp
    const externalUrl = ip && ip.length > 0 ? `http://${ip}` : functionUrl

    return fetch(externalUrl, {
      method: 'GET',
      headers: { Host: host },
      agent: new Agent({
        rejectUnauthorized: false,
     })  
    }).then((result) => result.text())
  })
}

module.exports = invokeFunction

'use strict'

const chalk = require('chalk')
const { Context } = require('@serverless/core')
const KnativeServing = require('@serverless/knative-serving')
const { getNamespace, getFuncName } = require('../../shared/utils')

function displayInfo() {
  const { service } = this.serverless.service

  const namespace = getNamespace(this.serverless)

  const ctx = new Context()
  const serving = new KnativeServing(undefined, ctx)

  const inputs = {
    namespace
  }

  return serving.info(inputs).then((res) => {
    let message = ''

    message += `${chalk.yellow.underline('Service Information')}\n`
    message += `${chalk.yellow('service:')} ${service}\n`
    message += `${chalk.yellow('namespace:')} ${namespace}\n`
    if (res.istioIngressIp && res.istioIngressIp.length > 0) {
      message += `${chalk.yellow('ingress ip:')} ${res.istioIngressIp}\n`
    }

    message += '\n'

    const functionNames = this.serverless.service.getAllFunctions()
    if (functionNames.length) {
      message += `${chalk.yellow.underline('Deployed functions')}\n`
    }
    functionNames.forEach((funcName) => {
      message += `${chalk.yellow(funcName)}:\n`
      message += `  - ${chalk.yellow('url:')} ${res.serviceUrls[getFuncName(service, funcName)]}\n`
      const events = this.serverless.service.getAllEventsInFunction(funcName)
      if (events.length) {
        events.forEach((event) => {
          const eventName = Object.keys(event)[0]
          message += `  - ${chalk.yellow(eventName)}\n`
        })
      }
    })

    this.serverless.cli.consoleLog(message)
  })
}

module.exports = displayInfo

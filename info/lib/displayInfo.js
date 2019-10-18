'use strict'

const chalk = require('chalk')
const { Context } = require('@serverless/core')
const KnativeServing = require('@serverless/knative-serving')
const { getName, getFuncUrl } = require('../../shared/utils')

function displayInfo() {
  const { service } = this.serverless.service

  const ctx = new Context()
  const serving = new KnativeServing(undefined, ctx)

  return serving.info().then((res) => {
    let message = ''

    message += `${chalk.yellow.underline('Service Information')}\n`
    message += `${chalk.yellow('service:')} ${service}\n`
    message += `${chalk.yellow('ingress ip:')} ${res.istioIngressIp}\n`

    message += '\n'

    const functionNames = this.serverless.service.getAllFunctions()
    if (functionNames.length) {
      message += `${chalk.yellow.underline('Deployed functions')}\n`
    }
    functionNames.forEach((funcName) => {
      const name = getName(service, funcName)
      message += `${chalk.yellow(funcName)}:\n`
      message += `  ${chalk.yellow('url:')} ${getFuncUrl(name)}\n`
    })

    this.serverless.cli.consoleLog(message)
  })
}

module.exports = displayInfo

'use strict'

const BbPromise = require('bluebird')
const invokeFunction = require('./lib/invokeFunction')
const logResult = require('./lib/logResult')

class KnativeInvoke {
  constructor(serverless, options) {
    this.serverless = serverless
    this.options = options || {}
    this.provider = this.serverless.getProvider('knative')

    Object.assign(this, { invokeFunction, logResult })

    this.hooks = {
      'invoke:invoke': () =>
        BbPromise.bind(this)
          .then(this.invokeFunction)
          .then(this.logResult)
    }
  }
}

module.exports = KnativeInvoke

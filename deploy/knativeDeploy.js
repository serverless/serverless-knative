'use strict'

const BbPromise = require('bluebird')
const ensureKnativeService = require('./lib/ensureKnativeService')

class KnativeDeploy {
  constructor(serverless, options) {
    this.serverless = serverless
    this.options = options || {}
    this.provider = this.serverless.getProvider('knative')

    Object.assign(this, { ensureKnativeService })

    this.hooks = {
      'deploy:deploy': () =>
        BbPromise.all(
          this.serverless.service.getAllFunctions().map((func) => this.ensureKnativeService(func))
        )
    }
  }
}

module.exports = KnativeDeploy

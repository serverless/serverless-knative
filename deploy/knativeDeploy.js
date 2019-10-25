'use strict'

const BbPromise = require('bluebird')
const ensureNamespace = require('./lib/ensureNamespace')
const ensureKnativeService = require('./lib/ensureKnativeService')

class KnativeDeploy {
  constructor(serverless, options) {
    this.serverless = serverless
    this.options = options || {}
    this.provider = this.serverless.getProvider('knative')

    Object.assign(this, { ensureNamespace, ensureKnativeService })

    this.hooks = {
      'deploy:deploy': () =>
        BbPromise.bind(this)
          .then(this.ensureNamespace)
          .then(
            BbPromise.all(
              this.serverless.service
                .getAllFunctions()
                .map((func) => this.ensureKnativeService(func))
            )
          )
    }
  }
}

module.exports = KnativeDeploy

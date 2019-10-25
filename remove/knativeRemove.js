'use strict'

const BbPromise = require('bluebird')
const removeNamespace = require('./lib/removeNamespace')
const removeDockerImage = require('./lib/removeDockerImage')

class KnativeRemove {
  constructor(serverless, options) {
    this.serverless = serverless
    this.options = options || {}
    this.provider = this.serverless.getProvider('knative')

    Object.assign(this, { removeNamespace, removeDockerImage })

    this.hooks = {
      'remove:remove': () =>
        BbPromise.bind(this)
          .then(this.removeNamespace)
          .then(
            BbPromise.all(
              this.serverless.service.getAllFunctions().map((func) => this.removeDockerImage(func))
            )
          )
    }
  }
}

module.exports = KnativeRemove

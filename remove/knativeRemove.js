'use strict'

const BbPromise = require('bluebird')
const removeDockerImage = require('./lib/removeDockerImage')
const removeKnativeService = require('./lib/removeKnativeService.js')

class KnativeRemove {
  constructor(serverless, options) {
    this.serverless = serverless
    this.options = options || {}
    this.provider = this.serverless.getProvider('knative')

    Object.assign(this, { removeDockerImage, removeKnativeService })

    this.hooks = {
      'remove:remove': () =>
        BbPromise.all(
          this.serverless.service
            .getAllFunctions()
            .map((func) => this.removeDockerImage(func).then(() => this.removeKnativeService(func)))
        )
    }
  }
}

module.exports = KnativeRemove

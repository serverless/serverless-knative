'use strict'

const BbPromise = require('bluebird')
const displayInfo = require('./lib/displayInfo')

class KnativeInfo {
  constructor(serverless, options) {
    this.serverless = serverless
    this.options = options || {}
    this.provider = this.serverless.getProvider('knative')

    Object.assign(this, { displayInfo })

    this.hooks = {
      'deploy:deploy': () => BbPromise.bind(this).then(this.displayInfo),
      'info:info': () => BbPromise.bind(this).then(this.displayInfo)
    }
  }
}

module.exports = KnativeInfo

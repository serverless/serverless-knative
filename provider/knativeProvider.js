'use strict'

const constants = {
  providerName: 'knative'
}

class KnativeProvider {
  static getProviderName() {
    return constants.providerName
  }

  constructor(serverless, options) {
    this.serverless = serverless
    this.options = options
    this.provider = this
    this.serverless.setProvider(constants.providerName, this)
  }

  getStage() {
    let stage = 'dev'
    if (this.options.stage) {
      stage = this.options.stage // eslint-disable-line prefer-destructuring
    } else if (this.serverless.service.provider.stage) {
      stage = this.serverless.service.provider.stage // eslint-disable-line prefer-destructuring
    }
    return stage
  }
}

module.exports = KnativeProvider

'use strict'

const constants = {
  providerName: 'knative'
}

class KnativeProvider {
  static getProviderName() {
    return constants.providerName
  }

  constructor(serverless) {
    this.serverless = serverless
    this.provider = this
    this.serverless.setProvider(constants.providerName, this)
  }
}

module.exports = KnativeProvider

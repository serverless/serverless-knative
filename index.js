'use strict'

const KnativeProvider = require('./provider/knativeProvider')
const KnativePackage = require('./package/knativePackage')
const KnativeDeploy = require('./deploy/knativeDeploy')
const KnativeRemove = require('./remove/knativeRemove')
const KnativeInvoke = require('./invoke/knativeInvoke')
const KnativeInfo = require('./info/knativeInfo')

class KnativeIndex {
  constructor(serverless, options) {
    this.serverless = serverless
    this.options = options

    this.serverless.pluginManager.addPlugin(KnativeProvider)
    this.serverless.pluginManager.addPlugin(KnativePackage)
    this.serverless.pluginManager.addPlugin(KnativeDeploy)
    this.serverless.pluginManager.addPlugin(KnativeRemove)
    this.serverless.pluginManager.addPlugin(KnativeInvoke)
    this.serverless.pluginManager.addPlugin(KnativeInfo)
  }
}

module.exports = KnativeIndex

'use strict'

const BbPromise = require('bluebird')
const buildDockerImage = require('./lib/buildDockerImage')
const pushDockerImage = require('./lib/pushDockerImage')
const { isContainerImageUrl } = require('../shared/utils')

class KnativePackage {
  constructor(serverless, options) {
    this.serverless = serverless
    this.options = options || {}
    this.provider = this.serverless.getProvider('knative')

    Object.assign(this, { buildDockerImage, pushDockerImage })

    this.hooks = {
      'package:createDeploymentArtifacts': () =>
        BbPromise.all(
          this.serverless.service.getAllFunctions().map((func) => {
            const funcObject = this.serverless.service.getFunction(func)
            if (isContainerImageUrl(funcObject.handler)) {
              return BbPromise.resolve()
            }
            return this.buildDockerImage(func).then(() => this.pushDockerImage(func))
          })
        )
    }
  }
}

module.exports = KnativePackage

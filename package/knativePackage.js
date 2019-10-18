'use strict'

const BbPromise = require('bluebird')
const buildDockerImage = require('./lib/buildDockerImage')
const pushDockerImage = require('./lib/pushDockerImage')

class KnativePackage {
  constructor(serverless, options) {
    this.serverless = serverless
    this.options = options || {}
    this.provider = this.serverless.getProvider('knative')

    Object.assign(this, { buildDockerImage, pushDockerImage })

    this.hooks = {
      'package:createDeploymentArtifacts': () =>
        BbPromise.all(
          this.serverless.service
            .getAllFunctions()
            .map((func) => this.buildDockerImage(func).then(() => this.pushDockerImage(func)))
        )
    }
  }
}

module.exports = KnativePackage

'use strict'

const BbPromise = require('bluebird')
const ensureNamespace = require('./lib/ensureNamespace')
const ensureKnativeService = require('./lib/ensureKnativeService')
const ensureKnativeEvent = require('./lib/ensureKnativeEvent')
const getKnativeEventConfig = require('./lib/getKnativeEventConfig')
const { getFuncName } = require('../shared/utils')

function deployFunctions() {
  const functions = this.serverless.service.getAllFunctions()
  const funcPromises = functions.map((funcName) => this.ensureKnativeService(funcName))
  return BbPromise.all(funcPromises)
}

function deployEvents() {
  const { service } = this.serverless.service
  const functions = this.serverless.service.getAllFunctions()
  let eventPromises = []
  functions.forEach((funcName) => {
    const events = this.serverless.service.getAllEventsInFunction(funcName)
    if (events.length) {
      eventPromises = eventPromises.concat(
        events.map((event) => {
          const eventName = Object.keys(event)[0]
          const eventConfig = event[eventName]
          const sinkName = getFuncName(service, funcName)
          const config = this.getKnativeEventConfig(sinkName, eventName, eventConfig)
          if (config) {
            return this.ensureKnativeEvent(funcName, eventName, config)
          }
          return BbPromise.resolve()
        })
      )
    }
  })
  return BbPromise.all(eventPromises)
}

class KnativeDeploy {
  constructor(serverless, options) {
    this.serverless = serverless
    this.options = options || {}
    this.provider = this.serverless.getProvider('knative')

    Object.assign(this, {
      deployFunctions,
      deployEvents,
      ensureNamespace,
      ensureKnativeService,
      ensureKnativeEvent,
      getKnativeEventConfig
    })

    this.hooks = {
      // TODO: add validation which checks if service has functions
      // 'before:deploy:deploy: () => { ... }`
      'deploy:deploy': () => {
        return (
          BbPromise.bind(this)
            .then(this.ensureNamespace)
            // TODO: remove this delay as it's only used to
            // ensure that the default Broker is up- and running
            // when the triggers are registered
            .then(() => BbPromise.delay(2000))
            .then(this.deployFunctions)
            .then(this.deployEvents)
        )
      }
    }
  }
}

module.exports = KnativeDeploy

'use strict'

const BbPromise = require('bluebird')
const ensureNamespace = require('./lib/ensureNamespace')
const ensureKnativeService = require('./lib/ensureKnativeService')
const ensureKnativeTrigger = require('./lib/ensureKnativeTrigger')

function isEventValid(funcName, eventName) {
  // we only support `custom` events for now...
  if (eventName !== 'custom') {
    this.serverless.cli.log(`Unknown event "${eventName}" for function "${funcName}"`)
    return false
  }

  return true
}

function deployFunctions() {
  const functions = this.serverless.service.getAllFunctions()
  const funcPromises = functions.map((funcName) => this.ensureKnativeService(funcName))
  return BbPromise.all(funcPromises)
}

function deployEvents() {
  const functions = this.serverless.service.getAllFunctions()
  let eventPromises = []
  functions.forEach((funcName) => {
    const events = this.serverless.service.getAllEventsInFunction(funcName)
    if (events.length) {
      eventPromises = eventPromises.concat(
        events.map((event) => {
          const eventName = Object.keys(event)[0]
          const eventConfig = event[eventName]
          if (isEventValid.call(this, funcName, eventName)) {
            return this.ensureKnativeTrigger(funcName, eventName, eventConfig)
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
      ensureKnativeTrigger
    })

    this.hooks = {
      // TODO: add validation which checks if service has functions
      // 'before:deploy:deploy': () => { ... }
      'deploy:deploy': () => {
        return BbPromise.bind(this)
          .then(this.ensureNamespace)
          .then(this.deployFunctions)
          .then(this.deployEvents)
      }
    }
  }
}

module.exports = KnativeDeploy

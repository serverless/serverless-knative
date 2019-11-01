'use strict'

const validEvents = ['custom', 'cronJob']
const knativeVersion = 'v1alpha1'

function getRef(sinkName) {
  return {
    apiVersion: `serving.knative.dev/${knativeVersion}`,
    kind: 'Service',
    name: sinkName
  }
}

function getCustomConfig(sinkName, eventConfig) {
  const { filter } = eventConfig
  return {
    kind: 'Trigger',
    knativeGroup: 'eventing.knative.dev',
    knativeVersion,
    spec: {
      filter,
      subscriber: {
        ref: getRef(sinkName)
      }
    }
  }
}

function getKnativeEventConfig(sinkName, eventName, eventConfig) {
  if (!validEvents.includes(eventName)) {
    this.serverless.cli.log(`Unknown event "${eventName}"`)
    return false
  }

  // TODO: `if (eventName === 'fooBar') { ... }`

  return getCustomConfig(sinkName, eventConfig)
}

module.exports = getKnativeEventConfig

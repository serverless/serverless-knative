'use strict'

const validEvents = ['custom', 'cron']
const knativeVersion = 'v1alpha1'

// TODO: update this when we're dealing with services other
// than the ones deployed by the Serverless Framework (e.g. K8S services)
function getRef(sinkName) {
  return {
    apiVersion: `serving.knative.dev/${knativeVersion}`,
    kind: 'Service',
    name: sinkName
  }
}

function getCronConfig(sinkName, eventConfig) {
  const { schedule, data } = eventConfig
  if (!schedule) {
    throw new Error('"schedule" configuration missing for cron event.')
  }
  if (!data) {
    throw new Error('"data" configuration missing for cron event.')
  }
  return {
    kind: 'CronJobSource',
    knativeGroup: 'sources.eventing.knative.dev',
    knativeVersion,
    spec: {
      schedule,
      data,
      sink: getRef(sinkName)
    }
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

  if (eventName === 'cron') {
    return getCronConfig(sinkName, eventConfig)
  }

  return getCustomConfig(sinkName, eventConfig)
}

module.exports = getKnativeEventConfig

'use strict'

const validEvents = ['custom', 'cron', 'gcpPubSub', 'awsSqs', 'kafka']
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

function getGcpPubSubConfig(sinkName, eventConfig) {
  const { project, topic } = eventConfig
  if (!project) {
    throw new Error('"project" configuration missing for gcpPubSub event.')
  }
  if (!topic) {
    throw new Error('"topic" configuration missing for gcpPubSub event.')
  }
  return {
    kind: 'PullSubscription',
    knativeGroup: 'pubsub.cloud.run',
    knativeVersion,
    spec: {
      project,
      topic,
      sink: getRef(sinkName)
    }
  }
}

function getAwsSqsConfig(sinkName, eventConfig) {
  const { secretName, secretKey, queue } = eventConfig
  if (!secretName) {
    throw new Error('"secretName" configuration missing for awsSqs event.')
  }
  if (!secretKey) {
    throw new Error('"secretKey" configuration missing for awsSqs event.')
  }
  if (!queue) {
    throw new Error('"queue" configuration missing for awsSqs event.')
  }
  return {
    kind: 'AwsSqsSource',
    knativeGroup: 'sources.eventing.knative.dev',
    knativeVersion,
    spec: {
      awsCredsSecret: {
        name: secretName,
        key: secretKey
      },
      queueUrl: queue,
      sink: getRef(sinkName)
    }
  }
}

function getKafkaConfig(sinkName, eventConfig) {
  let resources = eventConfig.resources // eslint-disable-line prefer-destructuring
  const { consumerGroup, bootstrapServers, topics } = eventConfig
  if (!consumerGroup) {
    throw new Error('"consumerGroup" configuration missing for kafka event.')
  }
  if (!bootstrapServers.length) {
    throw new Error('"bootstrapServers" configuration can\'t be empty for kafka event.')
  }
  if (!topics.length) {
    throw new Error('"topics" configuration can\'t be empty for kafka event.')
  }
  if (!resources) {
    resources = {
      limits: {
        cpu: '250m',
        memory: '512Mi'
      },
      requests: {
        cpu: '250m',
        memory: '512Mi'
      }
    }
  }
  return {
    kind: 'KafkaSource',
    knativeGroup: 'sources.eventing.knative.dev',
    knativeVersion,
    spec: {
      consumerGroup,
      bootstrapServers: bootstrapServers.join(','),
      topics: topics.join(','),
      resources,
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
  } else if (eventName === 'gcpPubSub') {
    return getGcpPubSubConfig(sinkName, eventConfig)
  } else if (eventName === 'awsSqs') {
    return getAwsSqsConfig(sinkName, eventConfig)
  } else if (eventName === 'kafka') {
    return getKafkaConfig(sinkName, eventConfig)
  }

  return getCustomConfig(sinkName, eventConfig)
}

module.exports = getKnativeEventConfig

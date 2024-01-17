'use strict'

// TODO: make all of these functions configurable from the outside
// the user should be able to manipulate those

function getNamespace(serverless) {
  const { k8s } = serverless.service.provider
  const namespace = k8s && k8s.namespace
  if (namespace) {
    return namespace
  }
  const { service } = serverless.service
  const { stage } = serverless.service.provider
  return `sls-${service}-${stage}`
}

function getRepository(username, name) {
  return `${username}/${name}`.toLowerCase()
}

function getTag(tag = 'latest', prefix = '') {
  return [prefix, tag].join('')
}

function getFuncName(service, funcName) {
  return `${service}-${funcName}`.toLowerCase()
}

function getEventName(sinkName, eventName) {
  return `${sinkName}-${eventName}`.toLowerCase()
}

function getFuncUrl(serverless, funcName) {
  const { service } = serverless.service
  return `${getFuncName(service, funcName)}.${getNamespace(serverless)}.example.com`
}

function isContainerImageUrl(str) {
  // TODO: there might be a regex to check for container image URLs
  return str.includes(':')
}

module.exports = {
  getNamespace,
  getRepository,
  getTag,
  getFuncName,
  getEventName,
  getFuncUrl,
  isContainerImageUrl
}

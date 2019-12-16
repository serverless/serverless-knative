'use strict'

// TODO: make all of these functions configurable from the outside
// the user should be able to manipulate those

function getNamespace(serverless, stage) {
  const { namespace } = serverless.service.provider.k8s
  const { service } = serverless.service
  if(namespace) {
    return namespace
  }
  return `sls-${service}-${stage}`
}

function getRepository(username, name) {
  return `${username}/${name}`.toLowerCase()
}

function getTag(tag = 'latest') {
  return tag
}

function getFuncName(service, funcName) {
  return `${service}-${funcName}`.toLowerCase()
}

function getEventName(sinkName, eventName) {
  return `${sinkName}-${eventName}`.toLowerCase()
}

function getFuncUrl(serverless, funcName, stage) {
  const { service } = serverless.service
  return `${getFuncName(service, funcName)}.${getNamespace(serverless, stage)}.example.com`
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

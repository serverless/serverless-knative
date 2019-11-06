'use strict'

// TODO: make all of these functions configurable from the outside
// the user should be able to manipulate those

function getNamespace(service, stage) {
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

function getFuncUrl(service, funcName, stage) {
  return `${getFuncName(service, funcName)}.${getNamespace(service, stage)}.example.com`
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

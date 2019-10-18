'use strict'

// TODO: make all of these functions configurable from the outside
// the user should be able to manipulate those

function getName(service, funcName) {
  return `${service}-${funcName}`.toLowerCase()
}

function getRepository(username, name) {
  return `${username}/${name}`.toLowerCase()
}

function getTag() {
  // TODO: this has to increment / be changed so that Knative picks up the changes
  return 'latest'
}

function getFuncUrl(name) {
  // TODO: `default` is the K8S namespace which might change to be the `service` name
  return `${name}.default.example.com`
}

module.exports = {
  getName,
  getRepository,
  getTag,
  getFuncUrl
}

'use strict'

function logResult(result) {
  this.serverless.cli.consoleLog(result)
}

module.exports = logResult

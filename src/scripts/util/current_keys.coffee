vkey = require "vkey"
currentKeys = {}

window.addEventListener "keydown", (event) ->
  currentKeys[vkey[event.keyCode]] = true
  event.preventDefault()

window.addEventListener "keyup", (event) ->
  delete currentKeys[vkey[event.keyCode]]
  event.preventDefault()

module.exports = currentKeys
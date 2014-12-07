vkey = require "vkey"
currentKeys = {}

window.addEventListener "keydown", (event) ->
  currentKeys[vkey[event.keyCode]] = true

window.addEventListener "keyup", (event) ->
  delete currentKeys[vkey[event.keyCode]]

module.exports = currentKeys
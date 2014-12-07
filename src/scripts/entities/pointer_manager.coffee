Pointer = require "./pointer"

module.exports = class PointerManager
  constructor: (options) ->
    @midPoint = options.midPoint
    @targetButtons = options.targets

  pointers: []

  createNewPointerForTarget: ->

    button = @targetButtons[Math.floor(Math.random() * @targetButtons.length)];
    @create {
      targetButton: button
    }

  create: (options) ->
    options.midPoint = @midPoint
    @pointers.push (new Pointer(options))

  updateAll: ->
    pointer.update() for pointer in @pointers when pointer.status is "fine"

    @pointers = (pointer for pointer in @pointers when pointer.status isnt "destroyed")

  testAll: (bulletManager) ->
    bullets = bulletManager.bullets

    pointer.testAgainst bullets for pointer in @pointers

  renderAll: (canvasContext) ->
    canvasContext.save()

    pointer.render canvasContext for pointer in @pointers

    canvasContext.restore()

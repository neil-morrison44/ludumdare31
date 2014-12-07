currentKeys = require "../util/current_keys"
bulletManager = require "./bullet_manager"

module.exports = class Player
  constructor: (options) ->
    @position.x = options.canvasContext.canvas.width/2
    @position.y = options.canvasContext.canvas.height/2

  fire: ->
    @lastShot = Date.now()

  render: (canvasContext) ->
    @update()
    canvasContext.save()

    canvasContext.translate (canvasContext.canvas.width/2), (canvasContext.canvas.height/2)
    canvasContext.translate 0, 0
    canvasContext.rotate @angle

    canvasContext.fillStyle = "rgb(200,200,200)"
    canvasContext.strokeStyle = "rgb(20,20,20)"
    # canvasContext.fillRect -10, -10, 20, 20
    canvasContext.lineWidth = 2


    canvasContext.beginPath()
    canvasContext.moveTo 0, -10
    canvasContext.lineTo 10, 10
    canvasContext.lineTo -10, 10
    canvasContext.closePath()

    canvasContext.stroke()
    canvasContext.fill()

    canvasContext.clip()

    canvasContext.fillStyle = canvasContext.strokeStyle

    canvasContext.fillRect -10, -10, 20, 6

    canvasContext.restore()
    # canvasContext.fillStyle = "red"
    # canvasContext.fillRect (canvasContext.canvas.width/2)-2, (canvasContext.canvas.height/2)-2, 4, 4

  speedUp: ->
    if @speed < 0.095
      @speed+= 0.0005

  speedDown: ->
    if @speed > 0.02
      @speed-= 0.005

  update: ->
    somethingPressed = false
    if currentKeys["A"] or currentKeys["<left>"]
      @angle -= @speed
      @speedUp()
      somethingPressed = true

    if currentKeys["D"] or currentKeys["<right>"]
      @angle += @speed
      @speedUp()
      somethingPressed = true

    if currentKeys["<space>"]
      now = Date.now()
      if (@lastShot + 200) < now
        @lastShot = now
        bulletManager.create {
          position: @position
          angle: @angle
        }

    unless somethingPressed
      @speedDown()

  score: 0
  position:
    x:0
    y:0
  lastShot: 0
  angle:0
  speed: 0.02
module.exports = class Particle
  constructor: (options) ->
    #colour = colour
    @colour = options.colour

    @position = {
      x: options.position.x + Math.random()
      y: options.position.y + Math.random()
    }

    angle = (Math.PI*2)*Math.random()

    @velocity = {
      x: Math.cos angle
      y: Math.sin angle
    }

    @speed = @speed*Math.random()

  update: ->
    if @opacity <= 0
      @status = "destroyed"

    @opacity -= (Math.random()/20)

    @position.x += @speed * @velocity.x
    @position.y += @speed * @velocity.y

  render: (canvasContext) ->
    canvasContext.save()
    canvasContext.globalAlpha = Math.max 0, @opacity

    canvasContext.fillStyle = @colour
    canvasContext.fillRect @position.x, @position.y, 2, 2
    canvasContext.restore()

  colour: null
  opacity: 1
  status: "fine"
  speed: 2
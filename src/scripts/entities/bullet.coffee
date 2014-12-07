lineDistance = ( point1, point2 ) ->
  xs = point2.x - point1.x
  xs = xs * xs
 
  ys = point2.y - point1.y
  ys = ys * ys
 
  Math.sqrt( xs + ys )

module.exports = class Bullet
  constructor: (options) ->
    @position = {}
    @position.x = @start.x = options.position.x
    @position.y = @start.y = options.position.y

    @velocity = {}
    @velocity.x = Math.cos options.angle - Math.PI/2
    @velocity.y = Math.sin options.angle - Math.PI/2

  update: ->
    @position.x += @speed * @velocity.x
    @position.y += @speed * @velocity.y

    if lineDistance(@position, @start) > 300
      @status = "destroyed"


  pathLineSegment: (canvasContext) ->
    startX = @position.x - (10 * @velocity.x)
    startY = @position.y - (10 * @velocity.y)

    canvasContext.moveTo startX, startY
    canvasContext.lineTo @position.x, @position.y

  position:
    x:0
    y:0

  velocity:
    x:0
    y:0

  start:
    x: 0
    y: 0

  destroy: ->
    @status = "destroyed"

  speed: 15.5
  status: "fine"
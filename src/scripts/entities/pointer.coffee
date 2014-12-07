tinyColor = require "tinyColor2"
scoreCounter = require "./scoreCounter"

lineDistance = ( point1, point2 ) ->
  xs = point2.x - point1.x
  xs = xs * xs
 
  ys = point2.y - point1.y
  ys = ys * ys
 
  Math.sqrt( xs + ys )

module.exports = class Pointer
  constructor: (options) ->
    #options
    #position, point with x and y
    #image_src

    @targetButton = options.targetButton
    angle = Math.random()*(Math.PI*2)

    offsetX = (Math.sin angle) * 250
    offsetY = (Math.cos angle) * 250

    @headingTowards = {
      x: @targetButton.position.x+15 + ((@targetButton.width-30) * Math.random())
      y: @targetButton.position.y+15 + (20 * Math.random())
    }
    @position = {
      x: options.midPoint.x + offsetX
      y: options.midPoint.y + offsetY
    }

    @velocity = {
      x: Math.random()
      y: Math.random()
    }

    @fillColour = tinyColor(@targetButton.colour).lighten(25).desaturate(20).toString()


  update: ->
    if @position.x > @headingTowards.x
      @position.x -= @speed*Math.random()

    if @position.x < @headingTowards.x
      @position.x += @speed*Math.random()

    if @position.y > @headingTowards.y
      @position.y -= @speed*Math.random()

    if @position.y < @headingTowards.y
      @position.y += @speed*Math.random()

    @testIfOverButton()

  testIfOverButton: ->

    if @position.x > @targetButton.position.x+15 and @position.x < ((@targetButton.position.x - 15) + @targetButton.width) and
    @position.y > @targetButton.position.y+15 and @position.y < @targetButton.position.y + 35
      @targetButton.clicked = true
      @status = "destroyed"

      if @targetButton.text is "Good"
        scoreCounter.increase 1
      if @targetButton.text is "Slaughter"
        scoreCounter.decrease 1

  render: (canvasContext) ->
    canvasContext.save()
    canvasContext.strokeStyle = "black"
    canvasContext.fillStyle = @fillColour
    canvasContext.beginPath()
    canvasContext.moveTo @position.x, @position.y
    canvasContext.lineTo @position.x + 14, @position.y + 15
    canvasContext.lineTo @position.x, @position.y + 20
    canvasContext.closePath()
    canvasContext.stroke()
    canvasContext.fill()



    canvasContext.restore()

  testBullet: (position) ->
    if (lineDistance @position, position) < 15
      @status = "destroyed"

      if @targetButton.text is "Good"
        scoreCounter.decrease 3
      if @targetButton.text is "Bad"
        scoreCounter.increase 1
      if @targetButton.text is "Slaughter"
        scoreCounter.increase 2


  testAgainst: (bulletPositions) ->
    @testBullet bulletPosition for bulletPosition in bulletPositions

  position:
    x:0
    y:0

  velocity:
    x:0
    y:0

  targetButton: null

  fillColour: null

  status: "fine"

  speed: 1

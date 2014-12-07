tinycolor = require "tinycolor2"

module.exports = class Button
  constructor: (options) ->
    @position = {
      x: options.position.x,
      y: options.position.y
    }
    @width = options.width
    @colour = options.colour
    @text = options.text

    @darkerColour = tinycolor(@colour).darken().toString()
    @slightlyDarkerColour = tinycolor(@colour).darken(5).toString()
    @lighterColour = tinycolor(@colour).lighten().toString()

  render: (canvasContext) ->
    canvasContext.save()
    canvasContext.font = "40px sans-serif"
    canvasContext.fillStyle = @colour
    canvasContext.fillRect @position.x, @position.y, @width, 50

    canvasContext.lineWidth = 4
    canvasContext.strokeStyle = @slightlyDarkerColour
    canvasContext.strokeRect @position.x, @position.y, @width, 50

    canvasContext.beginPath()
    canvasContext.lineWidth = 4
    canvasContext.strokeStyle = if @clicked then @darkerColour else @lighterColour
    canvasContext.moveTo @position.x, @position.y
    canvasContext.lineTo @position.x + @width, @position.y
    canvasContext.stroke()

    canvasContext.beginPath()
    canvasContext.lineWidth = 4
    canvasContext.strokeStyle = if @clicked then @lighterColour else @darkerColour
    canvasContext.moveTo @position.x, @position.y + 50
    canvasContext.lineTo @position.x + @width, @position.y + 50
    canvasContext.stroke()


    canvasContext.fillStyle = "white"
    canvasContext.textAlign = "center"
    canvasContext.fillText @text, (@width/2) + @position.x, 40 + @position.y
    canvasContext.restore()

    if (@clickedFor > 5)
      @clicked = false
      @clickedFor = 0
    else if @clicked
      @clickedFor++
  clicked: false
  clickedFor: 0
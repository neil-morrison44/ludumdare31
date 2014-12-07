scoreCounter = require "../entities/scoreCounter"

module.exports = class Frame
  renderScore: (canvasContext) ->
    canvasContext.save()
    canvasContext.fillStyle = "white"
    canvasContext.font = "30px bold"
    canvasContext.fillText "score: #{scoreCounter.value}", 10, 30
    canvasContext.restore()
  renderBack: (canvasContext) ->
    canvasContext.save()
    width = canvasContext.canvas.width
    height = canvasContext.canvas.height

    canvasContext.fillStyle = "#8BC97B"
    canvasContext.fillRect 0, 0, width, height
    @renderScore canvasContext

    canvasContext.beginPath()
    canvasContext.arc width/2, height/2, (height/2)-5, 0, 2*Math.PI
    canvasContext.clip()

    canvasContext.clearRect 0, 0, width, height

  renderFront: (canvasContext) ->
    width = canvasContext.canvas.width
    height = canvasContext.canvas.height
    canvasContext.strokeStyle = "rgba(125,125,125,0.2)"
    canvasContext.lineWidth = 10
    canvasContext.beginPath()
    canvasContext.arc width/2, (height/2) + 2, (height/2)-10, 0, 2*Math.PI
    canvasContext.stroke()

    canvasContext.restore()

    canvasContext.save()

    canvasContext.fillStyle = "#59804F"
    canvasContext.lineWidth = 2
    canvasContext.beginPath()
    canvasContext.arc width/2, height/2, (height/2)-5, 0, 2*Math.PI
    canvasContext.stroke()

    canvasContext.restore()
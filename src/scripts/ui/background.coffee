module.exports = class Background
  render: (canvasContext) ->
    width = canvasContext.canvas.width
    height = canvasContext.canvas.height
    canvasContext.save()
    canvasContext.textAlign = "center"
    canvasContext.fillStyle = "brown";
    canvasContext.font = "30px sans-serif"
    canvasContext.fillText "LUDUMDARE 31", width/2, 75
    canvasContext.fillStyle = "red";
    canvasContext.font = "35px bold"
    canvasContext.fillText "THEME SLAUGHTER", width/2, 110
    canvasContext.font = "30px sans-serif"
    canvasContext.fillStyle = "black";
    canvasContext.fillText "\"Entire Game on One Screen\"", width/2, 180

    canvasContext.restore()
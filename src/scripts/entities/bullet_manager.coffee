Bullet = require "./bullet"

module.exports = new class BulletManager
  bullets: []

  create: (options) ->
    @bullets.push (new Bullet(options))

  updateAll: ->
    bullet.update() for bullet in @bullets when bullet.status is "fine"

    @bullets = (bullet for bullet in @bullets when bullet.status isnt "destroyed")

  testAll: ->
    

  renderAll: (canvasContext) ->
    canvasContext.save()

    canvasContext.strokeStyle = "rgb(200,0,245)"

    canvasContext.beginPath()

    canvasContext.lineWidth = 5

    bullet.pathLineSegment canvasContext for bullet in @bullets

    canvasContext.stroke()

    canvasContext.restore()

  positionsForBullets: ->
    bullet.position for bullet in @bullets

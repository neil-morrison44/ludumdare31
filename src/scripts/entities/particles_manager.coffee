Particle = require "./particle"

module.exports = new class ParticleManager
  particles: []

  createParticles: (options) ->

    for i in [0...options.count]
      @create options


  create: (options) ->
    options.midPoint = @midPoint
    @particles.push (new Particle(options))

  updateAll: ->
    particle.update() for particle in @particles when particle.status is "fine"

    @particles = (particle for particle in @particles when particle.status isnt "destroyed")

  renderAll: (canvasContext) ->
    canvasContext.save()

    particle.render canvasContext for particle in @particles

    canvasContext.restore()

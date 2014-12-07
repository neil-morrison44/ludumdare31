module.exports = new class Timer
  duration: 0
  startedAt: 0
  onFinish: null

  start: (forDuration) ->
    @duration = forDuration*1000
    @startedAt = Date.now()

  checkTimeLeft: ->
    now = Date.now()
    timeDelta = now - @startedAt
    timeLeft = (@duration - timeDelta)/1000

    if timeLeft <= 0
      @onFinish?()

    timeLeft



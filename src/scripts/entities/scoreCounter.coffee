module.exports = new class ScoreCounter
  value: 0
  increase: (byValue = 1) ->
    @value += byValue
  decrease: (byValue = 1) ->
    @value -= byValue
Player = require "./entities/player"
Pointer = require "./entities/pointer"
Frame = require "./ui/frame"
Background = require "./ui/background"

bulletManager = require "./entities/bullet_manager"
PointerManager = require "./entities/pointer_manager"

Button = require "./entities/button"

timer = require "./util/timer"

scoreCounter = require "./entities/score_counter"

particleManager = require "./entities/particles_manager"

canvas = document.getElementById "gameCanvas"
canvasContext = canvas.getContext "2d"

width = null
height = null

frame = new Frame
background = new Background
player = new Player({
  canvasContext: canvasContext
  })

goodButton = new Button({
  text: "Good"
  width: 150
  colour: "green"
  position: 
    x: 100
    y: 250
  })

badButton = new Button({
  text: "Bad"
  width: 150
  colour: "orange"
  position: 
    x: 350
    y: 250
  })

slaughterButton = new Button({
  text: "Slaughter"
  width: 200
  colour: "red"
  position: 
    x: 200
    y: 310
  })

pointerManager = null
paused = false

startAnimation = ->
  trueStory = document.getElementById "trueStory"
  controls = document.getElementById "controls"

  trueStory.className = "fadeIn"

  window.setTimeout ->
    controls.className = "fadeIn"
  , 1000

  window.setTimeout ->
    pregameCanvasCover = document.getElementById "pregame"
    pregameCanvasCover.style.display = "none"

    timer.start 60
    timer.onFinish = ->
      paused = true

      postgameCanvasCover = document.getElementById "postgame"

      postgameCanvasCover.className += " fadeIn"

      score = document.getElementById "score"

      score.innerText = "#{scoreCounter.value}"

    start()
  , 5000

start = ->
  width = canvas.width
  height = canvas.height

  pointerManager = new PointerManager({
    midPoint:
      x:width/2
      y:height/2
    targets:[slaughterButton, badButton, goodButton]
    })

  window.pointerManager = pointerManager

  render()

render = ->
  if Math.random() < 0.025
    pointerManager.createNewPointerForTarget()

  unless paused
    window.requestAnimationFrame render
  canvasContext.clearRect 0, 0, width, height

  frame.renderBack canvasContext

  background.render canvasContext

  goodButton.render canvasContext
  badButton.render canvasContext
  slaughterButton.render canvasContext

  bulletManager.updateAll()
  bulletManager.renderAll canvasContext

  pointerManager.testAll bulletManager

  particleManager.updateAll()
  particleManager.renderAll canvasContext
  
  pointerManager.updateAll()
  pointerManager.renderAll canvasContext

  player.render canvasContext

  frame.renderFront canvasContext

startAnimation()
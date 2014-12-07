module.exports = new class AudioEffects
  constructor: ->
    @fires.push jsfxlib.createWave(["noise",0.0000,0.4000,0.0000,0.0000,0.0000,0.2380,2400.0000,590.0000,20.0000,1.0000,0.7120,1.0000,5.8648,-0.2428,-0.0420,0.2060,0.2450,0.5000,-0.1600,0.0000,0.0560,0.4260,0.9950,-0.0040,1.0000,0.0000,0.0000])
    @fires.push jsfxlib.createWave(["noise",0.0000,0.4000,0.0000,0.0000,0.0000,0.2380,2400.0000,590.0000,20.0000,1.0000,0.7120,1.0000,5.8648,-0.2428,-0.0420,0.2060,0.2450,0.5000,-0.1600,0.0000,0.0560,0.4260,0.9950,-0.0040,1.0000,0.0000,0.0000])
    @fires.push jsfxlib.createWave(["noise",0.0000,0.4000,0.0000,0.0000,0.0000,0.2380,2400.0000,590.0000,20.0000,1.0000,0.7120,1.0000,5.8648,-0.2428,-0.0420,0.2060,0.2450,0.5000,-0.1600,0.0000,0.0560,0.4260,0.9950,-0.0040,1.0000,0.0000,0.0000])
    @fires.push jsfxlib.createWave(["noise",0.0000,0.4000,0.0000,0.0000,0.0000,0.2380,2400.0000,590.0000,20.0000,1.0000,0.7120,1.0000,5.8648,-0.2428,-0.0420,0.2060,0.2450,0.5000,-0.1600,0.0000,0.0560,0.4260,0.9950,-0.0040,1.0000,0.0000,0.0000])
    @fires.push jsfxlib.createWave(["noise",0.0000,0.4000,0.0000,0.0000,0.0000,0.2380,2400.0000,590.0000,20.0000,1.0000,0.7120,1.0000,5.8648,-0.2428,-0.0420,0.2060,0.2450,0.5000,-0.1600,0.0000,0.0560,0.4260,0.9950,-0.0040,1.0000,0.0000,0.0000])
    @click = jsfxlib.createWave(["square",0.0000,1.0000,0.0000,0.0280,3.0000,0.0000,2400.0000,20.0000,868.0000,0.0000,0.0000,0.5900,24.0050,0.0003,0.0000,-0.8200,0.0000,0.3120,0.0000,0.0000,0.9220,0.8080,0.9890,0.0000,0.0000,0.1000,0.0000])
    @hitPointer = jsfxlib.createWave(["noise",0.0000,1.0000,0.0000,0.0460,3.0000,0.1240,20.0000,1306.0000,2400.0000,-0.2420,0.0000,0.0000,0.0100,0.0003,0.0000,0.5460,0.8940,0.0000,0.0000,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000])

  fires: []
  click: null
  hitPointer: null

  playFire: ->
    @fires[Math.floor(Math.random() * @fires.length)].play()
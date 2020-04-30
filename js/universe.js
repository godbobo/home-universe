/*
 * universe.js
 *
 * Description:
 * 		A simple canvas experiment - universe "simulation".
 * 		Click on the universe to add a new planet.
 * 		Planets grow and shrink size depending on the neighbors satellites.
 *
 * Author: Edbali Ossama
 *
 */

Universe = new (function () {
  // =================
  // === VARIABLES ===
  // =================

  var SCREEN_WIDTH = window.innerWidth
  var SCREEN_HEIGHT = window.innerHeight
  var RADIUS = 70
  var FPS = 20
  var INITIAL_SATELLITES = 20
  var INITIAL_PLANETS = 3
  var INITIAL_NEBULAS = (SCREEN_WIDTH * SCREEN_HEIGHT) / 20000
  var PLANET_GRAVITATION = 40

  var mouseX = SCREEN_WIDTH / 2
  var mouseY = SCREEN_HEIGHT / 2
  var target = null

  var canvas
  var planets = []
  var satellites = []
  var nebulas = []

  // Shadows
  var planetShadow = {
    color: 'rgba(100, 120, 230, 1)',
    blur: 20,
    fillShadow: true,
    strokeShadow: true,
  }
  var satelliteShadow = {
    color: 'rgba(255, 255, 255, 1)',
    blur: 10,
    fillShadow: true,
    strokeShadow: true,
  }
  var nebulaShadow = {
    color: 'rgba(255, 255, 255, 0.7)',
    blur: 10,
    fillShadow: true,
    strokeShadow: true,
  }

  // ================================
  // === INITIALIZATION FUNCTIONS ===
  // ================================

  this.init = function () {
    canvas = new fabric.StaticCanvas('universe', {
      backgroundColor: '#121212',
    })

    // 事件监听
    window.addEventListener('mousemove', documentMouseMoveHandler, false)
    window.addEventListener('mousedown', documentMouseDownHandler, false)
    window.addEventListener('mouseup', documentMouseUpHandler, false)
    window.addEventListener('resize', windowResizeHandler, false)

    // 设置画布大小
    canvas.setWidth(SCREEN_WIDTH)
    canvas.setHeight(SCREEN_HEIGHT)

    // 初始化
    initPlanets()
    initSatellites()
    initNebulas()
    windowResizeHandler()
    setInterval(loop, FPS)
  }

  // 卫星初始化
  function initSatellites() {
    for (var i = 0; i < INITIAL_SATELLITES; i++) {
      // 前三分之一的卫星平均分配到每个星球上
      var planetIndex = Math.floor(Math.random() * planets.length)
      if (i < INITIAL_SATELLITES / 3) {
        planetIndex = i % INITIAL_PLANETS
      }
      var s = new fabric.Circle({
        fill: satelliteShadow.color,
        radius: 0.5 + Math.random() * 2,
        left: mouseX,
        top: mouseY,
        offset: { x: 0, y: 0 },
        mov: { x: mouseX, y: mouseY },
        speed: 0.01 + Math.random() * 0.05, // 0.01 --> global speed
        orbit: RADIUS * 0.7 + RADIUS * 0.5 * Math.random(),
        planet: planets[planetIndex],
      })
      s.setShadow(satelliteShadow)

      canvas.add(s)
      satellites.push(s)
    }
  }

  // 星球初始化
  function initPlanets() {
    var minLength = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) - 100
    var separatorLength = minLength / 2 / INITIAL_PLANETS
    for (var i = 0; i < INITIAL_PLANETS; i++) {
      var left = Math.random() * separatorLength + i * separatorLength
      var top = Math.random() * separatorLength + i * separatorLength
      var p = new fabric.Circle({
        fill: planetShadow.color,
        radius: 10,
        left: left,
        top: top,
        // 移动距离
        pos: 0,
        // 移动速度
        speed: 6.43 + i * 5,
        // 距离中心点半径
        centerRadius: Math.sqrt(Math.pow(left, 2) + Math.pow(top, 2))
      })
      p.setShadow(planetShadow)

      canvas.add(p)
      planets.push(p)
    }
    console.log(planets)
  }

  function initNebulas() {
    for (var i = 0; i < INITIAL_NEBULAS; i++) {

      var p = new fabric.Circle({
        fill: nebulaShadow.color,
        radius: Math.random() * 1.5,
        radiusRange: {min: 0.5, max: 1 + Math.random() * 0.6},
        scaleSpeed: Math.random() * 0.04,
        left: Math.random() * SCREEN_WIDTH,
        top: Math.random() * SCREEN_HEIGHT,
      })
      p.setShadow(nebulaShadow)

      canvas.add(p)
      nebulas.push(p)
    }
  }

  // 创建星球
  function createPlanet(x, y) {
    // Planet creation
    var p = new fabric.Circle({
      fill: planetShadow.color,
      radius: 10,
      left: x,
      top: y,
    })
    p.setShadow(planetShadow)

    canvas.add(p)
    planets.push(p)

    // 添加卫星
    var toAdd = 5
    for (var i = 0; i < toAdd; i++) {
      var s = new fabric.Circle({
        fill: '#eaeaea',
        radius: 0.5 + Math.random() * 2,
        left: p.left,
        top: p.top,
        offset: { x: 0, y: 0 },
        mov: { x: p.left, y: p.top },
        speed: 0.01 + Math.random() * 0.05, // 0.01 --> global speed
        orbit: RADIUS * 0.7 + RADIUS * 0.5 * Math.random(),
        planet: p,
      })
      s.setShadow(satelliteShadow)

      canvas.add(s)
      satellites.push(s)
    }
  }

  // ======================
  // === EVENT HANDLERS ===
  // ======================

  function documentMouseMoveHandler(event) {
    mouseX = event.clientX - (window.innerWidth - SCREEN_WIDTH) * 0.5
    mouseY = event.clientY - (window.innerHeight - SCREEN_HEIGHT) * 0.5
  }

  function documentMouseDownHandler(event) {
    for (var i = 0; i < planets.length; i++) {
      var p = planets[i]

      if (
        event.clientX >= p.left - p.radius - 10 &&
        event.clientX <= p.left + p.radius + 10 &&
        event.clientY >= p.top - p.radius - 10 &&
        event.clientY <= p.top + p.radius + 10
      ) {
        target = p
        break
      }
    }

    if (target == null) target = 'canvas'
  }

  function documentMouseUpHandler(event) {
    target = null
  }

  function windowResizeHandler() {
    SCREEN_WIDTH = window.innerWidth
    SCREEN_HEIGHT = window.innerHeight

    canvas.setWidth(SCREEN_WIDTH)
    canvas.setHeight(SCREEN_HEIGHT)
  }

  // =============
  // === UTILS ===
  // =============

  function distance(c1, c2) {
    var x1 = c1.left
    var x2 = c2.left
    var y1 = c1.top
    var y2 = c2.top

    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  }

  function numberOfSatellites(planet) {
    var count = 0

    for (var i = 0; i < satellites.length; i++)
      if (satellites[i].planet == planet) count++

    return count
  }

  function setSize() {
    for (var i = 0; i < planets.length; i++) {
      var p = planets[i]
      var neighbors = numberOfSatellites(p)

      p.radius += (neighbors - p.radius) * 0.025
      p.radius = Math.max(p.radius, 2)
    }
  }

  // =================
  // === MAIN LOOP ===
  // =================

  function loop() {
    // if (target) {
    // 	target.left = mouseX;
    // 	target.top = mouseY;
    // }

    // 关闭点击创建星球的功能
    // if (target == "canvas")
    // 	createPlanet(mouseX, mouseY);

    for (var i = 0; i < satellites.length; i++) {
      var s = satellites[i]

      // Rotation
      s.offset.x += s.speed
      s.offset.y += s.speed

      // Movement Effect
      s.mov.x += (s.planet.left - s.mov.x) * s.speed
      s.mov.y += (s.planet.top - s.mov.y) * s.speed

      // Change position
      s.left = s.mov.x + Math.cos(i + s.offset.x) * s.orbit
      s.top = s.mov.y + Math.sin(i + s.offset.y) * s.orbit

      // Check "attraction"
      for (var j = 0; j < planets.length; j++) {
        var p = planets[j]

        if (s.planet != p) {
          var d1 = distance(p, s)
          var d2 = distance(s.planet, s)

          if (d1 < d2 && d1 < PLANET_GRAVITATION) s.planet = p
        }
      }
    }

    for (var i = 0; i < nebulas.length; i++) {
      var n = nebulas[i]

      n.radius += n.scaleSpeed

      if (n.radius >= n.radiusRange.max || n.radius <= n.radiusRange.min) {
        n.scaleSpeed = n.scaleSpeed * -1
      }
    }

    setSize()

    // 确定行星位置
    for (var i = 0; i < planets.length; i++) {
      var p = planets[i]

      p.pos += Math.PI * p.speed / 20000
      p.left = SCREEN_WIDTH / 2 - Math.cos(p.pos) * p.centerRadius
      p.top = SCREEN_HEIGHT / 2 - Math.sin(p.pos) * p.centerRadius

    }

    canvas.renderAll()
  }
})()

window.onload = Universe.init

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })

// Canvas
const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl')!

// Scene
const scene = new THREE.Scene()

// Color
const colorObject = {
    depthColor: '#0000ff',
    surfaceColor: '#8888ff'
}

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)

// Material
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  uniforms: {
    uTime: { value: 0 },

    uBigWaveSpeed: { value: 0.75 },
    uBigWaveElevation: { value: 0.2 },
    uBigWaveFrequency: { value: new THREE.Vector2(4, 1.5) },

    uDepthColor: { value: new THREE.Color(colorObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(colorObject.surfaceColor) },
    uColorOffset: { value: 0.08 },
    uColorMultiplier: { value: 5 },

    uSmallWaveElevation: { value: 0.2 },
    uSmallWaveFrequency: { value: 3.0 },
    uSmallWaveSpeed: { value: 0.2 },
    uSmallWaveIterations: { value: 4.5 },
  },
})

gui
  .add(waterMaterial.uniforms.uBigWaveElevation, 'value')
  .min(0)
  .max(1)
  .step(0.001)
  .name('uBigWaveElevation')

gui
  .add(waterMaterial.uniforms.uBigWaveFrequency.value, 'x')
  .min(0)
  .max(10)
  .step(0.001)
  .name('uBigWaveFrequency (x)')

gui
  .add(waterMaterial.uniforms.uBigWaveFrequency.value, 'y')
  .min(0)
  .max(10)
  .step(0.001)
  .name('uBigWaveFrequency (y)')

gui
  .add(waterMaterial.uniforms.uBigWaveSpeed, 'value')
  .min(0)
  .max(4)
  .step(0.001)
  .name('uBigWaveSpeed')

gui
  .addColor(colorObject, 'depthColor')
  .onChange(() => {
    waterMaterial.uniforms.uDepthColor.value.set(colorObject.depthColor)
  })

gui
  .addColor(colorObject, 'surfaceColor')
  .onChange(() => {
    waterMaterial.uniforms.uSurfaceColor.value.set(colorObject.surfaceColor)
  })

gui
  .add(waterMaterial.uniforms.uColorOffset, 'value')
  .min(0)
  .max(1)
  .step(0.001)
  .name('uColorOffset')

gui
  .add(waterMaterial.uniforms.uColorMultiplier, 'value')
  .min(0)
  .max(10)
  .step(0.001)
  .name('uColorMultiplier')

gui
  .add(waterMaterial.uniforms.uSmallWaveElevation, 'value')
  .min(0)
  .max(1)
  .step(0.001)
  .name('uSmallWaveElevation')

gui
  .add(waterMaterial.uniforms.uSmallWaveFrequency, 'value')
  .min(0)
  .max(10)
  .step(0.001)
  .name('uSmallWaveFrequency')

gui
  .add(waterMaterial.uniforms.uSmallWaveSpeed, 'value')
  .min(0)
  .max(4)
  .step(0.001)
  .name('uSmallWaveSpeed')

gui
  .add(waterMaterial.uniforms.uSmallWaveIterations, 'value')
  .min(0)
  .max(10)
  .step(0.001)
  .name('uSmallWaveIterations')

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update materials
    waterMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
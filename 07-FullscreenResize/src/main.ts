import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const scene = new THREE.Scene()

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

// sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)

camera.position.z = 3
scene.add(camera)


// renderer
const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl')!
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true }) // antialias: true 抗锯齿设置，用于使渲染的边缘更平滑
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// controls
const controls = new OrbitControls(camera, canvas)
// controls.enabled = false
controls.enableDamping = true

// resize
window.addEventListener('resize', () => {
  // update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  // update renderer
  renderer.setSize(sizes.width, sizes.height)
  // update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
})

// fullscreen
window.addEventListener('dblclick', () => {
  const fullscreenElement = document.fullscreenElement || (document as any).webkitFullscreenElement
  if (fullscreenElement) {
    document.exitFullscreen()
  } else {
    canvas.requestFullscreen()
  }
})

// Animation
const tick = () => {
  controls.update()
  // render
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

tick()

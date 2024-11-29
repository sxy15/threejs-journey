import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const scene = new THREE.Scene()

// const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)

const geometry = new THREE.BufferGeometry()
const count = 50
const positions = new Float32Array(count * 3 * 3)
for (let i = 0; i < count * 3 * 3; i++) {
  positions[i] = Math.random() - 0.5
}
const positionsAttribute = new THREE.BufferAttribute(positions, 3)
geometry.setAttribute('position', positionsAttribute)

const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
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

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
  width: 800,
  height: 600,
}

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// const aspectRatio = sizes.width / sizes.height
// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio, 
//   1 * aspectRatio, 
//   1, 
//   -1, 
//   0.1, 
//   100)
camera.position.z = 3
scene.add(camera)

// renderer
const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl')!
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)

// controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true // smooth camera movement
// controls.target.y = 1
// controls.update()

const cursor = {
  x: 0,
  y: 0,
}
canvas.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5
  cursor.y = - (event.clientY / sizes.height - 0.5)
})

// Animation
const tick = () => {
  // update camera
  // camera.position.x = Math.sin(cursor.x * Math.PI) * 3
  // camera.position.z = Math.cos(cursor.y * Math.PI) * 3
  // camera.position.y = cursor.y * 5
  // camera.lookAt(mesh.position)
  
  controls.update()

  // render
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

tick()

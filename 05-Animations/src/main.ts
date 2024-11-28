import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// renderer
const canvas = document.querySelector('canvas.webgl')!
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)

// Animation
// const clock = new THREE.Clock()

gsap.to(mesh.position, { x: 2, duration: 1, delay: 1, ease: 'power1.inOut' })
const tick = () => {
  // update objects
  // mesh.rotation.y = clock.getElapsedTime()

  // mesh.position.x = Math.sin(clock.getElapsedTime())
  // mesh.position.y = Math.cos(clock.getElapsedTime())

  // render
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

tick()

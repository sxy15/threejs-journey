import './style.css'
import * as THREE from 'three'

const scene = new THREE.Scene()

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const mesh = new THREE.Mesh(geometry, material)

mesh.position.set(0.7, -0.6, 1)
console.log(mesh.position.length())
// normalize
// mesh.position.normalize()
// console.log(mesh.position.length()) // 1

// scale
mesh.scale.set(2, 0.5, 0.5)

// rotation
mesh.rotation.x = Math.PI * 0.25

// group
const group = new THREE.Group()
group.add(mesh)
const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
cube2.position.set(0.5, 1, 0.5)
group.add(cube2)
group.position.x = 0.1
scene.add(group)

// axes helper
const axesHelper = new THREE.AxesHelper(3)
scene.add(axesHelper)

// sizes
const sizes = {
  width: 800,
  height: 600,
}

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
// camera.position.x = 1
// camera.position.y = 1
scene.add(camera)

// lookAt
camera.lookAt(0, 0, 0) // default is (0, 0, 0)

// renderer
const canvas = document.querySelector('canvas.webgl')!
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
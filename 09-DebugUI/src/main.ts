import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import GUI from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Debug
const gui = new GUI({
  width: 260,
  title: 'Nice debug ui',
  closeFolders: false
})
// gui.close()
// gui.hide()

const debugObject: any = {
  color: '#dd8e4f',
  subdivision: 2,
  spin: () => {}
}

const scene = new THREE.Scene()

const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
const material = new THREE.MeshBasicMaterial({ color: debugObject.color, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)

const cubeTweaks = gui.addFolder('Cube')
// cubeTweaks.close()

cubeTweaks.add(mesh.position, 'y', -3, 3, 0.01)
cubeTweaks.add(mesh, 'visible')
cubeTweaks.add(material, 'wireframe')
cubeTweaks.addColor(debugObject, 'color').onChange((value: string) => {
  material.color.set(value)
})
debugObject.spin = () => {
  gsap.to(mesh.rotation, {
    y: mesh.rotation.y + Math.PI * 2
  })
}
cubeTweaks.add(debugObject, 'spin')
cubeTweaks.add(debugObject, 'subdivision', 1, 20, 1).onFinishChange((value: any) => {
  mesh.geometry.dispose() // 释放旧的几何体
  mesh.geometry = new THREE.BoxGeometry(
    1, 1, 1,
    value, value, value
  )
})

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

// Animation
const tick = () => {
  controls.update()
  // render
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

tick()

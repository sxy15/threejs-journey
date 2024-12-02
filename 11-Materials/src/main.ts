import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const scene = new THREE.Scene()

// 1. 加载图片的方式
// const image = new Image()
// const texture = new THREE.Texture(image)
// image.onload = () => {
//   texture.needsUpdate = true
//   document.body.appendChild(image)
// }
// image.src = new URL('./assets/Door_Wood_001_basecolor.jpg', import.meta.url).href

// 2. 使用 textureLoader 加载图片
const loadManager = new THREE.LoadingManager()
loadManager.onStart = () => {
  console.log('texture loading start')
}
loadManager.onLoad = () => {
  console.log('all textures loaded')
}
loadManager.onProgress = () => {
  console.log('texture loading progress')
}
loadManager.onError = () => {
  console.log('texture loading error')
}
const textureLoader = new THREE.TextureLoader(loadManager)
const baseColorTexture = textureLoader.load(new URL('./assets/Door_Wood_001_basecolor.jpg', import.meta.url).href)
const roughnessTexture = textureLoader.load(new URL('./assets/Door_Wood_001_roughness.jpg', import.meta.url).href)
const normalTexture = textureLoader.load(new URL('./assets/Door_Wood_001_normal.jpg', import.meta.url).href)
const heightTexture = textureLoader.load(new URL('./assets/Door_Wood_001_height.png', import.meta.url).href)
const ambientOcclusionTexture = textureLoader.load(new URL('./assets/Door_Wood_001_ambientOcclusion.jpg', import.meta.url).href)
const metallicTexture = textureLoader.load(new URL('./assets/Door_Wood_001_metallic.jpg', import.meta.url).href)
const opacityTexture = textureLoader.load(new URL('./assets/Door_Wood_001_opacity.jpg', import.meta.url).href)

baseColorTexture.repeat.x = 2
baseColorTexture.repeat.y = 3
baseColorTexture.wrapS = THREE.RepeatWrapping
baseColorTexture.wrapT = THREE.RepeatWrapping
baseColorTexture.offset.x = 0.5
baseColorTexture.offset.y = 0.5

const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
const material = new THREE.MeshBasicMaterial({ map: baseColorTexture })
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

// Animation
const tick = () => {
  controls.update()
  // render
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

tick()

import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import GUI from 'lil-gui'

const gui = new GUI()

const scene = new THREE.Scene()
const loaderManager = new THREE.LoadingManager()
loaderManager.onLoad = () => {
  console.log('loaded')
}
loaderManager.onError = () => {
  console.log('error')
}
const textureLoader = new THREE.TextureLoader(loaderManager)
const doorColorTexture = textureLoader.load(new URL('./assets/door/color.jpg', import.meta.url).href)
const doorAlphaTexture = textureLoader.load(new URL('./assets/door/alpha.jpg', import.meta.url).href)
const doorAmbientOcclusionTexture = textureLoader.load(new URL('./assets/door/ambientOcclusion.jpg', import.meta.url).href)
const doorHeightTexture = textureLoader.load(new URL('./assets/door/height.jpg', import.meta.url).href)
const doorNormalTexture = textureLoader.load(new URL('./assets/door/normal.jpg', import.meta.url).href)
const doorRoughnessTexture = textureLoader.load(new URL('./assets/door/roughness.jpg', import.meta.url).href)
const doorMetalnessTexture = textureLoader.load(new URL('./assets/door/metalness.jpg', import.meta.url).href)
const matcapTexture = textureLoader.load(new URL('./assets/matcaps/1.png', import.meta.url).href)
const gradientTexture = textureLoader.load(new URL('./assets/gradients/3.jpg', import.meta.url).href)

// 设置纹理的颜色空间
doorColorTexture.colorSpace = THREE.SRGBColorSpace
matcapTexture.colorSpace = THREE.SRGBColorSpace

// const material = new THREE.MeshBasicMaterial({
//   side: THREE.DoubleSide,
//   map: doorColorTexture,
// })

// // MeshBasicMaterial
// const material = new THREE.MeshBasicMaterial()
// material.color = new THREE.Color('#ff0000')
// material.map = doorColorTexture
// material.wireframe = true
// material.transparent = true
// material.opacity = 0.2
// material.alphaMap = doorAlphaTexture // 配合transparent使用

// // MeshNormalMaterial
// const material = new THREE.MeshNormalMaterial()
// // material.flatShading = true

// // MeshMatcapMaterial
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

// // MeshDepthMaterial
// const material = new THREE.MeshDepthMaterial()

// // MeshLambertMaterial
// const material = new THREE.MeshLambertMaterial()

// // MeshPhongMaterial
// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color(0x1188fff)

// // MeshToonMaterial
// const material = new THREE.MeshToonMaterial()
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// gradientTexture.generateMipmaps = false
// material.gradientMap = gradientTexture

// // MeshStandardMaterial
// const material = new THREE.MeshStandardMaterial({
//   metalness: 0.7,
//   roughness: 0.2,
// })
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 0.5
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.02
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5)
// material.transparent = true
// material.alphaMap = doorAlphaTexture

// gui.add(material, 'metalness').min(0).max(1).step(0.001)
// gui.add(material, 'roughness').min(0).max(1).step(0.001)

// MeshPhysicalMaterial
const material = new THREE.MeshPhysicalMaterial({
  metalness: 0.7,
  roughness: 0.2,
})
material.map = doorColorTexture
material.aoMap = doorAmbientOcclusionTexture
material.aoMapIntensity = 0.5
material.displacementMap = doorHeightTexture
material.displacementScale = 0.02
material.metalnessMap = doorMetalnessTexture
material.roughnessMap = doorRoughnessTexture
material.normalMap = doorNormalTexture
material.normalScale.set(0.5, 0.5)
material.transparent = true
material.alphaMap = doorAlphaTexture

// // clearcoat 清漆
// material.clearcoat = 1
// material.clearcoatRoughness = 0

// // sheen 光泽
// material.sheen = 0.5
// material.sheenRoughness = 0.5
// material.sheenColor.set(1, 1, 1)

// // iridescence 彩虹
// material.iridescence = 1
// material.iridescenceIOR = 1
// material.iridescenceThicknessRange = [ 100, 800]

// transmission 透明
material.transmission = 1
material.ior = 1.5
material.thickness = 0.5

gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)
// gui.add(material, 'clearcoat').min(0).max(1).step(0.001)
// gui.add(material, 'clearcoatRoughness').min(0).max(1).step(0.001)
// gui.add(material, 'sheen').min(0).max(1).step(0.001)
// gui.add(material, 'sheenRoughness').min(0).max(1).step(0.001)
// gui.addColor(material, 'sheenColor').onChange(() => {
//   material.sheenColor = new THREE.Color(material.sheenColor)
// })

// gui.add(material, 'iridescence').min(0).max(1).step(0.001)
// gui.add(material, 'iridescenceIOR').min(0).max(1).step(0.001)
// gui.add(material.iridescenceThicknessRange, '0').min(0).max(1000).step(0.001)
// gui.add(material.iridescenceThicknessRange, '1').min(0).max(1000).step(0.001)

gui.add(material, 'transmission').min(0).max(1).step(0.001)
gui.add(material, 'ior').min(0).max(1).step(0.001)
gui.add(material, 'thickness').min(0).max(1).step(0.001)

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 64, 64),
  material
)
sphere.position.x = -1.5
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1, 100, 100),
  material
)
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 48, 128),
  material
)
torus.position.x = 1.5
scene.add(sphere)
scene.add(plane)
scene.add(torus)

// // lights
// const ambientLight = new THREE.AmbientLight('#ffffff', 1)
// scene.add(ambientLight)
// const pointLight = new THREE.PointLight('#ffffff', 20)
// pointLight.position.set(2, 2, 2)
// scene.add(pointLight)

// environment map
const rgbeLoader = new RGBELoader()
rgbeLoader.load(new URL('./assets/environmentMap/2k.hdr', import.meta.url).href, (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping
  scene.background = environmentMap
  scene.environment = environmentMap
})

// sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)

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
const clock = new THREE.Clock()
const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // update
  sphere.rotation.y = 0.1 * elapsedTime
  plane.rotation.y = 0.1 * elapsedTime
  torus.rotation.y = 0.1 * elapsedTime

  sphere.rotation.x = -0.15 * elapsedTime
  plane.rotation.x = -0.15 * elapsedTime
  torus.rotation.x = -0.15 * elapsedTime

  controls.update()
  // render
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

tick()

import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const scene = new THREE.Scene()

const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

/**
 * fonts
 */
const fontLoader = new FontLoader()
fontLoader.load(new URL('./fonts/helvetiker_regular.typeface.json', import.meta.url).href, (font) => {
  const textGeometry = new TextGeometry('Hello three.js!', {
    font: font,
    size: 0.5,
    height: 0.2,
    depth: 0.1,
    curveSegments: 2,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 5
  });
  // textGeometry.computeBoundingBox()
  // console.log(textGeometry.boundingBox)

  // textGeometry.translate(
  //   - (textGeometry.boundingBox!.max.x - 0.01) * 0.5,
  //   - (textGeometry.boundingBox!.max.y - 0.01) * 0.5,
  //   - (textGeometry.boundingBox!.max.z - 0.02) * 0.5,
  // )

  textGeometry.center()

  const matcapTexture = new THREE.TextureLoader().load(new URL('./matcaps/1.png', import.meta.url).href)
  const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

  const text = new THREE.Mesh(
    textGeometry, 
    textMaterial
  )
  scene.add(text)


  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 10, 10)
  const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
  for(let i = 0; i < 100; i++) {
    const donut = new THREE.Mesh(donutGeometry, donutMaterial)
    donut.position.x = (Math.random() - 0.5) * 4
    donut.position.y = (Math.random() - 0.5) * 4
    donut.position.z = (Math.random() - 0.5) * 4
    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI
    donut.rotation.z = Math.random() * Math.PI

    const scale = Math.random() * 0.5 + 0.1
    donut.scale.set(scale, scale, scale)

    scene.add(donut)
  }
})


// sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// renderer
const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl')!
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true }) // antialias: true 抗锯齿设置，用于使渲染的边缘更平滑
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// Controls
const controls = new OrbitControls(camera, canvas)
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

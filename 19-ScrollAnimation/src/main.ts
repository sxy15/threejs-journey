import * as THREE from 'three'
import GUI from 'lil-gui'
import './style.css'

/**
 * Debug
 */
const gui = new GUI()

const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load(new URL('./gradients/3.jpg', import.meta.url).href)
gradientTexture.magFilter = THREE.NearestFilter

const parameters = {
    materialColor: '#ffeded'
}


/**
 * Base
 */
// Canvas
const canvas: HTMLCanvasElement  = document.querySelector('canvas.webgl')!

// Scene
const scene = new THREE.Scene()
const material = new THREE.MeshToonMaterial({ 
  color: parameters.materialColor,
  gradientMap: gradientTexture
 })

gui.addColor(parameters, 'materialColor').onChange(() => {
  material.color.set(parameters.materialColor)
})
const mesh1 = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.4, 16, 60),
  material
)

const mesh2 = new THREE.Mesh(
  new THREE.ConeGeometry(1, 2, 32),
  material
)

const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
)

scene.add(mesh1, mesh2, mesh3)

/**
 * Lights
 */
const light = new THREE.DirectionalLight('#ffffff', 1)
light.position.set(1, 1, 0)
scene.add(light)


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
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
// renderer.setClearAlpha(0.5)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
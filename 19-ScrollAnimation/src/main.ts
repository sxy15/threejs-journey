import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap'
import './style.css'


/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}


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
  particlesMaterial.color.set(parameters.materialColor)
})

const objectDistance = 4
const mesh1 = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.4, 16, 60),
  material
)
mesh1.position.y = -objectDistance * 0
const mesh2 = new THREE.Mesh(
  new THREE.ConeGeometry(1, 2, 32),
  material
)
mesh2.position.y = -objectDistance * 1

const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
)
mesh3.position.y = -objectDistance * 2

mesh1.position.x = 2
mesh2.position.x = - 2
mesh3.position.x = 2

scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3]
/**
 * Particles
 */
const particlesGeometry = new THREE.BufferGeometry()
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 10
  positions[i * 3 + 1] = objectDistance * 0.5 - (objectDistance * 3) * Math.random()
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const particlesMaterial = new THREE.PointsMaterial({
  color: parameters.materialColor,
  size: 0.02,
  sizeAttenuation: true,
})
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Lights
 */
const light = new THREE.DirectionalLight('#ffffff', 1)
light.position.set(1, 1, 0)
scene.add(light)


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
 * Group
 */
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

scene.add(cameraGroup)
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
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0
window.addEventListener('scroll', () => {
  scrollY = window.scrollY
  const newSection = Math.round(scrollY / sizes.height)
  if (newSection !== currentSection) {
    currentSection = newSection
    gsap.to(sectionMeshes[currentSection].rotation, {
      duration: 1.5,
      ease: 'power2.inOut',
      x: '+=' + 6,
      y: '+=' + 6,
      z: '+=' + 1.5
    })
  }
})

/**
 * Cursor
 */
const cursor = {
  x: 0,
  y: 0
}

window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5
  cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    camera.position.y = - (scrollY / sizes.height) * objectDistance

    const parallaxX = cursor.x
    const parallaxY = -cursor.y
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 4 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 4 * deltaTime

    for (const mesh of sectionMeshes) {
      mesh.rotation.x = elapsedTime * 0.1
      mesh.rotation.y = elapsedTime * 0.12
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
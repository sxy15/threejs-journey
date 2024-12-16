import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl')!

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * Particles
 */
// const particlesGeometry = new THREE.SphereGeometry(1, 50, 50)
// const particlesMaterial = new THREE.PointsMaterial({
//     size: 0.02,
//     sizeAttenuation: true
// })
// const particles = new THREE.Points(particlesGeometry, particlesMaterial)
// scene.add(particles)

const particlesCount = 500
const particlesGeometry = new THREE.BufferGeometry()
const particlesPositions = new Float32Array(particlesCount * 3)

const particlesColors = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount; i++) {
    // particlesPositions[i * 3] = (Math.random() - 0.5) * 4 // x
    // particlesPositions[i * 3 + 1] = 0 // y
    // particlesPositions[i * 3 + 2] = (Math.random() - 0.5) * 4 // z

    particlesPositions[i] = (Math.random() - 0.5) * 10 + 1

    particlesColors[i] = Math.random()
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(particlesColors, 3))
const particlesTexture = textureLoader.load(new URL('./particles/2.png', import.meta.url).href)
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    // color: '#ff8888',
    // map: particlesTexture
    transparent: true,
    alphaMap: particlesTexture,
    // alphaTest: 0.001, // 消除透明背景
    // depthTest: false,
    // depthWrite: false
})
particlesMaterial.vertexColors = true
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // particles.rotation.y = elapsedTime * 0.2

    for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3
        // particlesPositions[i3 + 0] = Math.sin(elapsedTime + i)

        const x = particlesGeometry.attributes.position.array[i3 + 0]
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    }

    // particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3))

    particlesGeometry.attributes.position.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
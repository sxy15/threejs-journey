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

const textureLoader = new THREE.TextureLoader()
const bakedShadow = textureLoader.load(new URL('./textures/bakedShadow.jpg', import.meta.url).href)


const simpleShadow = textureLoader.load(new URL('./textures/simpleShadow.jpg', import.meta.url).href)
/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4)
directionalLight.position.set(2, 2, - 1)
gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
directionalLight.castShadow = true

directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.bottom = - 2
directionalLight.shadow.camera.left = - 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6
directionalLight.shadow.radius = 5

scene.add(directionalLight)

// const directionalLightHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// // directionalLightHelper.visible = true
// scene.add(directionalLightHelper)

/**
 * spot light
 */
const spotLight = new THREE.SpotLight(0xffffff, 0.3, 10, Math.PI * 0.3)
spotLight.castShadow = true
spotLight.position.set(0, 2, 2)

spotLight.shadow.mapSize.set(1024, 1024)
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6
spotLight.shadow.camera.fov = 30

scene.add(spotLight.target)
scene.add(spotLight)

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightCameraHelper.visible = false
scene.add(spotLightCameraHelper)

/**
 * point light
 */
const pointLight = new THREE.PointLight(0xff0000, 0.3)
pointLight.castShadow = true
pointLight.position.set(-1, 1, 0)

pointLight.shadow.mapSize.set(1024, 1024)

scene.add(pointLight)

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
pointLightCameraHelper.visible = false
scene.add(pointLightCameraHelper)

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.set(0, 0, 0)
sphere.castShadow = true


const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
// const plane = new THREE.Mesh(
//     new THREE.PlaneGeometry(5, 5),
//     new THREE.MeshBasicMaterial({
//         map: bakedShadow,
//     })
// )
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5
plane.receiveShadow = true

const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadow,
    })
)
sphereShadow.rotation.x = - Math.PI * 0.5
sphereShadow.position.y = plane.position.y + 0.01
scene.add(sphere, plane, sphereShadow)

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
camera.position.x = 0
camera.position.y = 0
camera.position.z = 5
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
renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // update sphere position
    sphere.position.x = Math.cos(elapsedTime) * 1.5
    sphere.position.z = Math.sin(elapsedTime) * 1.5
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))

    // update sphere shadow position
    sphereShadow.position.x = sphere.position.x
    sphereShadow.position.z = sphere.position.z
    sphereShadow.material.opacity = (1 - Math.abs(sphere.position.y)) * 0.5

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
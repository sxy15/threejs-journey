import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const rgbeLoader = new RGBELoader()
const textureLoader = new THREE.TextureLoader()

/**
 * Base
 */
// Debug
const gui = new GUI()
const global = {
    envMapIntensity: 1
}

// Canvas
const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl')!

// Scene
const scene = new THREE.Scene()

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child: any) =>
    {
        if(child.isMesh && child.material.isMeshStandardMaterial)
        {
            child.material.envMapIntensity = global.envMapIntensity
            child.material.envMap = scene.environment

            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Environment map
 */
// Global intensity
global.envMapIntensity = 1
gui
    .add(global, 'envMapIntensity')
    .min(0)
    .max(10)
    .step(0.001)
    .onChange(updateAllMaterials)

// HDR (RGBE) equirectangular
rgbeLoader.load(new URL('./assets/environmentMaps/0/2k.hdr', import.meta.url).href, (environmentMap) =>
{
    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environmentMap
    scene.environment = environmentMap
})

/**
 * Models
 */
// // Helmet
// gltfLoader.load(
//     new URL('./assets/FlightHelmet/glTF/FlightHelmet.gltf', import.meta.url).href,
//     (gltf) =>
//     {
//         gltf.scene.scale.set(10, 10, 10)
//         scene.add(gltf.scene)

//         updateAllMaterials()
//     }
// )

// hamburger
gltfLoader.load(
    new URL('./assets/models/hamburger.glb', import.meta.url).href,
    (gltf) =>
    {
        gltf.scene.scale.set(0.4, 0.4, 0.4)
        gltf.scene.position.set(0, 2.5, 0)
        scene.add(gltf.scene)

        updateAllMaterials()
    }
)

// Floor
const floorTexture = textureLoader.load(new URL('./assets/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg', import.meta.url).href)
const floorNormalTexture = textureLoader.load(new URL('./assets/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.jpg', import.meta.url).href)
const floorAmbientOcclusionTexture = textureLoader.load(new URL('./assets/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg', import.meta.url).href)
floorTexture.colorSpace = THREE.SRGBColorSpace

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        map: floorTexture,
        normalMap: floorNormalTexture,
        aoMap: floorAmbientOcclusionTexture,
    })
)
floor.rotation.x = -Math.PI / 2
floor.receiveShadow = true
scene.add(floor)

// Wall
const wallTexture = textureLoader.load(new URL('./assets/textures/castle_brick_broken_06/castle_brick_broken_06_diff_1k.jpg', import.meta.url).href)
const wallNormalTexture = textureLoader.load(new URL('./assets/textures/castle_brick_broken_06/castle_brick_broken_06_nor_gl_1k.jpg', import.meta.url).href)
const wallAmbientOcclusionTexture = textureLoader.load(new URL('./assets/textures/castle_brick_broken_06/castle_brick_broken_06_arm_1k.jpg', import.meta.url).href)
wallTexture.colorSpace = THREE.SRGBColorSpace
const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        map: wallTexture,
        normalMap: wallNormalTexture,
        aoMap: wallAmbientOcclusionTexture,
        roughnessMap: wallAmbientOcclusionTexture,
        metalnessMap: wallAmbientOcclusionTexture
    })
)
wall.receiveShadow = true
wall.position.z = -4
wall.position.y = 4
scene.add(wall)

/**
 * Lights
 */
const directionLight = new THREE.DirectionalLight(0xFFFFFF, 1)
directionLight.position.set(-4, 6.5, 2.5)
directionLight.castShadow = true
directionLight.shadow.camera.far = 15
directionLight.shadow.mapSize.set(1024, 1024)
directionLight.shadow.normalBias = 0.027
directionLight.shadow.bias = -0.004
scene.add(directionLight)

directionLight.target.position.set(0, 4, 0)
// scene.add(directionLight.target)
directionLight.target.updateMatrixWorld()

gui.add(directionLight, 'castShadow').name('Cast Shadow')
gui.add(directionLight, 'intensity').min(0).max(10).step(0.001).name('Light Intensity')
gui.add(directionLight.position, 'x').min(-10).max(10).step(0.001).name('Light X')
gui.add(directionLight.position, 'y').min(-10).max(10).step(0.001).name('Light Y')
gui.add(directionLight.position, 'z').min(-10).max(10).step(0.001).name('Light Z')

gui.add(directionLight.shadow, 'normalBias').min(-1).max(1).step(0.001).name('Normal Bias')
gui.add(directionLight.shadow, 'bias').min(-1).max(1).step(0.001).name('Bias')
// const directionLightCameraHelper = new THREE.CameraHelper(directionLight.shadow.camera)
// scene.add(directionLightCameraHelper)

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
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 2.5

gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
})
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001).name('Tone Mapping Exposure')
/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
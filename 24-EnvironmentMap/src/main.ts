import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()
const globalGUI = {
    envMapIntensity: 3
}

// Canvas
const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl')!
const gltfLoader = new GLTFLoader()
const rgbeLoader = new RGBELoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

// Scene
const scene = new THREE.Scene()

// update all materials
const updateAllMaterials = () => {
    scene.traverse((child: any) => {
        if(child.isMesh && child.material.isMeshStandardMaterial) {
            // child.material.envMap = environmentMap //这个必须要加才行，scene.environment = environmentMap 不起作用？
            child.material.envMapIntensity = globalGUI.envMapIntensity
        }
    })
}


gui.add(globalGUI, 'envMapIntensity')
    .min(0)
    .max(10)
    .step(0.001)
    .onChange(updateAllMaterials)

/**
 * Environment Map
 */
// LDR cube texture
// const environmentMap = cubeTextureLoader.load([
//     new URL('./assets/environmentMaps/0/px.png', import.meta.url).href,
//     new URL('./assets/environmentMaps/0/nx.png', import.meta.url).href,
//     new URL('./assets/environmentMaps/0/py.png', import.meta.url).href,
//     new URL('./assets/environmentMaps/0/ny.png', import.meta.url).href,
//     new URL('./assets/environmentMaps/0/pz.png', import.meta.url).href,
//     new URL('./assets/environmentMaps/0/nz.png', import.meta.url).href,
// ])
// scene.background = environmentMap
// scene.environment = environmentMap
scene.backgroundBlurriness = 0.1
scene.backgroundIntensity = 0.8

// HDR (RGBE)
// rgbeLoader.load(new URL('./assets/environmentMaps/0/2k.hdr', import.meta.url).href, (environmentMap) => {
rgbeLoader.load(new URL('./assets/blender-2k.hdr', import.meta.url).href, (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping // 设置环境贴图的映射方式为 等距矩形反射映射

    // scene.background = environmentMap
    scene.environment = environmentMap
})

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
    new THREE.MeshStandardMaterial({
        roughness: 0.3,
        metalness: 1,
        color: 0xaaaaaa,
        // envMap: environmentMap
    })
)
// torusKnot.material.envMap = environmentMap
torusKnot.position.x = -4
torusKnot.position.y = 4
scene.add(torusKnot)


/**
 * Flight Helmet
 */
gltfLoader.load(new URL('./assets/FlightHelmet/glTF/FlightHelmet.gltf', import.meta.url).href, (gltf) => {
    gltf.scene.scale.set(10, 10, 10)
    scene.add(gltf.scene)

    updateAllMaterials()

})

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
    // Time
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
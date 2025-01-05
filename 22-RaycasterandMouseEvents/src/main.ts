import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
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

const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: 'red' })
)
object1.position.x = -2
scene.add(object1)

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: 'red' })
)
scene.add(object2)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: 'red' })
)
object3.position.x = 2
scene.add(object3)

let _gltf: any
const gltfLoader = new GLTFLoader()
gltfLoader.load(new URL('./models/Duck/glTF/Duck.gltf', import.meta.url).href, (gltf) => {
    scene.add(gltf.scene)
    _gltf = gltf
})

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()
// const origin = new THREE.Vector3(-3, 0, 0)
// const direction = new THREE.Vector3(1, 0, 0)
// raycaster.set(origin, direction)

// const intersect = raycaster.intersectObject(object1)
// console.log(intersect)

// const intersects = raycaster.intersectObjects([object1, object2, object3])
// console.log(intersects)


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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

const mouse = new THREE.Vector2(-1, -1)
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / sizes.width) * 2 - 1
    mouse.y = -(event.clientY / sizes.height) * 2 + 1

})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

// const origin = new THREE.Vector3(-3, 0, 0)
// const direction = new THREE.Vector3(1, 0, 0)
// raycaster.set(origin, direction)


let currentIntersect: any = null

window.addEventListener('click', () => {
    if(currentIntersect) {
        // currentIntersect.object.material.color.set('blue')
        console.log('clicked')
    }
})

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animate objects
    object1.position.y = Math.sin(elapsedTime * 0.3)
    object2.position.y = Math.sin(elapsedTime * 0.6)
    object3.position.y = Math.sin(elapsedTime * 0.9)

    // Raycaster
    // const objects = [object1, object2, object3]
    // const intersects: any[] = raycaster.intersectObjects(objects)
    // // console.log(intersects)
    // for(const object of objects) {
    //     object.material.color.set('red')
    // }
    // for (const intersect of intersects) {
    //     intersect.object.material.color.set('blue')
    // }

    raycaster.setFromCamera(mouse, camera)
    const objects = [object1, object2, object3]
    const intersects: any[] = raycaster.intersectObjects(objects)
    for (const object of objects) {
        object.material.color.set('red')
    }
    for (const intersect of intersects) {
        intersect.object.material.color.set('blue')
    }

    if(intersects.length > 0) {
        if(currentIntersect === null) {
            console.log('Mouse enter')
        }
        currentIntersect = intersects[0]
    } else {
        if(currentIntersect) {
            console.log('Mouse exit')
        }
        currentIntersect = null
    }


    if(_gltf) {
        const modelIntersect = raycaster.intersectObject(_gltf?.scene)
        if(modelIntersect.length > 0) {
            _gltf.scene.scale.set(1.5, 1.5, 1.5)
        } else {
            _gltf.scene.scale.set(1, 1, 1)
        }
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()